import React, { useState } from 'react';
import { X, Clock, Camera, CheckCircle2, Upload } from 'lucide-react';
import { Product, PrepStatus, TimelineItem } from '../types';

interface UpdatePrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddTimelineStep: (productId: string, newStep: TimelineItem, newStatus: PrepStatus) => void;
}

const PRESET_STATUSES: PrepStatus[] = [
  'Preparing ingredients',
  'Cooking',
  'Cooling',
  'Packing',
  'Ready',
];

const SAMPLE_PREP_PHOTOS = [
  { label: 'Fresh Spices & Ingredients', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Kneading Dough in Thali', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  { label: 'Kadhai Frying / Tawa Roasting', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cooling on Stainless Rack', url: 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=600&q=80' },
  { label: 'Packing into Kraft Zipper Pouch', url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sterilized Jars & Bottles', url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80' },
];

export const UpdatePrepModal: React.FC<UpdatePrepModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddTimelineStep,
}) => {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [status, setStatus] = useState<PrepStatus>('Cooking');
  const [description, setDescription] = useState('Pressed through brass star-mold into cold-pressed groundnut oil, frying slowly till crisp.');
  const [time, setTime] = useState('11:15 AM');
  const [photo, setPhoto] = useState(SAMPLE_PREP_PHOTOS[2].url);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !description.trim() || !time.trim()) {
      alert('Please fill in dish, description, and time.');
      return;
    }

    const newStep: TimelineItem = {
      id: `step-${Date.now()}`,
      time,
      status,
      description,
      image: photo,
      completed: status === 'Ready' || status === 'Packing',
    };

    onAddTimelineStep(selectedProductId, newStep, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-stone-900">
                Upload Preparation Update
              </h2>
              <p className="text-xs text-stone-500">
                Give your customers live peace of mind with real step photos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Select Dish */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Select Dish to Update *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 font-semibold text-stone-900"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.weight}) — Current: {p.preparationStatus}
                </option>
              ))}
            </select>
          </div>

          {/* Status Selection: Preparing ingredients, Cooking, Cooling, Packing, Ready */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
              Preparation Status *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_STATUSES.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    status === s
                      ? 'border-orange-600 bg-orange-50 text-orange-900 ring-2 ring-orange-500/20 shadow-xs'
                      : 'border-stone-200 bg-stone-50/60 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Timestamp */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Timestamp *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 11:15 AM"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Step Photo Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Preparation Photo *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_PREP_PHOTOS.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => setPhoto(sample.url)}
                  className={`relative rounded-xl overflow-hidden aspect-4/3 cursor-pointer border-2 transition-all ${
                    photo === sample.url ? 'border-emerald-600 scale-95 ring-2 ring-emerald-500/30' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/65 text-[9px] text-white text-center py-0.5 truncate px-1 font-medium">
                    {sample.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Step Description (what was done in this step) *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Spiral extrusion into pure groundnut oil at 175°C, gently rotated until golden crisp."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Step to Live Timeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
