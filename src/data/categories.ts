import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'fruits-vegetables',
    name: 'Fruits & Vegetables',
    nameHindi: 'फल और सब्जियां',
    nameTelugu: 'పండ్లు & కూరగాయలు',
    icon: '🥬',
    image: '/placeholder.svg',
    color: 'hsl(100 35% 42%)',
    subcategories: [
      { id: 'daily-veggies', name: 'Daily Vegetables', nameHindi: 'रोज़ की सब्जियां', nameTelugu: 'రోజువారీ కూరగాయలు', productCount: 45 },
      { id: 'leafy-greens', name: 'Leafy Greens', nameHindi: 'पत्तेदार सब्जियां', nameTelugu: 'ఆకు కూరలు', productCount: 20 },
      { id: 'exotic-veggies', name: 'Exotic Vegetables', nameHindi: 'विदेशी सब्जियां', nameTelugu: 'ఎక్సోటిక్ కూరగాయలు', productCount: 15 },
      { id: 'fresh-fruits', name: 'Fresh Fruits', nameHindi: 'ताज़े फल', nameTelugu: 'తాజా పండ్లు', productCount: 35 },
      { id: 'exotic-fruits', name: 'Exotic Fruits', nameHindi: 'विदेशी फल', nameTelugu: 'ఎక్సోటిక్ పండ్లు', productCount: 18 },
      { id: 'seasonal', name: 'Seasonal Specials', nameHindi: 'मौसमी विशेष', nameTelugu: 'సీజనల్ స్పెషల్స్', productCount: 12 },
    ],
  },
  {
    id: 'grocery-staples',
    name: 'Grocery & Staples',
    nameHindi: 'किराना और अनाज',
    nameTelugu: 'కిరాణా & స్టేపుల్స్',
    icon: '🌾',
    image: '/placeholder.svg',
    color: 'hsl(40 60% 50%)',
    subcategories: [
      { id: 'rice', name: 'Rice & Rice Products', nameHindi: 'चावल', nameTelugu: 'బియ్యం', productCount: 25 },
      { id: 'dal-pulses', name: 'Dals & Pulses', nameHindi: 'दाल और दलहन', nameTelugu: 'పప్పులు', productCount: 30 },
      { id: 'atta-flour', name: 'Atta & Flours', nameHindi: 'आटा', nameTelugu: 'పిండి', productCount: 20 },
      { id: 'millets', name: 'Millets', nameHindi: 'बाजरा', nameTelugu: 'చిరుధాన్యాలు', productCount: 15 },
      { id: 'oils', name: 'Cooking Oils', nameHindi: 'खाना पकाने का तेल', nameTelugu: 'వంట నూనెలు', productCount: 18 },
      { id: 'spices', name: 'Spices & Masalas', nameHindi: 'मसाले', nameTelugu: 'మసాలాలు', productCount: 40 },
    ],
  },
  {
    id: 'dairy-bakery',
    name: 'Dairy & Bakery',
    nameHindi: 'डेयरी और बेकरी',
    nameTelugu: 'డైరీ & బేకరీ',
    icon: '🥛',
    image: '/placeholder.svg',
    color: 'hsl(200 50% 55%)',
    subcategories: [
      { id: 'milk', name: 'Milk', nameHindi: 'दूध', nameTelugu: 'పాలు', productCount: 10 },
      { id: 'curd-yogurt', name: 'Curd & Yogurt', nameHindi: 'दही', nameTelugu: 'పెరుగు', productCount: 12 },
      { id: 'paneer-cheese', name: 'Paneer & Cheese', nameHindi: 'पनीर और चीज़', nameTelugu: 'పన్నీర్ & చీజ్', productCount: 15 },
      { id: 'butter-ghee', name: 'Butter & Ghee', nameHindi: 'मक्खन और घी', nameTelugu: 'వెన్న & నెయ్యి', productCount: 10 },
      { id: 'bread', name: 'Bread & Buns', nameHindi: 'ब्रेड', nameTelugu: 'బ్రెడ్', productCount: 15 },
      { id: 'eggs', name: 'Eggs', nameHindi: 'अंडे', nameTelugu: 'గుడ్లు', productCount: 8 },
    ],
  },
  {
    id: 'meat-fish',
    name: 'Meat & Fish',
    nameHindi: 'मांस और मछली',
    nameTelugu: 'మాంసం & చేపలు',
    icon: '🍗',
    image: '/placeholder.svg',
    color: 'hsl(0 60% 55%)',
    subcategories: [
      { id: 'chicken', name: 'Fresh Chicken', nameHindi: 'ताज़ा चिकन', nameTelugu: 'తాజా చికెన్', productCount: 20 },
      { id: 'mutton', name: 'Mutton & Lamb', nameHindi: 'मटन', nameTelugu: 'మటన్', productCount: 15 },
      { id: 'fish', name: 'Fresh Fish', nameHindi: 'ताज़ी मछली', nameTelugu: 'తాజా చేపలు', productCount: 25 },
      { id: 'prawns', name: 'Prawns & Seafood', nameHindi: 'झींगा', nameTelugu: 'రొయ్యలు', productCount: 12 },
      { id: 'eggs-meat', name: 'Country Eggs', nameHindi: 'देसी अंडे', nameTelugu: 'నాటు గుడ్లు', productCount: 5 },
      { id: 'marinated', name: 'Marinated & Ready', nameHindi: 'मैरिनेटेड', nameTelugu: 'మారినేటెడ్', productCount: 18 },
    ],
  },
  {
    id: 'pickles-homemade',
    name: 'Pickles & Homemade',
    nameHindi: 'अचार और घर का बना',
    nameTelugu: 'ఊరగాయలు & హోమ్‌మేడ్',
    icon: '🫙',
    image: '/placeholder.svg',
    color: 'hsl(25 75% 52%)',
    subcategories: [
      { id: 'andhra-pickles', name: 'Andhra Pickles', nameHindi: 'आंध्र अचार', nameTelugu: 'ఆంధ్ర ఊరగాయలు', productCount: 30 },
      { id: 'mango-pickles', name: 'Mango Pickles', nameHindi: 'आम का अचार', nameTelugu: 'మామిడి ఊరగాయ', productCount: 15 },
      { id: 'podis', name: 'Podis & Powders', nameHindi: 'पोड़ी और पाउडर', nameTelugu: 'పొడులు', productCount: 20 },
      { id: 'chutneys', name: 'Chutneys', nameHindi: 'चटनी', nameTelugu: 'చట్నీలు', productCount: 12 },
      { id: 'papads', name: 'Papads & Vadams', nameHindi: 'पापड़', nameTelugu: 'అప్పడాలు', productCount: 10 },
      { id: 'sweets', name: 'Homemade Sweets', nameHindi: 'घर की मिठाई', nameTelugu: 'ఇంట్లో తయారు చేసిన స్వీట్లు', productCount: 15 },
    ],
  },
  {
    id: 'organic-health',
    name: 'Organic & Health',
    nameHindi: 'जैविक और स्वास्थ्य',
    nameTelugu: 'ఆర్గానిక్ & హెల్త్',
    icon: '🌿',
    image: '/placeholder.svg',
    color: 'hsl(145 60% 45%)',
    subcategories: [
      { id: 'organic-veggies', name: 'Organic Vegetables', nameHindi: 'जैविक सब्जियां', nameTelugu: 'ఆర్గానిక్ కూరగాయలు', productCount: 25 },
      { id: 'organic-fruits', name: 'Organic Fruits', nameHindi: 'जैविक फल', nameTelugu: 'ఆర్గానిక్ పండ్లు', productCount: 18 },
      { id: 'cold-pressed', name: 'Cold Pressed Oils', nameHindi: 'कोल्ड प्रेस्ड तेल', nameTelugu: 'కోల్డ్ ప్రెస్డ్ నూనెలు', productCount: 12 },
      { id: 'honey-jaggery', name: 'Honey & Jaggery', nameHindi: 'शहद और गुड़', nameTelugu: 'తేనె & బెల్లం', productCount: 10 },
      { id: 'health-foods', name: 'Health Foods', nameHindi: 'स्वास्थ्य आहार', nameTelugu: 'హెల్త్ ఫుడ్స్', productCount: 20 },
      { id: 'immunity', name: 'Immunity Boosters', nameHindi: 'इम्युनिटी बूस्टर', nameTelugu: 'ఇమ్యూనిటీ బూస్టర్స్', productCount: 15 },
    ],
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    nameHindi: 'घर और रसोई',
    nameTelugu: 'హోమ్ & కిచెన్',
    icon: '🏠',
    image: '/placeholder.svg',
    color: 'hsl(280 40% 55%)',
    subcategories: [
      { id: 'cleaning', name: 'Cleaning Supplies', nameHindi: 'सफाई का सामान', nameTelugu: 'క్లీనింగ్ సప్లైస్', productCount: 25 },
      { id: 'pooja', name: 'Pooja Items', nameHindi: 'पूजा सामग्री', nameTelugu: 'పూజా సామగ్రి', productCount: 20 },
      { id: 'baby-care', name: 'Baby Care', nameHindi: 'शिशु देखभाल', nameTelugu: 'బేబీ కేర్', productCount: 15 },
      { id: 'personal-care', name: 'Personal Care', nameHindi: 'व्यक्तिगत देखभाल', nameTelugu: 'పర్సనల్ కేర్', productCount: 30 },
      { id: 'pet-care', name: 'Pet Care', nameHindi: 'पालतू जानवरों की देखभाल', nameTelugu: 'పెట్ కేర్', productCount: 10 },
      { id: 'kitchen-tools', name: 'Kitchen Tools', nameHindi: 'रसोई के उपकरण', nameTelugu: 'కిచెన్ టూల్స్', productCount: 18 },
    ],
  },
  {
    id: 'offers',
    name: 'Offers & Deals',
    nameHindi: 'ऑफ़र और डील',
    nameTelugu: 'ఆఫర్లు & డీల్స్',
    icon: '🏷️',
    image: '/placeholder.svg',
    color: 'hsl(340 70% 55%)',
    subcategories: [
      { id: 'daily-deals', name: 'Daily Deals', nameHindi: 'आज के सौदे', nameTelugu: 'డైలీ డీల్స్', productCount: 20 },
      { id: 'combo-packs', name: 'Combo Packs', nameHindi: 'कॉम्बो पैक', nameTelugu: 'కాంబో ప్యాక్స్', productCount: 15 },
      { id: 'clearance', name: 'Clearance Sale', nameHindi: 'क्लीयरेंस सेल', nameTelugu: 'క్లియరెన్స్ సేల్', productCount: 25 },
      { id: 'first-order', name: 'First Order Offers', nameHindi: 'पहले ऑर्डर पर ऑफर', nameTelugu: 'ఫస్ట్ ఆర్డర్ ఆఫర్స్', productCount: 10 },
    ],
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};
