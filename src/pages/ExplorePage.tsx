import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Flame, Clock, Sparkles } from 'lucide-react';
import { Product, CategoryType } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ExplorePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onSelectSeller: (sellerId: string) => void;
  cartProductIds: string[];
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onSelectSeller,
  cartProductIds,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [prepStatusFilter, setPrepStatusFilter] = useState<'All' | 'Preparing Now' | 'Fresh Today'>('All');
  const [maxDistance, setMaxDistance] = useState<number>(5);
  const [sortBy, setSortBy] = useState<'rating' | 'price-low' | 'price-high'>('rating');

  // Filter
  const filtered = products.filter((p) => {
    const matchesSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(search.toLowerCase()) ||
      p.ingredients.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;

    const matchesStatus =
      prepStatusFilter === 'All' ||
      (prepStatusFilter === 'Preparing Now' && (p.preparationStatus === 'Preparing Now' || p.preparationStatus === 'Cooking')) ||
      (prepStatusFilter === 'Fresh Today' && (p.preparationStatus === 'Prepared Today' || p.preparationStatus === 'Fresh Batch'));

    const matchesDistance = p.distanceKm <= maxDistance;

    return matchesSearch && matchesCategory && matchesStatus && matchesDistance;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="pb-28 max-w-md mx-auto sm:max-w-3xl lg:max-w-5xl px-4 pt-2 space-y-5 animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading font-black text-2xl text-stone-900">
          Explore Homemade Kitchens
        </h1>
        <p className="text-xs text-stone-500">
          Filter authentic regional delicacies by live preparation, distance & category
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Chakali, Chutney, Pickles, Mysore Pak..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-stone-200 text-sm shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 font-medium"
        />
      </div>

      {/* Quick Filters */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-2xs space-y-3">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
            Status:
          </span>
          <button
            onClick={() => setPrepStatusFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              prepStatusFilter === 'All'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setPrepStatusFilter('Preparing Now')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
              prepStatusFilter === 'Preparing Now'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-live-dot"></span>
            Preparing Now
          </button>
          <button
            onClick={() => setPrepStatusFilter('Fresh Today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
              prepStatusFilter === 'Fresh Today'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Fresh Today
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
            Type:
          </span>
          {['All', 'Snacks', 'Pickles', 'Chutneys', 'Sweets', 'Breakfast', 'Festival Specials'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-2xs font-bold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting & Max Distance */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">Within distance:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => setMaxDistance(d)}
                  className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                    maxDistance === d
                      ? 'bg-orange-100 text-orange-800 border border-orange-300'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {d} km
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-bold text-stone-800 focus:outline-hidden"
            >
              <option value="rating">Top Rated ★</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>Found {sorted.length} homemade dishes</span>
        <span>Hyperlocal: 100% Home Cooked</span>
      </div>

      {/* Products Grid */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 text-stone-500 space-y-2">
          <p className="font-bold text-base text-stone-800">No dishes match your filters</p>
          <p className="text-xs">Try expanding your distance or clearing selected categories.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setPrepStatusFilter('All');
              setMaxDistance(5);
            }}
            className="mt-2 px-4 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
              onViewSeller={onSelectSeller}
              isInCart={cartProductIds.includes(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
