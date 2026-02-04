export interface QuantityVariant {
  unit: string;
  price: number;
  originalPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  nameHindi?: string;
  nameTelugu?: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  category: string;
  subcategory: string;
  description?: string;
  farmSource?: string;
  freshnessBadge?: 'farm-fresh' | 'organic' | 'handpicked' | 'local';
  fssaiLicense?: string;
  expiryDays?: number;
  storageTips?: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  // Dietary tags
  dietaryTags?: DietaryTag[];
  isSubscribable?: boolean;
  // Quantity variants for flexible sizing
  quantityVariants?: QuantityVariant[];
}

export type DietaryTag = 
  | 'diabetic-friendly'
  | 'high-protein'
  | 'gluten-free'
  | 'low-carb'
  | 'heart-healthy'
  | 'weight-loss'
  | 'vegan'
  | 'organic';

export interface Category {
  id: string;
  name: string;
  nameHindi: string;
  nameTelugu: string;
  icon: string;
  image: string;
  color: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  nameHindi: string;
  nameTelugu: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: QuantityVariant;
  isSubscription?: boolean;
  subscriptionPlan?: SubscriptionPlan;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  discount: number;
  deliveryDays?: string[];
}

export interface DeliverySlot {
  id: string;
  type: 'standard' | 'express' | 'early-morning';
  label: string;
  time: string;
  price: number;
}

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  landmark?: string;
  pincode: string;
  isDefault: boolean;
}

export type Language = 'en' | 'hi' | 'te';

export interface UserPreferences {
  language: Language;
  location?: Address;
  onboardingCompleted: boolean;
}

export interface DietaryFilter {
  id: DietaryTag;
  name: string;
  icon: string;
  description: string;
}
