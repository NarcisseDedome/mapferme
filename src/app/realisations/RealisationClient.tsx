'use client';

import { useState, useMemo } from 'react';
import { Calendar, Tag, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface PortfolioItem {
  id: string;
  title: string;
  category?: string | null;
  description: string;
  imageUrl: string;
  eventDate?: string | Date | null;
}

interface RealisationClientProps {
  items: PortfolioItem[];
}

export default function RealisationClient({ items }: RealisationClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (it.category?.trim()) set.add(it.category.trim());
    });
    return Array.from(set);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'ALL') return items;
    return items.filter((it) => it.category?.trim() === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedCategory === 'ALL'
                ? 'bg-forest-900 text-white shadow-xs'
                : 'bg-warm-100 text-stone-700 hover:bg-warm-200'
            }`}
          >
            Toutes les réalisations ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'bg-warm-100 text-stone-700 hover:bg-warm-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Realizations */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group bg-white rounded-3xl overflow-hidden border border-warm-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/10] bg-stone-100 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                {item.category && (
                  <span className="absolute top-3 left-3 bg-forest-900/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
                    {item.category}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {item.eventDate && (
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mb-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(item.eventDate)}</span>
                    </div>
                  )}
                  <h3 className="font-bold text-base text-stone-900 group-hover:text-forest-800 transition leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-warm-100 text-xs text-forest-800 font-semibold group-hover:underline">
                  Agrandir et lire la description →
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-warm-200 p-8">
          <p className="text-stone-500 text-sm">Aucune réalisation dans cette catégorie.</p>
        </div>
      )}

      {/* Modal Lightbox */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-warm-200 max-h-[90vh] flex flex-col">
            <div className="relative aspect-[16/10] bg-stone-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-400">
                {activeItem.category && (
                  <span className="bg-forest-100 text-forest-900 font-bold px-2.5 py-0.5 rounded-md">
                    {activeItem.category}
                  </span>
                )}
                {activeItem.eventDate && <span>{formatDate(activeItem.eventDate)}</span>}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                {activeItem.title}
              </h2>

              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {activeItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
