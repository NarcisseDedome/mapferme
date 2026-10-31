'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export interface AdminAnimalItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  status: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewsCount?: number;
  race?: string | null;
  category?: { id: string; name: string } | null;
  images?: Array<{ id: string; url: string; isPrimary: boolean }>;
}

interface AdminAnimalsClientProps {
  initialAnimals: AdminAnimalItem[];
  currency?: string;
}

export default function AdminAnimalsClient({
  initialAnimals,
  currency = 'FCFA',
}: AdminAnimalsClientProps) {
  const router = useRouter();
  const [animals, setAnimals] = useState<AdminAnimalItem[]>(initialAnimals);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalViews = animals.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
  const totalAvailable = animals.filter(
    (a) => a.status === 'DISPONIBLE' && a.stock > 0
  ).length;

  const filteredAnimals = animals.filter((a) => {
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchRace = a.race?.toLowerCase().includes(q) ?? false;
      const matchCat = a.category?.name.toLowerCase().includes(q) ?? false;
      return matchTitle || matchRace || matchCat;
    }
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/animals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAnimals((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        showToast('✓ Statut de l’annonce mis à jour.');
      } else {
        const err = await res.json();
        alert(err.error || 'Erreur lors du changement de statut');
      }
    } catch (e) {
      console.error(e);
      alert('Erreur réseau.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleTogglePublish = async (animal: AdminAnimalItem) => {
    try {
      setLoadingId(animal.id);
      const res = await fetch(`/api/animals/${animal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !animal.isPublished }),
      });
      if (res.ok) {
        setAnimals((prev) =>
          prev.map((a) =>
            a.id === animal.id ? { ...a, isPublished: !a.isPublished } : a
          )
        );
        showToast(
          animal.isPublished
            ? 'Annonce masquée du catalogue.'
            : '✓ Annonce mise en ligne avec succès.'
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Confirmez-vous la suppression définitive de "${title}" ?`)) return;

    try {
      setLoadingId(id);
      const res = await fetch(`/api/animals/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAnimals((prev) => prev.filter((a) => a.id !== id));
        showToast('✓ Annonce supprimée.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Gestion du Cheptel & Annonces
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Publiez, modifiez, ajustez les prix, le stock et suivez les vues de vos publications.
          </p>
        </div>

        <Link
          href="/admin/animaux/nouveau"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-sm transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Ajouter un animal</span>
        </Link>
      </div>

      {/* Analytics Mini-Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-warm-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 block">Total annonces</span>
          <span className="text-xl font-black text-stone-900 mt-1 block">
            {animals.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-warm-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 block">Disponibles</span>
          <span className="text-xl font-black text-emerald-800 mt-1 block">
            {totalAvailable}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 shadow-xs">
          <span className="text-[11px] font-semibold text-forest-700 block flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-forest-600" />
            Total des vues
          </span>
          <span className="text-xl font-black text-forest-950 mt-1 block">
            {totalViews} consultations
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-warm-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 block">Réservés / Vendus</span>
          <span className="text-xl font-black text-amber-700 mt-1 block">
            {animals.filter((a) => a.status === 'RESERVE' || a.status === 'VENDU').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-warm-200/90 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher par titre, race, catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-warm-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-xl border border-warm-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="DISPONIBLE">🟢 Disponible</option>
          <option value="RESERVE">🟡 Réservé</option>
          <option value="VENDU">🔴 Vendu</option>
          <option value="EPUISE">⚪ Épuisé</option>
        </select>
      </div>

      {/* Table of Animals */}
      <div className="bg-white rounded-3xl border border-warm-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-warm-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-warm-200 text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Animal</th>
                <th className="px-4 py-3.5">Catégorie</th>
                <th className="px-4 py-3.5">Prix</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Statut de l'annonce</th>
                <th className="px-4 py-3.5">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-stone-400" />
                    Vues
                  </span>
                </th>
                <th className="px-4 py-3.5">En ligne</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {filteredAnimals.map((animal) => {
                const img =
                  animal.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=200&q=80';
                return (
                  <tr key={animal.id} className="hover:bg-warm-50/50 transition">
                    {/* Animal Details */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={animal.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-stone-900 truncate max-w-xs">
                              {animal.title}
                            </p>
                            <Link
                              href={`/animaux/${animal.slug}`}
                              target="_blank"
                              title="Voir la fiche publique"
                              className="text-stone-400 hover:text-forest-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                          <p className="text-[11px] text-stone-500 truncate">
                            {animal.race || 'Race non spécifiée'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 font-medium text-stone-700">
                      {animal.category?.name || '-'}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3.5 font-bold text-forest-900 whitespace-nowrap">
                      {formatPrice(animal.price, currency)}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3.5 font-semibold">
                      <span className={animal.stock <= 0 ? 'text-rose-600' : 'text-stone-800'}>
                        {animal.stock} u.
                      </span>
                    </td>

                    {/* Modifiable Status Selector */}
                    <td className="px-4 py-3.5">
                      <select
                        value={animal.status}
                        onChange={(e) => handleStatusChange(animal.id, e.target.value)}
                        disabled={loadingId === animal.id}
                        className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-600 transition shadow-2xs ${
                          animal.status === 'DISPONIBLE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : animal.status === 'RESERVE'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : animal.status === 'VENDU'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                        title="Cliquez pour changer le statut immédiatement"
                      >
                        <option value="DISPONIBLE">🟢 DISPONIBLE</option>
                        <option value="RESERVE">🟡 RÉSERVÉ</option>
                        <option value="VENDU">🔴 VENDU</option>
                        <option value="EPUISE">⚪ ÉPUISÉ</option>
                      </select>
                    </td>

                    {/* Views Count */}
                    <td className="px-4 py-3.5 font-semibold text-stone-800 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md text-[11px]">
                        <Eye className="w-3.5 h-3.5 text-stone-400" />
                        <span>{animal.viewsCount || 0}</span>
                      </span>
                    </td>

                    {/* Published toggle */}
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleTogglePublish(animal)}
                        disabled={loadingId === animal.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                          animal.isPublished
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        {animal.isPublished ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>En ligne</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-stone-400" />
                            <span>Masqué</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/animaux/${animal.id}/modifier`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-forest-800 hover:bg-forest-50 border border-forest-200 font-semibold text-[11px] transition"
                          title="Modifier tous les détails de l'annonce"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(animal.id, animal.title)}
                          disabled={loadingId === animal.id}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                          title="Supprimer définitivement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAnimals.length === 0 && (
          <div className="py-12 text-center text-xs text-stone-500">
            Aucun animal ne correspond aux filtres.
          </div>
        )}
      </div>
    </div>
  );
}
