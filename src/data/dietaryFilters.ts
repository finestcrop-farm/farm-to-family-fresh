import { DietaryFilter, DietaryTag } from '@/types';

export const dietaryFilters: DietaryFilter[] = [
  {
    id: 'diabetic-friendly',
    name: 'Diabetic Friendly',
    icon: '🩺',
    description: 'Low glycemic index foods',
  },
  {
    id: 'high-protein',
    name: 'High Protein',
    icon: '💪',
    description: 'Protein-rich foods',
  },
  {
    id: 'gluten-free',
    name: 'Gluten Free',
    icon: '🌾',
    description: 'No wheat or gluten',
  },
  {
    id: 'low-carb',
    name: 'Low Carb',
    icon: '🥗',
    description: 'Reduced carbohydrates',
  },
  {
    id: 'heart-healthy',
    name: 'Heart Healthy',
    icon: '❤️',
    description: 'Good for cardiovascular health',
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss',
    icon: '⚖️',
    description: 'Low calorie options',
  },
  {
    id: 'vegan',
    name: 'Vegan',
    icon: '🌱',
    description: 'Plant-based only',
  },
  {
    id: 'organic',
    name: 'Organic',
    icon: '🌿',
    description: 'Certified organic',
  },
];

export const getDietaryFilterById = (id: DietaryTag): DietaryFilter | undefined => {
  return dietaryFilters.find(f => f.id === id);
};

// Product dietary tag mappings
export const productDietaryTags: Record<string, DietaryTag[]> = {
  // Millets - all diabetic friendly and gluten free
  'kodo-millet-1': ['diabetic-friendly', 'gluten-free', 'heart-healthy', 'weight-loss'],
  'barnyard-millet-1': ['diabetic-friendly', 'gluten-free', 'heart-healthy', 'weight-loss'],
  'foxtail-millet-1': ['diabetic-friendly', 'gluten-free', 'heart-healthy', 'high-protein'],
  'little-millet-1': ['diabetic-friendly', 'gluten-free', 'heart-healthy', 'weight-loss'],
  'finger-millet-1': ['diabetic-friendly', 'gluten-free', 'heart-healthy', 'high-protein'],
  'pearl-millet-1': ['diabetic-friendly', 'gluten-free', 'heart-healthy', 'high-protein'],
  'proso-millet-1': ['diabetic-friendly', 'gluten-free', 'heart-healthy', 'high-protein'],
  'sorghum-millet-1': ['diabetic-friendly', 'gluten-free', 'heart-healthy', 'weight-loss'],
  'barley-1': ['diabetic-friendly', 'heart-healthy', 'weight-loss'],
  'oats-1': ['diabetic-friendly', 'heart-healthy', 'weight-loss', 'high-protein'],
  'brown-rice-1': ['diabetic-friendly', 'heart-healthy', 'organic'],
  'broken-wheat-1': ['heart-healthy', 'weight-loss'],
  'red-rice-poha-1': ['diabetic-friendly', 'gluten-free', 'organic'],
  
  // Pulses - high protein
  'toor-dal-1': ['high-protein', 'vegan', 'heart-healthy'],
  'moong-dal-1': ['high-protein', 'vegan', 'diabetic-friendly', 'weight-loss'],
  'masoor-dal-1': ['high-protein', 'vegan', 'heart-healthy'],
  'chana-dal-1': ['high-protein', 'vegan', 'diabetic-friendly'],
  'urad-dal-1': ['high-protein', 'vegan'],
  'rajma-1': ['high-protein', 'vegan', 'heart-healthy'],
  'lobia-1': ['high-protein', 'vegan', 'diabetic-friendly'],
  'chole-1': ['high-protein', 'vegan', 'heart-healthy'],
  'soybeans-1': ['high-protein', 'vegan', 'organic'],
  'mixed-sprouts-1': ['high-protein', 'vegan', 'weight-loss', 'organic'],
  
  // Meat & Fish - high protein
  'chicken-1': ['high-protein', 'gluten-free', 'low-carb'],
  'chicken-2': ['high-protein', 'gluten-free', 'low-carb', 'weight-loss'],
  'fish-1': ['high-protein', 'gluten-free', 'heart-healthy', 'low-carb'],
  'mutton-1': ['high-protein', 'gluten-free'],
  'eggs-1': ['high-protein', 'gluten-free', 'low-carb'],
  'country-eggs-1': ['high-protein', 'gluten-free', 'low-carb', 'organic'],
  
  // Dairy
  'paneer-1': ['high-protein', 'gluten-free', 'low-carb'],
  'curd-1': ['high-protein', 'gluten-free', 'heart-healthy'],
  'milk-1': ['high-protein', 'gluten-free'],
  
  // Oils - heart healthy
  'cold-pressed-oil-1': ['heart-healthy', 'organic', 'vegan'],
  'coconut-oil-1': ['heart-healthy', 'organic', 'vegan'],
  'rice-bran-oil-1': ['heart-healthy', 'organic', 'vegan'],
  'mustard-oil-1': ['heart-healthy', 'organic', 'vegan'],
  'olive-oil-1': ['heart-healthy', 'organic', 'vegan'],
  
  // Nuts & Seeds
  'flax-seeds-1': ['heart-healthy', 'organic', 'vegan', 'high-protein'],
  'chia-seeds-1': ['heart-healthy', 'organic', 'vegan', 'high-protein', 'weight-loss'],
  'almonds-1': ['heart-healthy', 'vegan', 'high-protein', 'diabetic-friendly'],
  'walnuts-1': ['heart-healthy', 'vegan', 'organic'],
  'peanuts-1': ['high-protein', 'vegan', 'heart-healthy'],
  
  // Vegetables - vegan
  'spinach-1': ['vegan', 'weight-loss', 'heart-healthy', 'gluten-free', 'diabetic-friendly'],
  'methi-leaves-1': ['vegan', 'weight-loss', 'diabetic-friendly', 'gluten-free'],
  'amaranth-leaves-1': ['vegan', 'weight-loss', 'gluten-free', 'high-protein'],
  'cucumber-1': ['vegan', 'weight-loss', 'gluten-free', 'diabetic-friendly'],
  'beetroot-1': ['vegan', 'heart-healthy', 'gluten-free'],
  'mushroom-1': ['vegan', 'weight-loss', 'gluten-free', 'low-carb'],
  
  // Organic products
  'honey-1': ['organic', 'vegan'],
  'pure-honey-1': ['organic', 'vegan'],
  'jaggery-1': ['organic', 'vegan'],
  'green-tea-1': ['organic', 'vegan', 'weight-loss'],
};