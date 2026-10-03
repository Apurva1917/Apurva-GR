import React from 'react';
import { User, MapPin, Phone, ShieldCheck, Heart, ChefHat, HelpCircle, FileText, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import { Seller } from '../types';

interface ProfilePageProps {
  onSwitchToSeller: () => void;
  seller: Seller;
  ordersCount: number;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onSwitchToSeller,
  seller,
  ordersCount,
}) => {
  return (
    <div className="pb-28 max-w-md mx-auto sm:max-w-2xl px-4 pt-2 space-y-5 animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading font-black text-2xl text-stone-900">
          My Account
        </h1>
        <p className="text-xs text-stone-500">
          Customer preferences and neighborhood home kitchen settings
        </p>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 font-extrabold text-xl flex items-center justify-center ring-2 ring-orange-200">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-base text-stone-900">
                Aarav Sharma
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Verified Neighbor
              </span>
            </div>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-stone-400" />
              +91 98450 12345
            </p>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-orange-600" />
              Indiranagar, Bengaluru (1.2 km from Lakshmi's Kitchen)
            </p>
          </div>
        </div>
      </div>

      {/* Switch to Cook Mode Promo Banner */}
      <div className="rounded-3xl bg-linear-to-r from-amber-600 to-orange-600 text-white p-5 shadow-md flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <ChefHat className="w-4 h-4" />
            <span>Are you a Home Cook?</span>
          </div>
          <h3 className="font-heading font-extrabold text-lg text-white">
            Sell with Live Transparency
          </h3>
          <p className="text-xs text-amber-100/90 max-w-xs">
            Manage your kitchen dashboard, post real-time cooking photos, and use Gemini to write irresistible product listings.
          </p>
        </div>

        <button
          onClick={onSwitchToSeller}
          className="px-4 py-2.5 rounded-2xl bg-white text-orange-700 font-bold text-xs shadow-md shrink-0 hover:bg-stone-50 active:scale-95 transition-all"
        >
          Open Kitchen Hub →
        </button>
      </div>

      {/* Trust & Guarantee Info */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-sm text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          The GharSe Standards
        </h3>

        <div className="space-y-2.5 text-xs text-stone-600">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 font-bold block">100% Home Kitchens Only:</strong>
              No commercial dark kitchens or cloud factories. Everything is cooked by real homemakers in their own residences.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 font-bold block">Live Step-by-Step Proof:</strong>
              Cooks upload verified photos of raw spices, kneaded dough, and traditional brass kadhai frying before every batch.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 font-bold block">FSSAI Registration & Hygiene:</strong>
              Every home kitchen is onboarded with valid FSSAI home food registration and hygiene compliance.
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings Links */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden divide-y divide-stone-100 text-xs font-semibold text-stone-700">
        <div className="p-4 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-stone-400" />
            <span>Saved Addresses (Home, Office)</span>
          </div>
          <span className="text-stone-400">Indiranagar →</span>
        </div>

        <div 
          onClick={onSwitchToSeller}
          className="p-4 flex items-center justify-between hover:bg-orange-50 cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-orange-700 font-bold">
            <ChefHat className="w-4 h-4" />
            <span>Manage Kitchen: {seller.name}</span>
          </div>
          <span className="text-orange-600 font-bold">Switch →</span>
        </div>

        <div className="p-4 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-stone-400" />
            <span>Frequently Asked Questions & Support</span>
          </div>
          <span className="text-stone-400">Help →</span>
        </div>
      </div>

      <div className="text-center text-[11px] text-stone-400 pt-2">
        <p>GharSe v1.0 • Hyperlocal Homemade Food Marketplace</p>
        <p className="mt-0.5">Empowering Indian Homemakers with Transparency & Fresh Food Love</p>
      </div>
    </div>
  );
};
