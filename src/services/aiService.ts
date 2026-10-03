import { AIListingAuditResult } from '../types';

export interface GenerateDescriptionParams {
  productName: string;
  ingredients: string;
  category?: string;
  weight?: string;
}

export interface GenerateDescriptionResponse {
  description: string;
  keyHighlights: string[];
}

export const generateProductDescription = async (
  params: GenerateDescriptionParams
): Promise<GenerateDescriptionResponse> => {
  try {
    const res = await fetch('/api/ai/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate description');
    }

    const data = await res.json();
    return {
      description: data.description || 'Authentic homestyle preparation with natural ingredients and traditional taste.',
      keyHighlights: data.keyHighlights || ['100% Homemade', 'Fresh Ingredients', 'Traditional Recipe'],
    };
  } catch (error) {
    console.warn('AI generation fallback active:', error);
    // Intelligent local fallback if server connection is disrupted
    return {
      description: `Lovingly handcrafted in small batches using ${params.ingredients || 'fresh natural ingredients'}. Follows a cherished family recipe with zero artificial additives, bringing genuine home warmth straight to your table.`,
      keyHighlights: ['Handcrafted with Care', 'Fresh Batch', 'Zero Preservatives'],
    };
  }
};

export const auditProductListing = async (listingData: {
  name: string;
  category: string;
  description: string;
  ingredients: string;
  allergens: string;
  price: string | number;
  quantity: string | number;
  weight: string;
  prepDate: string;
}): Promise<AIListingAuditResult> => {
  try {
    const res = await fetch('/api/ai/audit-listing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listingData),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to check listing');
    }

    return await res.json();
  } catch (error) {
    console.warn('Listing check fallback active:', error);
    const missing: string[] = [];
    if (!listingData.name) missing.push('Product name');
    if (!listingData.ingredients) missing.push('ingredients');
    if (!listingData.price) missing.push('price');
    if (!listingData.quantity) missing.push('quantity');
    if (!listingData.allergens) missing.push('allergen information');
    if (!listingData.prepDate) missing.push('preparation date');
    if (!listingData.description) missing.push('product description');

    return {
      score: Math.max(20, 100 - missing.length * 15),
      isReadyToPublish: missing.length === 0,
      missingFields: missing,
      feedback: missing.length === 0
        ? 'Great job! Your homemade listing includes full preparation transparency for nearby customers.'
        : `Please provide ${missing.join(', ')} to give your customers complete peace of mind.`,
      checklist: [
        { field: 'Product Name', status: listingData.name ? 'complete' : 'missing', note: listingData.name ? 'Dish name set' : 'Missing dish name' },
        { field: 'Ingredients', status: listingData.ingredients ? 'complete' : 'missing', note: listingData.ingredients ? 'All raw items listed' : 'Missing ingredients' },
        { field: 'Price', status: listingData.price ? 'complete' : 'missing', note: listingData.price ? `₹${listingData.price}` : 'Missing price' },
        { field: 'Quantity Available', status: listingData.quantity ? 'complete' : 'missing', note: listingData.quantity ? `${listingData.quantity} packs` : 'Missing quantity' },
        { field: 'Allergen Information', status: listingData.allergens ? 'complete' : 'missing', note: listingData.allergens ? listingData.allergens : 'Missing allergen notice' },
        { field: 'Preparation Date', status: listingData.prepDate ? 'complete' : 'missing', note: listingData.prepDate ? listingData.prepDate : 'Missing prep timestamp' },
        { field: 'Product Description', status: listingData.description ? 'complete' : 'missing', note: listingData.description ? 'Taste profile added' : 'Missing description' },
      ],
    };
  }
};
