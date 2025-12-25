import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, Bell, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { categories } from '@/data/categories';
import { getFeaturedProducts, getOfferProducts } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLocation } = useApp();
  const featuredProducts = getFeaturedProducts();
  const offerProducts = getOfferProducts();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => navigate('/location')}
              className="flex items-center gap-1 active:opacity-70 transition-opacity"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium max-w-[180px] truncate">
                {selectedLocation}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="relative p-2 rounded-full bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
          <SearchBar 
            placeholder="Search for vegetables, fruits, meat..."
            variant="hero"
          />
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-card rounded-3xl p-5 border border-border/50 shadow-soft animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-trust" />
            <Badge variant="trust" className="text-xs">Special Offer</Badge>
          </div>
          <h2 className="font-serif text-xl font-bold text-foreground mb-1">
            Fresh from the Farm
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Get 20% off on your first order with code FRESH20
          </p>
          <Button variant="accent" size="sm">
            Shop Now
          </Button>
        </div>

        {/* Quick Categories */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg font-bold text-foreground">
              Shop by Category
            </h2>
            <button 
              onClick={() => navigate('/categories')}
              className="text-sm text-primary font-medium"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {categories.slice(0, 8).map((category, index) => (
              <div 
                key={category.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CategoryCard category={category} variant="compact" />
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-foreground">
                Farm Fresh Picks
              </h2>
              <p className="text-xs text-muted-foreground">
                Handpicked just for you
              </p>
            </div>
            <button className="text-sm text-primary font-medium">
              View All
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="flex-shrink-0 w-[160px] animate-slide-in-right"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} variant="compact" />
              </div>
            ))}
          </div>
        </section>

        {/* Offers Section */}
        {offerProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-foreground">
                  Today's Deals
                </h2>
                <p className="text-xs text-muted-foreground">
                  Save more on your favorites
                </p>
              </div>
              <Badge variant="offer">Hot Deals</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {offerProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Trust Banner */}
        <section className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-sm">
                From Our Farm to Your Family
              </h3>
              <p className="text-xs text-muted-foreground">
                100% fresh, pure & natural products
              </p>
            </div>
          </div>
        </section>

        {/* Popular Categories Grid */}
        <section>
          <h2 className="font-serif text-lg font-bold text-foreground mb-3">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
