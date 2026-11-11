'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Upload,
  Plus,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Save,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
}

interface AnimalFormProps {
  categories: CategoryOption[];
  initialData?: {
    id?: string;
    title: string;
    categoryId: string;
    description: string;
    price: number;
    stock: number;
    status: string;
    isPublished: boolean;
    isFeatured: boolean;
    age?: string | null;
    race?: string | null;
    sex?: string | null;
    weight?: string | null;
    location?: string | null;
    images?: Array<{ url: string }>;
  };
  isEdit?: boolean;
}

export default function AnimalForm({
  categories,
  initialData,
  isEdit = false,
}: AnimalFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || categories[0]?.id || ''
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '15000');
  const [stock, setStock] = useState(initialData?.stock?.toString() || '1');
  const [status, setStatus] = useState(initialData?.status || 'DISPONIBLE');
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished !== undefined ? initialData.isPublished : true
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured !== undefined ? initialData.isFeatured : false
  );
  const [age, setAge] = useState(initialData?.age || '');
  const [race, setRace] = useState(initialData?.race || '');
  const [sex, setSex] = useState(initialData?.sex || '');
  const [weight, setWeight] = useState(initialData?.weight || '');
  const [location, setLocation] = useState(initialData?.location || '');

  // Images state
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((i) => i.url) || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setError(null);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du téléchargement');
      }
      setImages((prev) => [...prev, data.url]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Échec du téléversement');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !categoryId || !description.trim()) {
      setError('Veuillez renseigner le titre, la catégorie et la description.');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setError('Le prix unitaire doit être un nombre positif.');
      return;
    }

    const numericStock = parseInt(stock, 10);
    if (isNaN(numericStock) || numericStock < 0) {
      setError('Le stock doit être un nombre positif ou nul.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        categoryId,
        description: description.trim(),
        price: numericPrice,
        stock: numericStock,
        status,
        isPublished,
        isFeatured,
        age: age.trim() || undefined,
        race: race.trim() || undefined,
        sex: sex.trim() || undefined,
        weight: weight.trim() || undefined,
        location: location.trim() || undefined,
        images,
      };

      const url = isEdit && initialData?.id ? `/api/animals/${initialData.id}` : '/api/animals';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’enregistrement');
      }

      router.push('/admin/animaux');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/animaux"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la liste des animaux</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-warm-200/90 shadow-xs overflow-hidden">
        <div className="bg-forest-900 text-white p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold">
            {isEdit ? 'Modifier l’annonce' : 'Ajouter un animal au cheptel'}
          </h1>
          <p className="text-xs text-forest-200 mt-1">
            Renseignez les détails avec précision pour informer vos acheteurs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-xs text-stone-700">
          {error && (
            <div className="flex items-start gap-2 p-3.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* General Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-900 border-b border-warm-200 pb-2">
              Informations générales
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Nom ou Titre de l'annonce <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Couple de Lapins Fauve de Bourgogne"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Catégorie <span className="text-rose-600">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Prix unitaire (FCFA) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex : 25000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Quantité disponible (Stock) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Ex : 5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Statut de disponibilité
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs bg-white font-semibold"
                >
                  <option value="DISPONIBLE">🟢 Disponible</option>
                  <option value="RESERVE">🟡 Réservé</option>
                  <option value="VENDU">🔴 Vendu</option>
                  <option value="EPUISE">⚪ Épuisé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Morphological / Animal Specs */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-stone-900 border-b border-warm-200 pb-2">
              Caractéristiques zootechniques (optionnelles)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Race</label>
                <input
                  type="text"
                  value={race}
                  onChange={(e) => setRace(e.target.value)}
                  placeholder="Ex : Goliath, Fauve..."
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Âge</label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ex : 4 mois, Adulte..."
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Sexe</label>
                <input
                  type="text"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  placeholder="Ex : Mâle, Femelle, Couple..."
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Poids</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ex : 3.5 kg..."
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Localisation ou conditions de retrait
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex : Domaine AYEKOBINOU SERVICE (Livraison possible à Cotonou / Calavi)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <label className="block font-semibold text-stone-800 text-sm">
              Description détaillée <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'alimentation, l'état sanitaire, les vaccinations, les atouts de ce sujet..."
              className="w-full p-3.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
            />
          </div>

          {/* Photos Management */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-stone-900 border-b border-warm-200 pb-2">
              Photographies de l'animal
            </h3>

            {/* Existing images gallery */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-warm-200 group bg-stone-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition opacity-90 group-hover:opacity-100"
                      title="Supprimer la photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 bg-forest-900/90 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                        Principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload or Add Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              {/* File upload */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Téléverser une photo (fichier JPG/PNG/WebP max 10 Mo)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-forest-50 file:text-forest-800 hover:file:bg-forest-100 cursor-pointer"
                  />
                  {uploading && (
                    <span className="text-[11px] text-forest-700 block mt-1">
                      Téléversement en cours...
                    </span>
                  )}
                </div>
              </div>

              {/* Or Direct Image URL */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Ou ajouter une URL d'image web
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 rounded-xl bg-warm-200 hover:bg-warm-300 font-semibold text-stone-800 transition"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visibility and Featured toggles */}
          <div className="pt-4 border-t border-warm-200 flex flex-wrap gap-6 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-warm-300 text-forest-700 focus:ring-forest-600"
              />
              <span className="font-semibold text-stone-800">
                Publier cette annonce immédiatement sur le site public
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-warm-300 text-forest-700 focus:ring-forest-600"
              />
              <span className="font-semibold text-stone-800">
                Mettre en avant sur la page d'accueil
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-warm-200 flex items-center justify-end gap-3">
            <Link
              href="/admin/animaux"
              className="px-5 py-2.5 rounded-xl border border-warm-300 text-stone-700 hover:bg-warm-50 font-semibold transition text-xs"
            >
              Annuler
            </Link>

            <button
              type="submit"
              disabled={loading || uploading}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <span>Enregistrement...</span>
              ) : (
                <>
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>{isEdit ? 'Mettre à jour l’annonce' : 'Enregistrer l’annonce'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
