import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, Bell, Sparkles, TrendingUp, Clock, Percent, ChevronRight, Gift, Zap, Tag } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import OfferCard from '@/components/OfferCard';
import NotificationCard, { NotificationItem } from '@/components/NotificationCard';
import { categories } from '@/data/categories';
import { getFeaturedProducts, getOfferProducts, getBestSellers } from '@/data/products';
import { getActiveOffers } from '@/data/offers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import logoImg from '@/assets/logo.png';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLocation, cartItemCount } = useApp();
  const featuredProducts = getFeaturedProducts();
  const offerProducts = getOfferProducts();
  const bestSellers = getBestSellers();
  const activeOffers = getActiveOffers().slice(0, 3);
  
  // Sample notifications for home page
  const homeNotifications: NotificationItem[] = [
    {
      id: '1',
      type: 'offer',
      title: '🔥 Flash Sale Live!',
      message: 'Get 30% off on fresh vegetables. Limited time only!',
      time: 'Now',
      read: false,
      actionUrl: '/offers',
    },
    {
      id: '2',
      type: 'delivery',
      title: 'Free Delivery Today',
      message: 'Orders above ₹499 get free delivery. Order now!',
      time: '2 hrs ago',
      read: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => navigate('/location')}
              className="flex items-center gap-2 active:opacity-70 transition-opacity group"
            >
              <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs opacity-80">Deliver to</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold max-w-[140px] truncate">
                    {selectedLocation}
                  </span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                </div>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <button className="relative p-2.5 rounded-full bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full animate-pulse border-2 border-primary" />
              </button>
              <img src={logoImg} alt="Logo" className="h-9 w-auto" />
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
        <div className="bg-gradient-to-br from-primary/5 via-card to-accent/5 rounded-3xl p-5 border border-border shadow-elevated animate-fade-in overflow-hidden relative">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <Badge variant="offer" className="text-xs font-semibold">First Order</Badge>
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
                Get 20% OFF
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Fresh groceries delivered to your door
              </p>
              <Button variant="accent" size="sm" className="shadow-soft group">
                Shop Now
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <img 
                src={logoImg} 
                alt="Our Pure Naturals" 
                className="w-28 h-auto relative z-10"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Clock, label: '2-4 hrs', desc: 'Delivery', color: 'bg-primary/10 text-primary', iconBg: 'bg-primary', link: null },
            { icon: Tag, label: 'Offers', desc: 'Save 40%', color: 'bg-accent/10 text-accent', iconBg: 'bg-accent', link: '/offers' },
            { icon: Gift, label: 'Subscribe', desc: 'Save 15%', color: 'bg-fresh/10 text-fresh', iconBg: 'bg-fresh', link: '/subscriptions' },
            { icon: Zap, label: 'Diet', desc: 'Filters', color: 'bg-primary/10 text-primary', iconBg: 'bg-primary', link: '/dietary-filters' },
          ].map((stat, index) => (
            <button 
              key={stat.label} 
              onClick={() => stat.link && navigate(stat.link)}
              className="flex flex-col items-center p-2 bg-card rounded-2xl shadow-card border border-border/50 animate-fade-in hover:shadow-soft transition-shadow"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center mb-1 shadow-sm`}>
                <stat.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <p className="font-bold text-xs text-foreground">{stat.label}</p>
              <p className="text-[9px] text-muted-foreground">{stat.desc}</p>
            </button>
          ))}
        </div>

        {/* Notification Cards */}
        {homeNotifications.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Updates for You
              </h2>
              <button 
                onClick={() => navigate('/notifications')}
                className="text-sm text-primary font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {homeNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  variant="compact"
                />
              ))}
            </div>
          </section>
        )}

        {/* Offer Cards */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
              <Percent className="w-5 h-5 text-accent" />
              Today's Offers
            </h2>
            <button 
              onClick={() => navigate('/offers')}
              className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
            >
              All Offers
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            {activeOffers.map((offer, index) => (
              <div 
                key={offer.id} 
                className="flex-shrink-0 w-[280px] animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <OfferCard offer={offer} variant="compact" />
              </div>
            ))}
          </div>
        </section>

        {/* Quick Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-foreground">
              Shop by Category
            </h2>
            <button 
              onClick={() => navigate('/categories')}
              className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 group"
            >
              See All
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {categories.slice(0, 8).map((category, index) => (
              <div 
                key={category.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <CategoryCard category={category} variant="compact" />
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Farm Fresh Picks
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Handpicked just for you
              </p>
            </div>
            <button 
              onClick={() => navigate('/categories')}
              className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 group"
            >
              View All
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="flex-shrink-0 w-[155px] animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} variant="compact" />
              </div>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Today's Deals
                </h2>
                <p className="text-xs text-muted-foreground">
                  Save more on your favorites
                </p>
              </div>
              <Badge variant="offer" className="animate-pulse">🔥 Hot</Badge>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
              {offerProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="flex-shrink-0 w-[155px] animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} variant="compact" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trust Banner */}
        <section className="bg-gradient-fresh rounded-2xl p-5 text-primary-foreground shadow-elevated overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-foreground/10 rounded-full" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-3xl">🌿</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base">
                From Our Farm to Your Family
              </h3>
              <p className="text-sm opacity-90">
                100% fresh, pure & natural products
              </p>
            </div>
          </div>
        </section>

        {/* Popular Categories Grid */}
        <section>
          <h2 className="font-heading text-lg font-bold text-foreground mb-4">
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
        <section className="bg-card rounded-2xl p-4 border border-border shadow-card overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-soft">
              <img src={logoImg} alt="App" className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
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
