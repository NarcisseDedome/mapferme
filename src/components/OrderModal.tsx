'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getPreparationOptions, getPreparationFee } from '@/lib/preparation';
import { AnimalCardData } from './AnimalCard';

interface OrderModalProps {
  animal: AnimalCardData | null;
  isOpen: boolean;
  onClose: () => void;
  currency?: string;
}

export default function OrderModal({
  animal,
  isOpen,
  onClose,
  currency = 'FCFA',
}: OrderModalProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [preparationOption, setPreparationOption] = useState('VIVANT');
  const [deliveryType, setDeliveryType] = useState<'FERME' | 'RELAIS' | 'DOMICILE'>('FERME');
  const [deliveryAddress, setDeliveryAddress] = useState("Retrait direct au domaine AYEKOBINOU SERVICE");
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !animal) return null;

  const maxStock = Math.max(1, animal.stock);
  const animalSubtotal = animal.price * quantity;
  const prepOptions = getPreparationOptions(animal.category?.slug);
  const singlePrepFee = getPreparationFee(preparationOption, animal.category?.slug);
  const totalPrepFee = singlePrepFee * quantity;
  const totalAmount = animalSubtotal + totalPrepFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerPhone.trim() || !customerLocation.trim()) {
      setError('Veuillez remplir votre nom, numéro de téléphone et ville/localisation.');
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
          animalId: animal.id,
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
        throw new Error(data.error || "Une erreur est survenue lors de l'enregistrement.");
      }

      // Close modal and redirect to success page
      onClose();
      router.push(`/commande-succes?orderNumber=${encodeURIComponent(data.order.orderNumber)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const primaryImg =
    animal.images?.find((img) => img.isPrimary)?.url ||
    animal.images?.[0]?.url ||
    '/uploads/poulets-plein-air-ferme.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-warm-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base sm:text-lg">Passer une commande</h3>
          </div>
          <button
            onClick={onClose}
            className="text-forest-200 hover:text-white p-1 rounded-lg hover:bg-forest-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Selected animal preview */}
          <div className="flex items-center gap-4 p-3 bg-warm-50 rounded-2xl border border-warm-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryImg}
              alt={animal.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-stone-900 truncate">{animal.title}</h4>
              <p className="text-xs text-stone-500">
                {animal.race || animal.category?.name || 'Sujet sélectionné'}
              </p>
              <p className="text-sm font-extrabold text-forest-800 mt-0.5">
                {formatPrice(animal.price, currency)} / unité
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quantity selector */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1.5 text-xs uppercase tracking-wider">
              Quantité souhaitée <span className="text-stone-400">(Max: {maxStock})</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border border-warm-300 font-bold text-stone-700 hover:bg-warm-100 flex items-center justify-center transition"
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
                className="w-20 text-center font-bold text-base py-2 rounded-xl border border-warm-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
              <button
                type="button"
                onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                className="w-10 h-10 rounded-xl border border-warm-300 font-bold text-stone-700 hover:bg-warm-100 flex items-center justify-center transition"
              >
                +
              </button>
              <div className="ml-auto text-right">
                <span className="text-xs text-stone-500 block">Sous-total animaux</span>
                <span className="text-base font-extrabold text-forest-900">
                  {formatPrice(animalSubtotal, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Preparation Option Selector */}
          <div className="space-y-2 pt-2 border-t border-warm-200">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-stone-800 text-xs uppercase tracking-wider">
                Préparation & Arrangement de l'animal
              </label>
              <span className="text-[11px] text-forest-700 font-medium">Tarif séparé & transparent</span>
            </div>
            <div className="space-y-2">
              {prepOptions.map((opt) => {
                const isSelected = preparationOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPreparationOption(opt.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-[#234B35] bg-[#E9F3EB] shadow-2xs ring-1 ring-[#234B35]'
                        : 'border-warm-200 bg-white hover:bg-warm-50'
                    }`}
                  >
                    <div className="space-y-0.5">
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
                        {opt.badge && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 pl-6 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`font-extrabold text-xs block ${isSelected ? 'text-[#234B35]' : 'text-stone-700'}`}>
                        {opt.fee === 0 ? 'Gratuit' : `+${formatPrice(opt.fee, currency)}`}
                      </span>
                      {opt.fee > 0 && quantity > 1 && (
                        <span className="text-[10px] text-stone-400 block">
                          Total: +{formatPrice(opt.fee * quantity, currency)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-3.5 rounded-2xl bg-warm-100/70 border border-warm-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Prix des animaux ({quantity} × {formatPrice(animal.price, currency)}) :</span>
              <span className="font-semibold">{formatPrice(animalSubtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Option préparation :</span>
              <span className={`font-semibold ${totalPrepFee > 0 ? 'text-[#234B35]' : ''}`}>
                {totalPrepFee === 0 ? 'Inclus (0 FCFA)' : `+${formatPrice(totalPrepFee, currency)} (${formatPrice(singlePrepFee, currency)} × ${quantity})`}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-warm-300 font-extrabold text-sm text-[#234B35]">
              <span>Total à régler :</span>
              <span className="text-base text-forest-900 font-black">{formatPrice(totalAmount, currency)}</span>
            </div>
          </div>

          {/* Customer information */}
          <div className="space-y-3 pt-2 border-t border-warm-200">
            <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider text-forest-800">
              Vos coordonnées
            </h4>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nom et Prénom <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex : Koffi Mensah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Téléphone / WhatsApp <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ex : +229 97 00 00 00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
                />
              </div>
            </div>

            {/* Mode de réception */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                Mode de réception souhaité
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('FERME');
                    setDeliveryAddress("Retrait direct au domaine AYEKOBINOU SERVICE");
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    deliveryType === 'FERME'
                      ? 'border-[#234B35] bg-[#E9F3EB] text-[#234B35] font-bold shadow-2xs'
                      : 'border-[#ECE6D9] bg-white text-[#292D29] hover:bg-[#F6F2E9]'
                  }`}
                >
                  <span className="block text-sm">🏡</span>
                  <span className="block font-bold">Au domaine</span>
                  <span className="text-[10px] text-[#557A46]">Gratuit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('RELAIS');
                    setDeliveryAddress('Point relais / Gare');
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    deliveryType === 'RELAIS'
                      ? 'border-[#234B35] bg-[#E9F3EB] text-[#234B35] font-bold shadow-2xs'
                      : 'border-[#ECE6D9] bg-white text-[#292D29] hover:bg-[#F6F2E9]'
                  }`}
                >
                  <span className="block text-sm">🚚</span>
                  <span className="block font-bold">Point relais</span>
                  <span className="text-[10px] text-[#8A6246]">Gare</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('DOMICILE');
                    setDeliveryAddress('Livraison à domicile');
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    deliveryType === 'DOMICILE'
                      ? 'border-[#234B35] bg-[#E9F3EB] text-[#234B35] font-bold shadow-2xs'
                      : 'border-[#ECE6D9] bg-white text-[#292D29] hover:bg-[#F6F2E9]'
                  }`}
                >
                  <span className="block text-sm">🏡</span>
                  <span className="block font-bold">À domicile</span>
                  <span className="text-[10px] text-[#8A6246]">Sur devis</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Adresse de livraison ou précisions de retrait
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Ex : Quartier, repère, ou retrait direct au domaine"
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Précisions ou instructions particulières
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex : Date souhaitée pour la livraison, âge préféré..."
                className="w-full px-3.5 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>
          </div>

          {/* Reassurance notes */}
          <div className="bg-forest-50 p-3 rounded-xl border border-forest-100 text-xs text-forest-800 space-y-1">
            <p className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              <span>Commande enregistrée directement dans notre système d'élevage.</span>
            </p>
            <p className="text-[11px] text-forest-700 pl-5">
              Vous recevrez un numéro de commande unique et pourrez immédiatement échanger avec l'éleveur sur WhatsApp.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-warm-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 text-sm font-medium hover:bg-stone-100 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-sm font-bold shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <span>Validation en cours...</span>
              ) : (
                <>
                  <span>Confirmer la commande</span>
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
