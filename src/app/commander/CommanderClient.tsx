'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getPreparationOptions, getPreparationFee } from '@/lib/preparation';
import { AnimalCardData } from '@/components/AnimalCard';

interface CommanderClientProps {
  animals: AnimalCardData[];
  initialAnimalId?: string;
  currency?: string;
}

export default function CommanderClient({
  animals,
  initialAnimalId,
  currency = 'FCFA',
}: CommanderClientProps) {
  const router = useRouter();

  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(
    initialAnimalId || animals[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [preparationOption, setPreparationOption] = useState<string>('VIVANT');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [deliveryType, setDeliveryType] = useState<'FERME' | 'RELAIS' | 'DOMICILE'>('FERME');
  const [deliveryAddress, setDeliveryAddress] = useState("Retrait direct à l'élevage Ferme MAP");
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAnimal = animals.find((a) => a.id === selectedAnimalId);
  const maxStock = selectedAnimal ? Math.max(1, selectedAnimal.stock) : 1;
  const animalSubtotal = selectedAnimal ? selectedAnimal.price * quantity : 0;
  const prepOptions = selectedAnimal ? getPreparationOptions(selectedAnimal.category?.slug) : [];
  const singlePrepFee = selectedAnimal ? getPreparationFee(preparationOption, selectedAnimal.category?.slug) : 0;
  const totalPrepFee = singlePrepFee * quantity;
  const totalAmount = animalSubtotal + totalPrepFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedAnimal) {
      setError('Veuillez sélectionner un animal à commander.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !customerLocation.trim()) {
      setError('Veuillez renseigner votre nom, votre numéro de téléphone et votre ville.');
      return;
    }

    if (quantity < 1 || quantity > maxStock) {
      setError(`La quantité doit être comprise entre 1 et ${maxStock}.`);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalId: selectedAnimal.id,
          quantity,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerLocation: customerLocation.trim(),
          preparationOption,
          deliveryAddress: deliveryAddress.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la validation de votre commande.');
      }

      router.push(`/commande-succes?orderNumber=${encodeURIComponent(data.order.orderNumber)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (animals.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-warm-200 p-8">
        <h2 className="text-xl font-bold text-stone-900">Aucun animal disponible actuellement</h2>
        <p className="text-xs text-stone-500 mt-2">
          Tous nos sujets sont actuellement réservés ou vendus. Revenez très bientôt !
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-warm-200/90 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-forest-900 text-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Passer une commande directe</h1>
              <p className="text-xs text-forest-200 mt-0.5">
                Remplissez les informations ci-dessous. Votre commande sera immédiatement enregistrée dans le système de l'élevage.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {error && (
            <div className="flex items-start gap-2 p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Sélection de l'animal */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900">
              1. Choix de l'animal ou du lot
            </label>
            <select
              value={selectedAnimalId}
              onChange={(e) => {
                setSelectedAnimalId(e.target.value);
                setQuantity(1);
              }}
              className="w-full p-3.5 rounded-xl border border-warm-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
            >
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.category?.name}) - {formatPrice(a.price, currency)} - Stock : {a.stock}
                </option>
              ))}
            </select>

            {selectedAnimal && (
              <div className="flex items-center gap-4 p-4 bg-warm-50 rounded-2xl border border-warm-200 mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedAnimal.images?.[0]?.url || 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=400&q=80'}
                  alt={selectedAnimal.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">{selectedAnimal.title}</h4>
                  <p className="text-xs text-stone-500">
                    {selectedAnimal.race && `Race : ${selectedAnimal.race} • `}
                    {selectedAnimal.age && `Âge : ${selectedAnimal.age}`}
                  </p>
                  <p className="text-sm font-extrabold text-forest-900 mt-1">
                    {formatPrice(selectedAnimal.price, currency)} / unité
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 2. Quantité */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900">
              2. Quantité souhaitée (Stock disponible : {maxStock})
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 rounded-xl border border-warm-300 font-bold text-stone-700 hover:bg-warm-100 flex items-center justify-center transition"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={maxStock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(maxStock, Math.max(1, val)));
                }}
                className="w-24 text-center font-bold text-base py-2.5 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
              <button
                type="button"
                onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                className="w-11 h-11 rounded-xl border border-warm-300 font-bold text-stone-700 hover:bg-warm-100 flex items-center justify-center transition"
              >
                +
              </button>
              <div className="ml-auto text-right">
                <span className="text-xs text-stone-500 block">Sous-total animaux</span>
                <span className="text-xl font-extrabold text-forest-900">
                  {formatPrice(animalSubtotal, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Option de préparation & découpe */}
          <div className="space-y-3 pt-4 border-t border-warm-200">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900">
                3. Préparation & Découpe de l'animal
              </label>
              <span className="text-xs text-forest-700 font-semibold">Tarif séparé & transparent</span>
            </div>
            <p className="text-xs text-stone-600">
              Choisissez comment vous souhaitez recevoir vos animaux (remis vivants, nettoyés prêts-à-cuire, marinés ou cuits sur braise) :
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {prepOptions.map((opt) => {
                const isSelected = preparationOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPreparationOption(opt.id)}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-[#234B35] bg-[#E9F3EB] shadow-xs ring-2 ring-[#234B35]'
                        : 'border-warm-200 bg-white hover:bg-warm-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#234B35] bg-[#234B35]' : 'border-stone-400'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className={`font-bold text-xs ${isSelected ? 'text-[#234B35]' : 'text-stone-900'}`}>
                            {opt.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 pl-6 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    <div className="pl-6 pt-2 border-t border-warm-200/60 flex items-center justify-between">
                      {opt.badge ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                          {opt.badge}
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-400">Option standard</span>
                      )}
                      <div className="text-right">
                        <span className={`font-black text-xs ${isSelected ? 'text-[#234B35]' : 'text-stone-800'}`}>
                          {opt.fee === 0 ? 'Gratuit (0 FCFA)' : `+${formatPrice(opt.fee, currency)} / sujet`}
                        </span>
                        {opt.fee > 0 && quantity > 1 && (
                          <span className="text-[10px] text-stone-400 block">
                            Total: +{formatPrice(opt.fee * quantity, currency)}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Coordonnées */}
          <div className="space-y-4 pt-4 border-t border-warm-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900">
              4. Vos coordonnées client
            </label>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nom complet <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex : Koffi Mensah"
                className="w-full px-4 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Numéro de téléphone / WhatsApp <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ex : +229 97 00 00 00"
                  className="w-full px-4 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Ville / Localité <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  placeholder="Ex : Cotonou, Calavi, Parakou..."
                  className="w-full px-4 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
                />
              </div>
            </div>

            {/* Mode de livraison / réception */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                Mode de réception souhaité
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('FERME');
                    setDeliveryAddress("Retrait direct à l'élevage Ferme MAP");
                  }}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    deliveryType === 'FERME'
                      ? 'border-[#234B35] bg-[#E9F3EB] text-[#234B35] font-bold shadow-2xs'
                      : 'border-[#ECE6D9] bg-white text-[#292D29] hover:bg-[#F6F2E9]'
                  }`}
                >
                  <span className="block text-sm mb-1">🚜</span>
                  <span className="block font-bold">Retrait à la ferme</span>
                  <span className="text-[10px] text-[#557A46]">Gratuit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('RELAIS');
                    setDeliveryAddress('Point relais / Gare routière');
                  }}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    deliveryType === 'RELAIS'
                      ? 'border-[#234B35] bg-[#E9F3EB] text-[#234B35] font-bold shadow-2xs'
                      : 'border-[#ECE6D9] bg-white text-[#292D29] hover:bg-[#F6F2E9]'
                  }`}
                >
                  <span className="block text-sm mb-1">🚚</span>
                  <span className="block font-bold">Point relais / Gare</span>
                  <span className="text-[10px] text-[#8A6246]">Expédition sécurisée</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('DOMICILE');
                    setDeliveryAddress('Livraison à domicile');
                  }}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    deliveryType === 'DOMICILE'
                      ? 'border-[#234B35] bg-[#E9F3EB] text-[#234B35] font-bold shadow-2xs'
                      : 'border-[#ECE6D9] bg-white text-[#292D29] hover:bg-[#F6F2E9]'
                  }`}
                >
                  <span className="block text-sm mb-1">🏡</span>
                  <span className="block font-bold">Livraison à domicile</span>
                  <span className="text-[10px] text-[#8A6246]">Selon localité</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Précisions d'adresse ou lieu de rendez-vous
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Ex : Retrait direct à la ferme le samedi matin"
                className="w-full px-4 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Précisions utiles
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex : Préférence sur la couleur des lapereaux, créneau horaire..."
                className="w-full px-4 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>
          </div>

          {/* Récapitulatif tarifaire transparent */}
          <div className="p-5 rounded-2xl bg-warm-100/80 border border-warm-200 space-y-2 text-xs">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-forest-800">
              Détail du montant à régler
            </h4>
            <div className="flex justify-between text-stone-700">
              <span>Prix des animaux ({quantity} × {selectedAnimal && formatPrice(selectedAnimal.price, currency)}) :</span>
              <span className="font-semibold">{formatPrice(animalSubtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-stone-700">
              <span>Préparation & arrangement de l'animal :</span>
              <span className={`font-semibold ${totalPrepFee > 0 ? 'text-[#234B35]' : ''}`}>
                {totalPrepFee === 0 ? 'Inclus (0 FCFA)' : `+${formatPrice(totalPrepFee, currency)} (${formatPrice(singlePrepFee, currency)} × ${quantity})`}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-warm-300 font-extrabold text-stone-900">
              <span className="text-sm text-[#234B35]">Montant total à régler :</span>
              <span className="text-xl text-forest-900 font-black">{formatPrice(totalAmount, currency)}</span>
            </div>
          </div>

          {/* Reassurance */}
          <div className="bg-forest-50 p-4 rounded-2xl border border-forest-100 text-xs text-forest-800 space-y-1">
            <p className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
              <span>Commande officielle sans paiement préalable en ligne</span>
            </p>
            <p className="text-[11px] text-forest-700 pl-6">
              Le paiement et la remise des animaux s'effectuent directement lors de la livraison ou du retrait, selon les termes convenus avec le propriétaire.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-warm-200">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white text-sm font-bold shadow-md transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span>Enregistrement...</span>
              ) : (
                <>
                  <span>Valider et Enregistrer ma commande</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
