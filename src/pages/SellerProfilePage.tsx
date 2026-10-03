import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, ShieldCheck, Heart, Share2, Award, Clock, ChefHat, MessageSquare } from 'lucide-react';
import { Seller, Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface SellerProfilePageProps {
  seller: Seller;
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  cartProductIds: string[];
}

export const SellerProfilePage: React.FC<SellerProfilePageProps> = ({
  seller,
  products,
  onBack,
  onSelectProduct,
  onAddToCart,
  cartProductIds,
}) => {
  const [activeTab, setActiveTab] = useState<'dishes' | 'story' | 'reviews'>('dishes');

  const sellerProducts = products.filter((p) => p.sellerId === seller.id || p.sellerName === seller.name);

  return (
    <div className="pb-28 max-w-md mx-auto sm:max-w-3xl lg:max-w-4xl px-4 pt-2 space-y-5 animate-in fade-in duration-200">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs text-stone-500 font-medium">
          Homemaker Kitchen #{seller.id}
        </span>
      </div>

      {/* Cover and Profile Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-md">
        <div className="h-32 sm:h-44 w-full relative">
          <img
            src={seller.coverImage}
            alt={seller.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
        </div>

        {/* Profile Card Floating Over Banner */}
        <div className="p-5 pt-0 relative z-10 -mt-12 sm:-mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-3.5">
            <img
              src={seller.avatar}
              alt={seller.cookName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-stone-900 shadow-xl shrink-0 bg-stone-800"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-xl sm:text-2xl text-white">
                  {seller.name}
                </h1>
                <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400" title="Verified Home Kitchen">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Cook: <strong className="text-white">{seller.cookName}</strong>
              </p>
              <div className="flex items-center gap-2 text-xs text-stone-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  {seller.location}
                </span>
                <span>•</span>
                <span className="text-orange-400 font-semibold">{seller.distanceKm} km away</span>
              </div>
            </div>
          </div>

          {/* Rating & Stats */}
          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <div className="p-2.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 text-center min-w-[70px]">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{seller.rating}</span>
              </div>
              <span className="text-[10px] text-stone-400">{seller.reviewsCount} reviews</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 text-center min-w-[70px]">
              <div className="text-white font-bold text-sm">
                {seller.ordersFulfilled}+
              </div>
              <span className="text-[10px] text-stone-400">Batches sold</span>
            </div>
          </div>
        </div>

        {/* Specialities Chips matching prompt requirement */}
        <div className="px-5 pb-5 pt-1 border-t border-stone-800/80">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-2">
            Kitchen Specialities:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {seller.specialities.map((spec, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-orange-950/60 border border-orange-800/40 text-orange-300 text-xs font-semibold"
              >
                ✨ {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('dishes')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'dishes'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Fresh Dishes ({sellerProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('story')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'story'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Kitchen Story & Hygiene
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'reviews'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Reviews ({seller.reviews.length})
        </button>
      </div>

      {/* TAB 1: PRODUCTS */}
      {activeTab === 'dishes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-base text-stone-900">
              Today's Live Menu from {seller.name}
            </h2>
            <span className="text-xs text-stone-500">
              100% Home Cooked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sellerProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
                isInCart={cartProductIds.includes(product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: STORY & HYGIENE */}
      {activeTab === 'story' && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-stone-900 mb-2">
              Our Family Recipe & Heritage
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {seller.bio}
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-3">
            <h4 className="font-heading font-bold text-sm text-stone-900">
              Kitchen Standards & Verifications
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-between">
                <span className="font-bold">FSSAI Home Registration Number:</span>
                <span className="font-mono font-semibold">{seller.fssaiNumber}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 text-stone-700 border border-stone-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{seller.hygieneBadge}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {seller.reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={rev.userAvatar}
                    alt={rev.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">
                      {rev.userName}
                    </h4>
                    <span className="text-[10px] text-stone-400">{rev.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              <span className="inline-block text-[11px] font-semibold text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md">
                Ordered: {rev.dishName}
              </span>

              <p className="text-xs text-stone-600 leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
