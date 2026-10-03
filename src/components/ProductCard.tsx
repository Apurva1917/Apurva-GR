import React from 'react';
import { Star, Clock, Plus, Check, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onViewSeller?: (sellerId: string, e?: React.MouseEvent) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onViewSeller,
  isInCart = false,
}) => {
  const isPreparingNow = product.preparationStatus === 'Preparing Now' || product.preparationStatus === 'Cooking';
  const isFreshToday = product.preparationStatus === 'Prepared Today';

  const getStatusBadge = () => {
    if (isPreparingNow) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[11px] font-semibold backdrop-blur-xs shadow-xs">
          <span className="w-2 h-2 rounded-full bg-white animate-live-dot"></span>
          <span>Preparing Now</span>
        </div>
      );
    }
    if (isFreshToday) {
      return (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-600/90 text-white text-[11px] font-semibold backdrop-blur-xs shadow-xs">
          <Clock className="w-3 h-3" />
          <span>Prepared Today</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-800/85 text-white text-[11px] font-semibold backdrop-blur-xs shadow-xs">
        <span>Fresh Batch</span>
      </div>
    );
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer active:scale-[0.99]"
    >
      {/* Food Image with overlays */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {getStatusBadge()}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/90 text-stone-800 shadow-xs backdrop-blur-xs">
            {product.weight}
          </span>
        </div>

        {/* Veg icon & Distance */}
        <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 text-white text-xs font-medium">
          <span className="w-4 h-4 border border-emerald-400 bg-white/95 rounded-xs flex items-center justify-center p-0.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          </span>
          <span className="text-[11px] text-stone-200 drop-shadow-sm font-medium">
            {product.distanceKm} km away
          </span>
        </div>

        {/* Quick view prep peek button */}
        <div className="absolute bottom-2 right-2.5">
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
            <Eye className="w-3 h-3 text-orange-300" />
            <span>Prep timeline</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Product Name & Rating */}
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-heading font-bold text-base text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 shrink-0">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold">{product.rating}</span>
            </div>
          </div>

          {/* Seller / Kitchen Name */}
          <p
            onClick={(e) => {
              if (onViewSeller) {
                e.stopPropagation();
                onViewSeller(product.sellerId, e);
              }
            }}
            className="text-xs text-stone-500 font-medium hover:text-orange-600 transition-colors mt-0.5 truncate"
          >
            By <span className="font-semibold text-stone-700 underline decoration-stone-300">{product.sellerName}</span>
          </p>

          {/* Status text matching user prompt requirement */}
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className="font-medium text-stone-600">
              Status: <span className={isPreparingNow ? 'text-emerald-700 font-semibold' : 'text-stone-800 font-medium'}>
                {product.preparationStatus}
              </span>
            </span>
            <span className={`font-semibold ${
              product.quantityRemaining <= 8 ? 'text-rose-600' : 'text-stone-500'
            }`}>
              {product.quantityRemaining} {product.quantityRemaining === 1 ? 'pack' : 'packs'} left
            </span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-lg font-extrabold text-stone-900">
                ₹{product.price}
              </span>
              <span className="text-[11px] text-stone-400 font-normal">
                / {product.weight}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, e);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
              isInCart
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
