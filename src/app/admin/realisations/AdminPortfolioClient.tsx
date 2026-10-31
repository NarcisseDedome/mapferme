'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface PortfolioItem {
  id: string;
  title: string;
  category?: string | null;
  description: string;
  imageUrl: string;
  eventDate?: string | Date | null;
  isPublished: boolean;
}

interface AdminPortfolioClientProps {
  initialProjects: PortfolioItem[];
}

export default function AdminPortfolioClient({
  initialProjects,
}: AdminPortfolioClientProps) {
  const [projects, setProjects] = useState<PortfolioItem[]>(initialProjects);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Installations');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (!res.ok) throw new Error(data.error || 'Erreur upload');
      setImageUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Échec du téléversement');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !imageUrl.trim()) {
      setError('Titre, description et image sont obligatoires.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          eventDate: eventDate ? new Date(eventDate) : undefined,
          isPublished: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la création.');

      setProjects((prev) => [data.project, ...prev]);
      setTitle('');
      setDescription('');
      setImageUrl('');
      setEventDate('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette réalisation ?')) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
          Gestion du Portfolio & Réalisations
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Partagez des photos de vos parcs, aménagements, soins et vie quotidienne de l'élevage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 border-b border-warm-100 pb-2">
            Ajouter une publication
          </h2>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-3.5 text-xs text-stone-700">
            <div>
              <label className="block font-semibold mb-1">
                Titre de la réalisation <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Nouveaux clapiers semi-naturels"
                className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Catégorie</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Installations, Santé, Quotidien..."
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Date associée</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Description de l'activité <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expliquez ce qui a été réalisé..."
                className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Photographie <span className="text-rose-600">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-forest-50 file:text-forest-800"
              />
              <div className="mt-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Ou URL directe (https://images.unsplash.com/...)"
                  className="w-full px-3 py-1.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                />
              </div>
              {imageUrl && (
                <div className="mt-2 aspect-[16/9] rounded-xl overflow-hidden border border-warm-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>{loading ? 'Enregistrement...' : 'Publier la réalisation'}</span>
            </button>
          </form>
        </div>

        {/* Existing portfolio items */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 border-b border-warm-100 pb-2">
            Réalisations enregistrées ({projects.length})
          </h2>

          <div className="space-y-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-2xl bg-warm-50 border border-warm-200/80 flex flex-col sm:flex-row gap-4 items-start"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proj.imageUrl}
                  alt={proj.title}
                  className="w-full sm:w-28 h-24 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-forest-100 text-forest-800 px-2 py-0.5 rounded-md">
                      {proj.category || 'Général'}
                    </span>
                    {proj.eventDate && (
                      <span className="text-[10px] text-stone-400">
                        {formatDate(proj.eventDate)}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm mt-1">{proj.title}</h4>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">
                    {proj.description}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition self-end sm:self-start"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
