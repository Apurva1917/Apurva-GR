import React from 'react';
import { ShoppingBag, MapPin, ChefHat, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLocation: string;
  onSelectLocation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  activeTab,
  setActiveTab,
  currentLocation,
  onSelectLocation,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between sm:max-w-3xl lg:max-w-5xl">
        {/* Brand & Tagline */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-brand text-lg font-bold">घ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xl tracking-tight text-stone-900">
                Ghar<span className="text-orange-600">Se</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                100% Home Cooked
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              Fresh food directly from neighborhood homemakers
            </p>
          </div>
        </div>

        {/* Hyperlocal location tag */}
        <button
          onClick={onSelectLocation}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-medium text-amber-900 hover:bg-amber-100 transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-orange-600" />
          <span className="truncate max-w-[160px]">{currentLocation}</span>
          <span className="text-orange-700 font-semibold">• 3 km</span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Quick toggle to Sell/Kitchen view */}
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'sell'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-orange-50 text-stone-700 hover:text-orange-700'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kitchen Hub</span>
            <span className="sm:hidden">Sell</span>
          </button>

          {/* Cart button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-full bg-stone-100 hover:bg-orange-50 text-stone-800 hover:text-orange-600 transition-colors"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center animate-bounce shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Location bar */}
      <div className="md:hidden px-4 pb-2 pt-0.5 max-w-md mx-auto flex items-center justify-between text-xs text-stone-600 border-t border-amber-50">
        <button
          onClick={onSelectLocation}
          className="flex items-center gap-1 font-medium text-stone-800 truncate"
        >
          <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span className="truncate text-stone-700">{currentLocation}</span>
          <span className="text-orange-600 font-semibold shrink-0">• within 3 km</span>
        </button>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Live Prep</span>
        </div>
      </div>
    </header>
  );
};
