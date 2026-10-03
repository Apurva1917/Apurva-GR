export type CategoryType = 
  | 'Snacks'
  | 'Pickles'
  | 'Chutneys'
  | 'Sweets'
  | 'Breakfast'
  | 'Festival Specials';

export type PrepStatus = 
  | 'Preparing Now'
  | 'Prepared Today'
  | 'Fresh Batch'
  | 'Preparing ingredients'
  | 'Cooking'
  | 'Cooling'
  | 'Packing'
  | 'Ready';

export interface TimelineItem {
  id: string;
  time: string;
  status: string; // e.g., "Ingredients prepared", "Dough prepared", "Frying started", "Cooling", "Packing"
  description: string;
  image: string;
  completed: boolean;
}

export interface Product {
  id: string;
  name: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerLocation: string;
  sellerRating: number;
  sellerReviewsCount: number;
  price: number; // in INR ₹
  weight: string; // e.g. "250g", "200g", "500g"
  rating: number;
  reviewsCount: number;
  quantityRemaining: number;
  category: CategoryType;
  preparationStatus: PrepStatus;
  preparationDate: string; // e.g. "Today, Oct 3, 2026"
  image: string;
  description: string;
  ingredients: string;
  allergens: string;
  timeline: TimelineItem[];
  isVeg: boolean;
  distanceKm: number;
  tags?: string[];
}

export interface SellerReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  dishName: string;
  comment: string;
}

export interface Seller {
  id: string;
  name: string;
  cookName: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  location: string;
  distanceKm: number;
  joinedYear: string;
  bio: string;
  specialities: string[];
  fssaiNumber: string;
  hygieneBadge: string;
  ordersFulfilled: number;
  reviews: SellerReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  total: number;
  deliveryType: 'pickup' | 'delivery';
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: 'Cash on Delivery' | 'UPI on Delivery';
  status: 'Order Placed' | 'Preparing' | 'Packing' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered';
  estimatedTime: string;
  sellerName: string;
}

export interface AIListingAuditResult {
  score: number;
  isReadyToPublish: boolean;
  missingFields: string[];
  feedback: string;
  checklist: Array<{
    field: string;
    status: 'complete' | 'missing' | 'needs_improvement';
    note: string;
  }>;
}
