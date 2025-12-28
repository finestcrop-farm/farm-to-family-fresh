import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, Bell, Sparkles, TrendingUp, Clock, Percent } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { categories } from '@/data/categories';
import { getFeaturedProducts, getOfferProducts, getBestSellers } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import logoImg from '@/assets/logo.png';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLocation, cartItemCount } = useApp();
  const featuredProducts = getFeaturedProducts();
  const offerProducts = getOfferProducts();
  const bestSellers = getBestSellers();

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
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-full bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
              </button>
            </div>
          </div>
          <SearchBar 
            placeholder="Search for vegetables, fruits, meat..."
            variant="hero"
          />
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-card rounded-2xl p-5 border border-border shadow-elevated animate-fade-in overflow-hidden relative">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full" />
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent/5 rounded-full" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <Badge variant="offer" className="text-xs">Special Offer</Badge>
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-1">
                Fresh from the Farm
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                Get 20% off on your first order
              </p>
              <Button variant="accent" size="sm" className="shadow-soft">
                Shop Now
              </Button>
            </div>
            <img 
              src={logoImg} 
              alt="Our Pure Naturals" 
              className="w-24 h-auto opacity-90"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Clock, label: '2-4 hrs', desc: 'Delivery', color: 'text-primary bg-primary/10' },
            { icon: Percent, label: 'Upto 40%', desc: 'Savings', color: 'text-accent bg-accent/10' },
            { icon: TrendingUp, label: '1000+', desc: 'Products', color: 'text-fresh bg-fresh/10' },
          ].map((stat) => (
            <div 
              key={stat.label} 
              className="flex flex-col items-center p-3 bg-card rounded-xl shadow-card border border-border/50 animate-fade-in"
            >
              <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-1`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <p className="font-bold text-sm text-foreground">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick Categories */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-lg font-bold text-foreground">
              Shop by Category
            </h2>
            <button 
              onClick={() => navigate('/categories')}
              className="text-sm text-primary font-semibold hover:underline"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {categories.slice(0, 8).map((category, index) => (
              <div 
                key={category.id} 
                className="animate-fade-in"
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
              <h2 className="font-heading text-lg font-bold text-foreground">
                Farm Fresh Picks
              </h2>
              <p className="text-xs text-muted-foreground">
                Handpicked just for you
              </p>
            </div>
            <button 
              onClick={() => navigate('/categories')}
              className="text-sm text-primary font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="flex-shrink-0 w-[160px] animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} variant="compact" />
              </div>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h2 className="font-heading text-lg font-bold text-foreground">
                Best Sellers
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {bestSellers.slice(0, 4).map((product, index) => (
              <div 
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Offers Section */}
        {offerProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Today's Deals
                </h2>
                <p className="text-xs text-muted-foreground">
                  Save more on your favorites
                </p>
              </div>
              <Badge variant="offer" className="animate-pulse">🔥 Hot Deals</Badge>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
              {offerProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="flex-shrink-0 w-[160px] animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} variant="compact" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trust Banner */}
        <section className="bg-gradient-fresh rounded-xl p-4 text-primary-foreground shadow-elevated">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-2xl">🌿</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">
                From Our Farm to Your Family
              </h3>
              <p className="text-xs opacity-90">
                100% fresh, pure & natural products
              </p>
            </div>
          </div>
        </section>

        {/* Popular Categories Grid */}
        <section>
          <h2 className="font-heading text-lg font-bold text-foreground mb-3">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((category, index) => (
              <div 
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </section>

        {/* App Download Banner */}
        <section className="bg-card rounded-xl p-4 border border-border shadow-card">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="App" className="w-14 h-14 rounded-xl" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-sm">
                Install our App
              </h3>
              <p className="text-xs text-muted-foreground">
                Get exclusive offers & faster checkout
              </p>
            </div>
            <Button variant="soft" size="sm">
              Install
            </Button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
