import { SubscriptionPlan } from '@/types';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'daily',
    name: 'Daily Fresh',
    frequency: 'daily',
    discount: 15,
    deliveryDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    id: 'weekly',
    name: 'Weekly Basket',
    frequency: 'weekly',
    discount: 10,
    deliveryDays: ['Mon', 'Wed', 'Fri', 'Sat'],
  },
  {
    id: 'biweekly',
    name: 'Fortnightly',
    frequency: 'biweekly',
    discount: 8,
    deliveryDays: ['Mon', 'Sat'],
  },
  {
    id: 'monthly',
    name: 'Monthly Essentials',
    frequency: 'monthly',
    discount: 5,
    deliveryDays: ['Sat'],
  },
];

export const getSubscriptionPlanById = (id: string): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(p => p.id === id);
};

export const getSubscriptionDiscount = (planId: string): number => {
  const plan = getSubscriptionPlanById(planId);
  return plan?.discount || 0;
};

// Products that support subscription
export const subscribableProducts = [
  // Dairy
  'milk-1',
  'curd-1',
  'paneer-1',
  'eggs-1',
  'country-eggs-1',
  
  // Daily vegetables
  'tomato-1',
  'onion-1',
  'potato-1',
  'spinach-1',
  'methi-leaves-1',
  'coriander-leaves-1',
  'curry-leaves-1',
  'ginger-fresh-1',
  'garlic-fresh-1',
  
  // Fruits
  'banana-1',
  'apple-1',
  'lemon-1',
  
  // Staples
  'rice-1',
  'toor-dal-1',
  'moong-dal-1',
  
  // Millets
  'finger-millet-1',
  'pearl-millet-1',
  'sorghum-millet-1',
  'oats-1',
];