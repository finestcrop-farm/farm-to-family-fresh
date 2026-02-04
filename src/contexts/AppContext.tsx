import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Language, UserPreferences, Product, QuantityVariant } from '@/types';

interface AppContextType {
  // User preferences
  language: Language;
  setLanguage: (lang: Language) => void;
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant?: QuantityVariant) => void;
  removeFromCart: (productId: string, variant?: QuantityVariant) => void;
  updateCartQuantity: (productId: string, quantity: number, variant?: QuantityVariant) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  
  // Location
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('Select Location');

  // Load preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('ourpurenaturals_prefs');
    if (savedPrefs) {
      const prefs: UserPreferences = JSON.parse(savedPrefs);
      setLanguageState(prefs.language);
      setOnboardingCompleted(prefs.onboardingCompleted);
    }
    
    const savedCart = localStorage.getItem('ourpurenaturals_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedLocation = localStorage.getItem('ourpurenaturals_location');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('ourpurenaturals_cart', JSON.stringify(cart));
  }, [cart]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const prefs: UserPreferences = {
      language: lang,
      onboardingCompleted,
    };
    localStorage.setItem('ourpurenaturals_prefs', JSON.stringify(prefs));
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
    const prefs: UserPreferences = {
      language,
      onboardingCompleted: true,
    };
    localStorage.setItem('ourpurenaturals_prefs', JSON.stringify(prefs));
  };

  // Helper to get cart item key
  const getCartItemKey = (productId: string, variant?: QuantityVariant) => {
    return variant ? `${productId}:${variant.unit}` : productId;
  };

  const addToCart = (product: Product, variant?: QuantityVariant) => {
    setCart(prev => {
      const existingItem = prev.find(item => {
        const itemKey = getCartItemKey(item.product.id, item.selectedVariant);
        const newKey = getCartItemKey(product.id, variant);
        return itemKey === newKey;
      });
      
      if (existingItem) {
        return prev.map(item => {
          const itemKey = getCartItemKey(item.product.id, item.selectedVariant);
          const newKey = getCartItemKey(product.id, variant);
          return itemKey === newKey
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      }
      return [...prev, { product, quantity: 1, selectedVariant: variant }];
    });
  };

  const removeFromCart = (productId: string, variant?: QuantityVariant) => {
    setCart(prev => prev.filter(item => {
      const itemKey = getCartItemKey(item.product.id, item.selectedVariant);
      const removeKey = getCartItemKey(productId, variant);
      return itemKey !== removeKey;
    }));
  };

  const updateCartQuantity = (productId: string, quantity: number, variant?: QuantityVariant) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        const itemKey = getCartItemKey(item.product.id, item.selectedVariant);
        const updateKey = getCartItemKey(productId, variant);
        return itemKey === updateKey ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => {
      const price = item.selectedVariant?.price || item.product.price;
      return total + price * item.quantity;
    },
    0
  );

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleSetLocation = (location: string) => {
    setSelectedLocation(location);
    localStorage.setItem('ourpurenaturals_location', location);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        onboardingCompleted,
        completeOnboarding,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        selectedLocation,
        setSelectedLocation: handleSetLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
