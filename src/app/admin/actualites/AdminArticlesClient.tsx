'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, Eye, EyeOff, BookOpen, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface AdminArticleItem {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  isPublished: boolean;
  createdAt: string | Date;
}

interface AdminArticlesClientProps {
  initialArticles: AdminArticleItem[];
}

export default function AdminArticlesClient({
  initialArticles,
}: AdminArticlesClientProps) {
  const [articles, setArticles] = useState<AdminArticleItem[]>(initialArticles);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState("Conseils d'élevage");
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
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
      setCoverImage(data.url);
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

    if (!title.trim() || !content.trim()) {
      setError('Le titre et le contenu sont obligatoires.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim(),
          excerpt: excerpt.trim() || undefined,
          content: content.trim(),
          coverImage: coverImage.trim() || undefined,
          isPublished: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la création.');

      setArticles((prev) => [data.article, ...prev]);
      setTitle('');
      setExcerpt('');
      setContent('');
      setCoverImage('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (art: AdminArticleItem) => {
    try {
      const res = await fetch(`/api/articles/${art.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !art.isPublished }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === art.id ? { ...a, isPublished: !a.isPublished } : a))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement cet article ?')) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
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
          Gestion des Conseils & Actualités
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Publiez des guides pour vos acquéreurs : alimentation, hygiène et vie de l'exploitation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 border-b border-warm-100 pb-2">
            Rédiger un nouvel article
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
                Titre de l'article <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Comment réussir l'alimentation de ses poussins"
                className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Thématique / Catégorie</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Conseils, Alimentation, Soins..."
                className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Résumé court</label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Phrase d'accroche pour la carte d'aperçu..."
                className="w-full px-3 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Contenu de l'article <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Rédigez les explications détaillées..."
                className="w-full p-3 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Image de couverture</label>
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
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Ou URL web (https://images.unsplash.com/...)"
                  className="w-full px-3 py-1.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>{loading ? 'Publication...' : 'Publier l’article'}</span>
            </button>
          </form>
        </div>

        {/* List of articles */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 border-b border-warm-100 pb-2">
            Articles publiés & brouillons ({articles.length})
          </h2>

          <div className="divide-y divide-warm-100">
            {articles.map((art) => (
              <div key={art.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm truncate">{art.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-400 text-[11px] mt-0.5">
                    <span>{art.category || 'Conseils'}</span>
                    <span>• {formatDate(art.createdAt)}</span>
                  </div>
                  {art.excerpt && (
                    <p className="text-stone-600 text-xs line-clamp-1 mt-1">{art.excerpt}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(art)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                      art.isPublished
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-stone-100 text-stone-500 border-stone-200'
                    }`}
                  >
                    {art.isPublished ? (
                      <>
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span>En ligne</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 text-stone-400" />
                        <span>Brouillon</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(art.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
