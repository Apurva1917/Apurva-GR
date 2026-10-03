import React from 'react';
import { X, Clock, CheckCircle2 } from 'lucide-react';
import { TimelineItem } from '../types';

interface ImageModalProps {
  item: TimelineItem | null;
  productName?: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ item, productName, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-stone-800 bg-stone-900/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified Prep Step
              </span>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.time}
              </span>
            </div>
            <h3 className="font-heading font-bold text-base text-white mt-1">
              {item.status}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Large Photo */}
        <div className="relative aspect-4/3 w-full bg-stone-950">
          <img
            src={item.image}
            alt={item.status}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description */}
        <div className="p-4 bg-stone-900">
          <p className="text-sm text-stone-300 leading-relaxed">
            {item.description}
          </p>
          {productName && (
            <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Dish: <strong className="text-white">{productName}</strong></span>
              <span className="text-emerald-400 font-medium">100% Home Kitchen Transparency</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
