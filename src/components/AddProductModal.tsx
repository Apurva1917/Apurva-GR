import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, RefreshCw, ChefHat, Image as ImageIcon } from 'lucide-react';
import { CategoryType, Product, AIListingAuditResult } from '../types';
import { generateProductDescription, auditProductListing } from '../services/aiService';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerLocation: string;
}

const SAMPLE_FOOD_IMAGES = [
  { label: 'Chakali / Murukku', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fresh Chutney', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Spicy Mango Pickle', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Puran Poli / Flatbread', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80' },
  { label: 'Besan Ladoo / Sweets', url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Steamed Idli / Batter', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  sellerId,
  sellerName,
  sellerAvatar,
  sellerLocation,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('Snacks');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [allergens, setAllergens] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState('250g');
  const [prepDate, setPrepDate] = useState('Today, Oct 3, 2026');
  const [image, setImage] = useState(SAMPLE_FOOD_IMAGES[0].url);

  // AI Generation States
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [aiHighlights, setAiHighlights] = useState<string[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AIListingAuditResult | null>(null);

  if (!isOpen) return null;

  const handleGenerateDescription = async () => {
    if (!name.trim() || !ingredients.trim()) {
      alert('Please enter both Product Name and Ingredients before generating a description with Gemini.');
      return;
    }

    setIsGeneratingDesc(true);
    try {
      const res = await generateProductDescription({
        productName: name,
        ingredients,
        category,
        weight,
      });

      setDescription(res.description);
      if (res.keyHighlights && res.keyHighlights.length > 0) {
        setAiHighlights(res.keyHighlights);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleAuditListing = async () => {
    setIsAuditing(true);
    try {
      const res = await auditProductListing({
        name,
        category,
        description,
        ingredients,
        allergens,
        price,
        quantity,
        weight,
        prepDate,
      });
      setAuditResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !quantity || !ingredients) {
      alert('Please fill in product name, ingredients, price, and quantity.');
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name,
      sellerId,
      sellerName,
      sellerAvatar,
      sellerLocation,
      sellerRating: 4.9,
      sellerReviewsCount: 1,
      price: Number(price),
      weight: weight || '1 pack',
      rating: 5.0,
      reviewsCount: 0,
      quantityRemaining: Number(quantity),
      category,
      preparationStatus: 'Preparing Now',
      preparationDate: prepDate || 'Today, Oct 3, 2026',
      image,
      description: description || 'Freshly made with traditional ingredients in our home kitchen.',
      ingredients,
      allergens: allergens || 'Prepared in a clean, hygienic home kitchen. No common allergens.',
      isVeg: true,
      distanceKm: 1.2,
      tags: aiHighlights.length > 0 ? aiHighlights : ['100% Homemade', 'Fresh Today'],
      timeline: [
        {
          id: `step-${Date.now()}-1`,
          time: '9:00 AM',
          status: 'Ingredients prepared',
          description: `Raw materials (${ingredients}) cleaned and prepped according to family recipe.`,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
          completed: true,
        },
        {
          id: `step-${Date.now()}-2`,
          time: '10:30 AM',
          status: 'Cooking in progress',
          description: 'Slow-cooked in small batch for authentic home aroma and perfection.',
          image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
          completed: true,
        },
      ],
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-stone-900">
                Add New Homemade Dish
              </h2>
              <p className="text-xs text-stone-500">
                Share your authentic culinary creations with transparency
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Row 1: Name and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Traditional Chakali, Tomato Chutney"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              >
                <option value="Snacks">Snacks</option>
                <option value="Pickles">Pickles</option>
                <option value="Chutneys">Chutneys</option>
                <option value="Sweets">Sweets</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Festival Specials">Festival Specials</option>
              </select>
            </div>
          </div>

          {/* Row 2: Ingredients */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Ingredients * (raw materials used)
            </label>
            <textarea
              rows={2}
              required
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. Rice flour, roasted gram flour, cold-pressed groundnut oil, sesame seeds, ajwain, sea salt"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />
            <p className="text-[11px] text-stone-500 mt-0.5">
              Tip: Listing authentic ingredients enables Gemini to generate a tailored description!
            </p>
          </div>

          {/* Row 3: Description with Gemini AI Helper */}
          <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-800">
                Product Description
              </label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGeneratingDesc || !name || !ingredients}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-40 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                {isGeneratingDesc ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Gemini is writing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-200" />
                    <span>Generate with Gemini</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A natural, appetizing description of how this dish is made at home..."
              className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />

            {aiHighlights.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {aiHighlights.map((tag, i) => (
                  <span key={i} className="text-[10px] font-semibold bg-white border border-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                    ✨ {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Row 4: Allergens */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Allergen Information
            </label>
            <input
              type="text"
              value={allergens}
              onChange={(e) => setAllergens(e.target.value)}
              placeholder="e.g. Contains Sesame seeds. Prepared in a peanut-friendly home kitchen."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {['Gluten-free', 'Contains Sesame', 'Contains Peanuts', 'Contains Dairy (Ghee)', 'No Common Allergens'].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setAllergens((prev) => prev ? `${prev}, ${preset}` : preset)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Row 5: Price, Quantity, Weight, Preparation Date */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="10"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 120"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 12"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Weight / Unit *
              </label>
              <input
                type="text"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="250g / 500g"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Preparation Date *
              </label>
              <input
                type="text"
                required
                value={prepDate}
                onChange={(e) => setPrepDate(e.target.value)}
                placeholder="Today, Oct 3, 2026"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Row 6: Food Image Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Select Product Image
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SAMPLE_FOOD_IMAGES.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => setImage(sample.url)}
                  className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-all ${
                    image === sample.url ? 'border-orange-600 scale-95 ring-2 ring-orange-500/30' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1">
                    {sample.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Listing Check Feature */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  AI Listing Check
                </h4>
                <p className="text-[11px] text-stone-500">
                  Verify missing fields (ingredients, price, quantity, allergen info, prep date, description)
                </p>
              </div>
              <button
                type="button"
                onClick={handleAuditListing}
                disabled={isAuditing}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Run Listing Check</span>
                  </>
                )}
              </button>
            </div>

            {/* Audit Results */}
            {auditResult && (
              <div className="pt-3 border-t border-stone-200 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">
                    Transparency Score:
                  </span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    auditResult.score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {auditResult.score} / 100
                  </span>
                </div>

                <p className="text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200/80">
                  {auditResult.feedback}
                </p>

                {auditResult.missingFields && auditResult.missingFields.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <strong className="font-bold">Missing Mandatory Fields: </strong>
                      <span>{auditResult.missingFields.join(', ')}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {auditResult.checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] bg-white p-1.5 rounded-lg border border-stone-100">
                      {item.status === 'complete' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                      )}
                      <span className="font-semibold text-stone-800 truncate">{item.field}:</span>
                      <span className="text-stone-500 truncate">{item.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Submit */}
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
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              Publish Dish to GharSe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
