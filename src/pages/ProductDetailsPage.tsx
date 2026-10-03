import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, ShieldCheck, Heart, Share2, Plus, Minus, Check, MapPin, ChefHat, AlertTriangle, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { PreparationTimeline } from '../components/PreparationTimeline';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewSeller: (sellerId: string) => void;
  isInCart: boolean;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBack,
  onAddToCart,
  onViewSeller,
  isInCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isPreparingNow = product.preparationStatus === 'Preparing Now' || product.preparationStatus === 'Cooking';

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const ingredientsList = product.ingredients.split(',').map((s) => s.trim());

  return (
    <div className="pb-32 max-w-md mx-auto sm:max-w-3xl lg:max-w-4xl px-4 pt-2 space-y-5 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
            {product.category}
          </span>
        </div>
      </div>

      {/* Large Product Image */}
      <div className="relative aspect-16/10 sm:aspect-2/1 w-full rounded-3xl overflow-hidden bg-stone-100 shadow-md">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Live Prep Status Ribbon */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {isPreparingNow ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-md backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-live-dot"></span>
              Live in Kitchen: Preparing Now
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/90 text-white text-xs font-semibold shadow-md backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5" />
              {product.preparationStatus}
            </span>
          )}
        </div>

        {/* Weight & Veg Tag */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/95 text-stone-900 text-xs font-bold shadow-md backdrop-blur-xs">
            {product.weight}
          </span>
        </div>

        {/* Product Title on Image for Mobile */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-4 border border-emerald-400 bg-white rounded-xs flex items-center justify-center p-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            </span>
            <span className="text-xs font-bold text-emerald-300">100% Pure Vegetarian & Homemade</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white drop-shadow-md">
            {product.name}
          </h1>
        </div>
      </div>

      {/* Main Info Box */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
        {/* Price, Quantity & Rating */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-extrabold text-3xl text-stone-900">
                ₹{product.price}
              </span>
              <span className="text-xs font-medium text-stone-500">
                per {product.weight} pack
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-700 mt-0.5">
              {product.quantityRemaining} packs remaining in today's fresh batch
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 inline-flex">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="font-heading font-bold text-sm">{product.rating}</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              {product.reviewsCount} customer reviews
            </p>
          </div>
        </div>

        {/* Preparation Date & Hyperlocal Location */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Preparation Date</span>
              <strong className="text-stone-900 font-bold">{product.preparationDate}</strong>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Cooked Nearby</span>
              <strong className="text-stone-900 font-bold">{product.distanceKm} km away</strong>
            </div>
          </div>
        </div>

        {/* Food Description */}
        <div>
          <h2 className="font-heading font-bold text-sm text-stone-900 mb-1.5 uppercase tracking-wider text-xs">
            Food Description
          </h2>
          <p className="text-sm text-stone-700 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        {/* Ingredients */}
        <div>
          <h2 className="font-heading font-bold text-sm text-stone-900 mb-2 uppercase tracking-wider text-xs">
            Raw Ingredients
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {ingredientsList.map((ing, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200/70"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Allergen Information */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-bold text-amber-900 block mb-0.5">
              Allergen Information
            </strong>
            <p className="text-amber-800/90 leading-relaxed">
              {product.allergens}
            </p>
          </div>
        </div>

        {/* Seller Info Card */}
        <div 
          onClick={() => onViewSeller(product.sellerId)}
          className="p-4 rounded-2xl bg-stone-50 hover:bg-orange-50/50 border border-stone-200/80 hover:border-orange-200 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <img
              src={product.sellerAvatar}
              alt={product.sellerName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-sm text-stone-900">
                  {product.sellerName}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800">
                  FSSAI Verified
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {product.sellerLocation}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-orange-600 hover:underline">
            View Kitchen →
          </span>
        </div>
      </div>

      {/* TODAY'S PREPARATION TIMELINE SECTION matching prompt requirement */}
      <section>
        <PreparationTimeline
          timeline={product.timeline}
          productName={product.name}
          isPreparingNow={isPreparingNow}
        />
      </section>

      {/* Sticky Bottom Add to Cart Bar */}
      <div className="fixed bottom-14 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl">
        <div className="max-w-md mx-auto sm:max-w-3xl lg:max-w-4xl flex items-center justify-between gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-2xl border border-stone-200/80">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 flex items-center justify-center text-stone-800 transition-colors shadow-2xs font-bold"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-extrabold text-stone-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.quantityRemaining, q + 1))}
              disabled={quantity >= product.quantityRemaining}
              className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 disabled:opacity-40 flex items-center justify-center text-stone-800 transition-colors shadow-2xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-5 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Basket!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add to Cart • ₹{product.price * quantity}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
