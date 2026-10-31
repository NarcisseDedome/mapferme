'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import AnimalCard, { AnimalCardData } from '@/components/AnimalCard';
import OrderModal from '@/components/OrderModal';

interface BoutiqueClientProps {
  initialAnimals: AnimalCardData[];
  categories: Array<{ id: string; name: string; slug: string }>;
  whatsappNumber: string;
  defaultCategory?: string;
  currency?: string;
}

export default function BoutiqueClient({
  initialAnimals,
  categories,
  whatsappNumber,
  defaultCategory = 'ALL',
  currency = 'FCFA',
}: BoutiqueClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available_only'>('available_only');
  const [selectedAnimalForOrder, setSelectedAnimalForOrder] = useState<AnimalCardData | null>(null);

  // Filter and sort animals locally for instantaneous, zero-latency responsiveness
  const filteredAnimals = useMemo(() => {
    return initialAnimals
      .filter((animal) => {
        // Category filter
        if (selectedCategory !== 'ALL' && animal.category?.slug !== selectedCategory) {
          return false;
        }

        // Availability filter
        if (filterAvailability === 'available_only') {
          if (animal.status !== 'DISPONIBLE' || animal.stock <= 0) {
            return false;
          }
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = animal.title.toLowerCase().includes(q);
          const matchDesc = animal.description.toLowerCase().includes(q);
          const matchRace = animal.race?.toLowerCase().includes(q) ?? false;
          if (!matchTitle && !matchDesc && !matchRace) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return 0; // default initial order (newest)
      });
  }, [initialAnimals, selectedCategory, searchQuery, sortBy, filterAvailability]);

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <div className="bg-white p-5 rounded-3xl border border-warm-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher par nom, race (ex: Fauve, Goliath, Sahélien)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warm-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          {/* Sort selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl border border-warm-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
            >
              <option value="newest">Trier par : Plus récents</option>
              <option value="price_asc">Prix : Moins cher au plus cher</option>
              <option value="price_desc">Prix : Plus cher au moins cher</option>
            </select>
          </div>

          {/* Availability toggle */}
          <div className="md:col-span-3 flex items-center justify-end">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none">
              <input
                type="checkbox"
                checked={filterAvailability === 'available_only'}
                onChange={(e) =>
                  setFilterAvailability(e.target.checked ? 'available_only' : 'all')
                }
                className="rounded border-warm-300 text-forest-700 focus:ring-forest-600 w-4 h-4"
              />
              <span>Disponibles uniquement</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-warm-100">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedCategory === 'ALL'
                ? 'bg-forest-900 text-white shadow-xs'
                : 'bg-warm-100 text-stone-700 hover:bg-warm-200'
            }`}
          >
            Toutes les catégories ({initialAnimals.length})
          </button>

          {categories.map((cat) => {
            const count = initialAnimals.filter((a) => a.category?.slug === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-forest-900 text-white shadow-xs'
                    : 'bg-warm-100 text-stone-700 hover:bg-warm-200'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[11px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Affichage de <strong>{filteredAnimals.length}</strong> animal(aux)
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-forest-800 hover:underline font-medium"
          >
            Effacer la recherche
          </button>
        )}
      </div>

      {/* Grid of Animals */}
      {filteredAnimals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              whatsappNumber={whatsappNumber}
              onOrderClick={(item) => setSelectedAnimalForOrder(item)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-warm-200 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-900 text-lg">
            Aucun animal ne correspond à vos critères
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Essayez de réinitialiser vos filtres ou de modifier votre terme de recherche.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
              setFilterAvailability('all');
            }}
            className="px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-semibold hover:bg-forest-900 transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Order Modal */}
      <OrderModal
        animal={selectedAnimalForOrder}
        isOpen={Boolean(selectedAnimalForOrder)}
        onClose={() => setSelectedAnimalForOrder(null)}
        currency={currency}
      />
    </div>
  );
}
