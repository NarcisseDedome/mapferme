'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, FolderTree, AlertCircle } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder: number;
  _count?: {
    animals: number;
  };
}

interface AdminCategoriesClientProps {
  initialCategories: CategoryItem[];
}

export default function AdminCategoriesClient({
  initialCategories,
}: AdminCategoriesClientProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Le nom de la catégorie est obligatoire.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          displayOrder: parseInt(displayOrder, 10) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création.');
      }

      setCategories((prev) => [...prev, data.category]);
      setName('');
      setDescription('');
      setDisplayOrder('0');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
          Catégories du Cheptel
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Organisez vos espèces : Lapins, Poulets & Volailles, Cabris & Chèvres, etc.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Add category form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 border-b border-warm-100 pb-2">
            Ajouter une nouvelle catégorie
          </h2>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nom de la catégorie <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Canards & Dindes"
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Description courte
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex : Volailles aquatiques et dindons fermiers vigoureux."
                className="w-full px-3.5 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Ordre d'affichage (priorité)
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-24 px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>{loading ? 'Création...' : 'Créer la catégorie'}</span>
            </button>
          </form>
        </div>

        {/* Existing categories list */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 border-b border-warm-100 pb-2">
            Catégories existantes ({categories.length})
          </h2>

          <div className="divide-y divide-warm-100 text-xs">
            {categories.map((cat) => (
              <div key={cat.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{cat.name}</span>
                    <span className="text-[10px] bg-warm-100 text-stone-600 px-2 py-0.5 rounded-md font-mono">
                      /{cat.slug}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-stone-500 text-xs mt-0.5">{cat.description}</p>
                  )}
                  <p className="text-[11px] text-forest-700 mt-1 font-medium">
                    {cat._count?.animals || 0} animal(aux) rattaché(s)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
