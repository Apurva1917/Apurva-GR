import React, { useState } from 'react';
import { Search, Sparkles, Flame, Clock, Heart, ShieldCheck, ChevronRight, Store, ArrowUpRight } from 'lucide-react';
import { Product, CategoryType, Seller } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  sellers: Seller[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onSelectSeller: (sellerId: string) => void;
  cartProductIds: string[];
}

const CATEGORIES: Array<{ id: CategoryType | 'All'; label: string; icon: string }> = [
  { id: 'All', label: 'All Items', icon: '✨' },
  { id: 'Snacks', label: 'Snacks', icon: '🥨' },
  { id: 'Pickles', label: 'Pickles', icon: '🫙' },
  { id: 'Chutneys', label: 'Chutneys', icon: '🥣' },
  { id: 'Sweets', label: 'Sweets', icon: '🍯' },
  { id: 'Breakfast', label: 'Breakfast', icon: '🥞' },
  { id: 'Festival Specials', label: 'Festival Specials', icon: '🪔' },
];

export const HomePage: React.FC<HomePageProps> = ({
  products,
  sellers,
  onSelectProduct,
  onAddToCart,
  onSelectSeller,
  cartProductIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ingredients.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const preparingNowProducts = filteredProducts.filter(
    (p) => p.preparationStatus === 'Preparing Now' || p.preparationStatus === 'Cooking'
  );

  const freshTodayProducts = filteredProducts.filter(
    (p) => p.preparationStatus === 'Prepared Today' || p.preparationStatus === 'Fresh Batch'
  );

  return (
    <div className="pb-24 pt-2 max-w-md mx-auto sm:max-w-3xl lg:max-w-5xl px-4 space-y-6">
      {/* Hero Transparency Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-orange-600 via-amber-600 to-amber-700 text-white p-5 sm:p-6 shadow-md">
        <div className="relative z-10 max-w-lg space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Hyperlocal Homemade Food Transparency</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl leading-tight">
            See it cooked today. <br />
            <span className="text-amber-200">Delivered warm from home.</span>
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-md">
            Watch live photo timelines of raw ingredients, dough rolling, and traditional frying from verified neighborhood home cooks.
          </p>
        </div>

        {/* Decorative background circles */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
        <div className="absolute right-8 top-4 text-7xl opacity-20 select-none">
          🍲
        </div>
      </div>

      {/* SEARCH BAR matching user prompt requirement */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Chakali, Chutney, Pickles..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-stone-200/90 text-sm font-medium placeholder:text-stone-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-xs font-semibold text-stone-400 hover:text-stone-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY CHIPS matching user prompt requirement */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-heading font-bold text-sm text-stone-900 uppercase tracking-wider text-xs">
            Categories
          </h2>
          <span className="text-xs text-stone-500">
            {selectedCategory === 'All' ? 'Showing all' : selectedCategory}
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all select-none shrink-0 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-sm scale-[1.02]'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: "Preparing Now" matching prompt requirement */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
              <Flame className="w-4 h-4 fill-emerald-600 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-lg text-stone-900">
                  Preparing Now
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-live-dot"></span>
                  Live Kitchens
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Dishes currently bubbling, rolling, and frying in local kitchens
              </p>
            </div>
          </div>
        </div>

        {preparingNowProducts.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center text-sm text-stone-500">
            No dishes currently in live prep matching your filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {preparingNowProducts.map((product) => (
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
      </section>

      {/* SECTION 2: "Fresh Today" matching prompt requirement */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-stone-900">
                Fresh Today
              </h2>
              <p className="text-xs text-stone-500">
                Batched this morning, packed airtight and ready for immediate delivery
              </p>
            </div>
          </div>
        </div>

        {freshTodayProducts.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-center text-sm text-stone-500">
            No fresh batches found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {freshTodayProducts.map((product) => (
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
      </section>

      {/* TOP SELLERS CAROUSEL */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-stone-900">
              Featured Neighborhood Kitchens
            </h2>
            <p className="text-xs text-stone-500">
              Handpicked homemakers cooking with heirloom family recipes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              onClick={() => onSelectSeller(seller.id)}
              className="p-3.5 bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-orange-300 hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5"
            >
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-orange-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-sm text-stone-900 truncate">
                    {seller.name}
                  </h3>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    ★ {seller.rating}
                  </span>
                </div>
                <p className="text-xs text-stone-500 truncate">
                  Cook: <span className="font-medium text-stone-700">{seller.cookName}</span>
                </p>
                <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-1">
                  <span>{seller.location.split(',')[0]}</span>
                  <span>•</span>
                  <span className="text-orange-600 font-semibold">{seller.distanceKm} km</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400" />
            </div>
          ))}
        </div>
      </section>

      {/* GharSe Trust & Hygiene Guarantee */}
      <div className="rounded-3xl bg-stone-900 text-white p-5 sm:p-6 space-y-3 shadow-lg">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-heading font-extrabold text-base">
            The GharSe Transparency Promise
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-300">
          <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60">
            <span className="font-bold text-white block mb-1">📸 Live Prep Proof</span>
            Every seller uploads real-time step photos so you see ingredients and hygiene before ordering.
          </div>
          <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60">
            <span className="font-bold text-white block mb-1">🌿 0% Chemical Preservatives</span>
            Strictly real home cooking without industrial stabilizers, artificial food colorings, or reused oils.
          </div>
          <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/60">
            <span className="font-bold text-white block mb-1">🏡 Hyperlocal Neighborhood</span>
            Prepared within 3 km of your home for guaranteed fresh delivery while crispy and warm.
          </div>
        </div>
      </div>
    </div>
  );
};
