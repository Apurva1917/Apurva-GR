import React, { useState } from 'react';
import { Clock, CheckCircle2, ZoomIn, Sparkles, ChefHat } from 'lucide-react';
import { TimelineItem } from '../types';
import { ImageModal } from './ImageModal';

interface PreparationTimelineProps {
  timeline: TimelineItem[];
  productName: string;
  isPreparingNow?: boolean;
}

export const PreparationTimeline: React.FC<PreparationTimelineProps> = ({
  timeline,
  productName,
  isPreparingNow,
}) => {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-center text-sm text-stone-600">
        <ChefHat className="w-6 h-6 mx-auto text-amber-600 mb-1" />
        <p>The cook hasn't posted today's live steps yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg text-stone-900">
              Today's Preparation
            </h3>
            {isPreparingNow && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-live-dot"></span>
                Live
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time step photos uploaded directly from the home kitchen
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Verified Transparency</span>
        </div>
      </div>

      {/* Timeline items */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-linear-to-b before:from-emerald-500 before:via-amber-400 before:to-stone-200">
        {timeline.map((item, idx) => {
          const isLatest = idx === timeline.length - 1 && isPreparingNow;
          return (
            <div key={item.id || idx} className="relative group">
              {/* Timeline marker icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 bg-white transition-transform group-hover:scale-110 shadow-xs ${
                  item.completed
                    ? 'border-emerald-600 text-emerald-600 bg-emerald-50'
                    : isLatest
                    ? 'border-orange-500 text-orange-600 bg-orange-50 animate-pulse'
                    : 'border-stone-300 text-stone-400'
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>

              {/* Card wrapper */}
              <div className="bg-stone-50/80 hover:bg-stone-50 rounded-2xl p-3 sm:p-4 border border-stone-200/70 transition-all">
                {/* Header: Time & Status Title */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-stone-900">
                      {item.time} — {item.status}
                    </span>
                  </div>
                  {item.completed ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded-full">
                      In Progress
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 mb-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Step Photo */}
                {item.image && (
                  <div
                    onClick={() => setSelectedItem(item)}
                    className="relative w-full aspect-16/9 sm:aspect-21/9 rounded-xl overflow-hidden cursor-pointer bg-stone-200 group/img shadow-xs"
                  >
                    <img
                      src={item.image}
                      alt={item.status}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xs">
                        <ZoomIn className="w-3.5 h-3.5" />
                        Click to Inspect Photo
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                      <span>Kitchen Proof</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Preview Modal */}
      <ImageModal
        item={selectedItem}
        productName={productName}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};
