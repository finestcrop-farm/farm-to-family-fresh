export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'flat';
  minOrder: number;
  maxDiscount?: number;
  validTill: string;
  category?: string;
  isActive: boolean;
  badge?: string;
  color: string;
  icon: string;
}

export interface OfferBanner {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  backgroundColor: string;
  textColor: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
}

export const offers: Offer[] = [
  {
    id: 'fresh50',
    title: 'Fresh Start',
    description: 'Flat ₹50 off on your first order',
    code: 'FRESH50',
    discount: 50,
    discountType: 'flat',
    minOrder: 199,
    validTill: '2025-12-31',
    isActive: true,
    badge: 'New User',
    color: 'from-primary to-primary/80',
    icon: '🎉',
  },
  {
    id: 'veggies20',
    title: 'Veggie Bonanza',
    description: '20% off on all vegetables',
    code: 'VEGGIES20',
    discount: 20,
    discountType: 'percentage',
    minOrder: 299,
    maxDiscount: 100,
    validTill: '2025-12-31',
    category: 'fruits-vegetables',
    isActive: true,
    badge: 'Hot',
    color: 'from-fresh to-fresh/80',
    icon: '🥬',
  },
  {
    id: 'meat25',
    title: 'Meat Lovers',
    description: '25% off on fresh meat & fish',
    code: 'MEAT25',
    discount: 25,
    discountType: 'percentage',
    minOrder: 499,
    maxDiscount: 150,
    validTill: '2025-12-31',
    category: 'meat-fish',
    isActive: true,
    badge: 'Premium',
    color: 'from-red-500 to-red-600',
    icon: '🍗',
  },
  {
    id: 'dairy15',
    title: 'Dairy Delight',
    description: '15% off on dairy products',
    code: 'DAIRY15',
    discount: 15,
    discountType: 'percentage',
    minOrder: 199,
    maxDiscount: 75,
    validTill: '2025-12-31',
    category: 'dairy-bakery',
    isActive: true,
    color: 'from-blue-500 to-blue-600',
    icon: '🥛',
  },
  {
    id: 'organic30',
    title: 'Go Organic',
    description: '30% off on organic products',
    code: 'ORGANIC30',
    discount: 30,
    discountType: 'percentage',
    minOrder: 599,
    maxDiscount: 200,
    validTill: '2025-12-31',
    category: 'organic-health',
    isActive: true,
    badge: 'Eco',
    color: 'from-green-500 to-green-600',
    icon: '🌿',
  },
  {
    id: 'freedelivery',
    title: 'Free Delivery',
    description: 'Free delivery on orders above ₹499',
    code: 'FREEDEL',
    discount: 40,
    discountType: 'flat',
    minOrder: 499,
    validTill: '2025-12-31',
    isActive: true,
    color: 'from-amber-500 to-amber-600',
    icon: '🚚',
  },
  {
    id: 'pickle10',
    title: 'Pickle Special',
    description: '10% off on all pickles',
    code: 'PICKLE10',
    discount: 10,
    discountType: 'percentage',
    minOrder: 299,
    maxDiscount: 50,
    validTill: '2025-12-31',
    category: 'pickles-homemade',
    isActive: true,
    color: 'from-orange-500 to-orange-600',
    icon: '🫙',
  },
  {
    id: 'weekend50',
    title: 'Weekend Special',
    description: 'Flat ₹100 off on weekends',
    code: 'WEEKEND100',
    discount: 100,
    discountType: 'flat',
    minOrder: 699,
    validTill: '2025-12-31',
    isActive: true,
    badge: 'Limited',
    color: 'from-purple-500 to-purple-600',
    icon: '🎊',
  },
];

export const offerBanners: OfferBanner[] = [
  {
    id: 'banner1',
    title: 'Fresh Vegetables',
    subtitle: 'Get 20% off on farm-fresh vegetables',
    backgroundColor: 'bg-gradient-to-r from-fresh to-fresh/80',
    textColor: 'text-white',
    ctaText: 'Shop Now',
    ctaLink: '/category/fruits-vegetables',
    badge: '🔥 Hot Deal',
  },
  {
    id: 'banner2',
    title: 'Andhra Pickles',
    subtitle: 'Authentic homemade pickles',
    backgroundColor: 'bg-gradient-to-r from-orange-500 to-amber-500',
    textColor: 'text-white',
    ctaText: 'Explore',
    ctaLink: '/category/pickles-homemade',
    badge: 'Best Seller',
  },
  {
    id: 'banner3',
    title: 'Organic & Health',
    subtitle: 'Pure, natural & chemical-free',
    backgroundColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
    textColor: 'text-white',
    ctaText: 'Shop Organic',
    ctaLink: '/category/organic-health',
    badge: '100% Organic',
  },
  {
    id: 'banner4',
    title: 'Fresh Meat & Fish',
    subtitle: 'Farm to fork freshness',
    backgroundColor: 'bg-gradient-to-r from-red-500 to-rose-500',
    textColor: 'text-white',
    ctaText: 'Order Now',
    ctaLink: '/category/meat-fish',
    badge: 'Premium Quality',
  },
];

export const getActiveOffers = (): Offer[] => {
  return offers.filter(o => o.isActive);
};

export const getOfferByCode = (code: string): Offer | undefined => {
  return offers.find(o => o.code.toLowerCase() === code.toLowerCase() && o.isActive);
};

export const calculateDiscount = (offer: Offer, cartTotal: number): number => {
  if (cartTotal < offer.minOrder) return 0;
  
  if (offer.discountType === 'flat') {
    return offer.discount;
  } else {
    const discount = (cartTotal * offer.discount) / 100;
    return offer.maxDiscount ? Math.min(discount, offer.maxDiscount) : discount;
  }
};
