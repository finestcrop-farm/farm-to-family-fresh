import { Product } from '@/types';

// Import product images
import tomatoesImg from '@/assets/tomatoes.jpg';
import onionsImg from '@/assets/onions.jpg';
import chickenImg from '@/assets/chicken.jpg';
import avakayaImg from '@/assets/avakaya.jpg';
import milkImg from '@/assets/milk.jpg';
import bananasImg from '@/assets/bananas.jpg';

export const products: Product[] = [
  // Fruits & Vegetables
  {
    id: 'tomato-1',
    name: 'Farm Fresh Tomatoes',
    nameHindi: 'ताज़े टमाटर',
    nameTelugu: 'తాజా టమాటాలు',
    price: 40,
    originalPrice: 50,
    unit: '500g',
    image: tomatoesImg,
    category: 'fruits-vegetables',
    subcategory: 'daily-veggies',
    description: 'Handpicked ripe tomatoes from our partner farms in Karnataka. Perfect for curries and salads.',
    farmSource: 'Krishna Farms, Kolar',
    freshnessBadge: 'farm-fresh',
    fssaiLicense: 'FSSAI12345678901234',
    expiryDays: 7,
    storageTips: 'Store in a cool, dry place. Refrigerate for longer shelf life.',
    inStock: true,
    rating: 4.5,
    reviewCount: 234,
  },
  {
    id: 'onion-1',
    name: 'Red Onions',
    nameHindi: 'लाल प्याज',
    nameTelugu: 'ఎర్ర ఉల్లిపాయలు',
    price: 35,
    unit: '1kg',
    image: onionsImg,
    category: 'fruits-vegetables',
    subcategory: 'daily-veggies',
    description: 'Premium quality red onions sourced from Nashik farms.',
    farmSource: 'Nashik Valley Farms',
    freshnessBadge: 'farm-fresh',
    inStock: true,
    rating: 4.3,
    reviewCount: 156,
  },
  {
    id: 'potato-1',
    name: 'Fresh Potatoes',
    nameHindi: 'आलू',
    nameTelugu: 'బంగాళదుంపలు',
    price: 30,
    unit: '1kg',
    image: '/placeholder.svg',
    category: 'fruits-vegetables',
    subcategory: 'daily-veggies',
    farmSource: 'Agra Farms',
    freshnessBadge: 'farm-fresh',
    inStock: true,
    rating: 4.4,
    reviewCount: 189,
  },
  {
    id: 'spinach-1',
    name: 'Fresh Spinach',
    nameHindi: 'पालक',
    nameTelugu: 'పాలకూర',
    price: 25,
    unit: '250g',
    image: '/placeholder.svg',
    category: 'fruits-vegetables',
    subcategory: 'leafy-greens',
    description: 'Freshly harvested spinach leaves, washed and ready to cook.',
    freshnessBadge: 'handpicked',
    inStock: true,
    rating: 4.6,
    reviewCount: 98,
  },
  {
    id: 'banana-1',
    name: 'Robusta Banana',
    nameHindi: 'केला',
    nameTelugu: 'అరటిపండ్లు',
    price: 45,
    unit: '6 pcs',
    image: bananasImg,
    category: 'fruits-vegetables',
    subcategory: 'fresh-fruits',
    freshnessBadge: 'farm-fresh',
    inStock: true,
    rating: 4.7,
    reviewCount: 312,
  },
  {
    id: 'apple-1',
    name: 'Kashmir Apples',
    nameHindi: 'कश्मीरी सेब',
    nameTelugu: 'కాశ్మీర్ యాపిల్స్',
    price: 180,
    originalPrice: 220,
    unit: '1kg',
    image: '/placeholder.svg',
    category: 'fruits-vegetables',
    subcategory: 'fresh-fruits',
    farmSource: 'Kashmir Orchards',
    freshnessBadge: 'handpicked',
    inStock: true,
    rating: 4.8,
    reviewCount: 267,
  },
  // Meat & Fish
  {
    id: 'chicken-1',
    name: 'Country Chicken - Curry Cut',
    nameHindi: 'देसी मुर्गा - करी कट',
    nameTelugu: 'నాటు కోడి - కర్రీ కట్',
    price: 450,
    unit: '500g',
    image: chickenImg,
    category: 'meat-fish',
    subcategory: 'chicken',
    description: 'Free-range country chicken, freshly cut. Perfect for traditional curries.',
    freshnessBadge: 'farm-fresh',
    fssaiLicense: 'FSSAI98765432109876',
    inStock: true,
    rating: 4.9,
    reviewCount: 423,
  },
  {
    id: 'fish-1',
    name: 'Fresh Rohu Fish',
    nameHindi: 'ताज़ी रोहू मछली',
    nameTelugu: 'తాజా రోహు చేప',
    price: 280,
    unit: '500g',
    image: '/placeholder.svg',
    category: 'meat-fish',
    subcategory: 'fish',
    description: 'Fresh river fish, cleaned and cut as per your preference.',
    freshnessBadge: 'farm-fresh',
    inStock: true,
    rating: 4.6,
    reviewCount: 178,
  },
  // Pickles
  {
    id: 'avakaya-1',
    name: 'Andhra Avakaya Pickle',
    nameHindi: 'आंध्र अवकाया अचार',
    nameTelugu: 'ఆంధ్ర ఆవకాయ',
    price: 250,
    unit: '500g',
    image: avakayaImg,
    category: 'pickles-homemade',
    subcategory: 'andhra-pickles',
    description: 'Traditional Andhra-style raw mango pickle made with authentic spices and cold-pressed sesame oil.',
    freshnessBadge: 'handpicked',
    storageTips: 'Store in a cool, dry place. Use dry spoon only.',
    inStock: true,
    rating: 4.9,
    reviewCount: 567,
  },
  {
    id: 'gongura-1',
    name: 'Gongura Pickle',
    nameHindi: 'गोंगुरा अचार',
    nameTelugu: 'గోంగూర పచ్చడి',
    price: 220,
    unit: '400g',
    image: '/placeholder.svg',
    category: 'pickles-homemade',
    subcategory: 'andhra-pickles',
    description: 'Tangy sorrel leaves pickle, a specialty from Andhra Pradesh.',
    freshnessBadge: 'handpicked',
    inStock: true,
    rating: 4.8,
    reviewCount: 345,
  },
  // Dairy
  {
    id: 'milk-1',
    name: 'Farm Fresh Milk',
    nameHindi: 'ताज़ा दूध',
    nameTelugu: 'తాజా పాలు',
    price: 65,
    unit: '1 Litre',
    image: milkImg,
    category: 'dairy-bakery',
    subcategory: 'milk',
    description: 'Pure cow milk delivered fresh every morning from local dairy farms.',
    freshnessBadge: 'farm-fresh',
    inStock: true,
    rating: 4.7,
    reviewCount: 892,
  },
  {
    id: 'paneer-1',
    name: 'Fresh Paneer',
    nameHindi: 'ताज़ा पनीर',
    nameTelugu: 'తాజా పన్నీర్',
    price: 90,
    unit: '200g',
    image: '/placeholder.svg',
    category: 'dairy-bakery',
    subcategory: 'paneer-cheese',
    description: 'Soft and fresh paneer made from pure milk.',
    freshnessBadge: 'farm-fresh',
    inStock: true,
    rating: 4.6,
    reviewCount: 234,
  },
  // Grocery
  {
    id: 'rice-1',
    name: 'Sona Masoori Rice',
    nameHindi: 'सोना मसूरी चावल',
    nameTelugu: 'సోనా మసూరి బియ్యం',
    price: 75,
    unit: '1kg',
    image: '/placeholder.svg',
    category: 'grocery-staples',
    subcategory: 'rice',
    description: 'Premium quality aged Sona Masoori rice from Andhra Pradesh.',
    inStock: true,
    rating: 4.5,
    reviewCount: 456,
  },
  {
    id: 'toor-dal-1',
    name: 'Toor Dal',
    nameHindi: 'तूर दाल',
    nameTelugu: 'కంది పప్పు',
    price: 140,
    unit: '1kg',
    image: '/placeholder.svg',
    category: 'grocery-staples',
    subcategory: 'dal-pulses',
    description: 'Premium quality split pigeon peas.',
    inStock: true,
    rating: 4.4,
    reviewCount: 234,
  },
  // Organic
  {
    id: 'cold-pressed-oil-1',
    name: 'Cold Pressed Groundnut Oil',
    nameHindi: 'कोल्ड प्रेस्ड मूंगफली का तेल',
    nameTelugu: 'కోల్డ్ ప్రెస్డ్ వేరుశెనగ నూనె',
    price: 320,
    originalPrice: 380,
    unit: '1 Litre',
    image: '/placeholder.svg',
    category: 'organic-health',
    subcategory: 'cold-pressed',
    description: 'Traditional wood-pressed groundnut oil, rich in natural nutrients.',
    freshnessBadge: 'organic',
    inStock: true,
    rating: 4.9,
    reviewCount: 678,
  },
];

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(p => p.category === categoryId);
};

export const getProductsBySubcategory = (categoryId: string, subcategoryId: string): Product[] => {
  return products.filter(p => p.category === categoryId && p.subcategory === subcategoryId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.nameHindi?.toLowerCase().includes(lowerQuery) ||
    p.nameTelugu?.toLowerCase().includes(lowerQuery) ||
    p.description?.toLowerCase().includes(lowerQuery)
  );
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.rating && p.rating >= 4.7).slice(0, 8);
};

export const getOfferProducts = (): Product[] => {
  return products.filter(p => p.originalPrice && p.originalPrice > p.price);
};
