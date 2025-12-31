import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, Clock, Percent, Package, ChevronRight, Star, Repeat } from 'lucide-react';
import { subscriptionPlans } from '@/data/subscriptionPlans';
import { products } from '@/data/products';
import { subscribableProducts } from '@/data/subscriptionPlans';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Subscriptions: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('weekly');
  
  const subscribableProductsList = products.filter(p => subscribableProducts.includes(p.id));
  const categories = [
    { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛' },
    { id: 'vegetables', name: 'Fresh Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fresh Fruits', icon: '🍎' },
    { id: 'staples', name: 'Daily Staples', icon: '🌾' },
    { id: 'millets', name: 'Millets', icon: '🌾' },
  ];
  const [selectedCategory, setSelectedCategory] = useState('dairy');
  
  const filteredProducts = subscribableProductsList.filter(p => {
    if (selectedCategory === 'dairy') return p.category === 'dairy-bakery' || p.subcategory === 'eggs';
    if (selectedCategory === 'vegetables') return p.category === 'fruits-vegetables' && p.subcategory !== 'fresh-fruits';
    if (selectedCategory === 'fruits') return p.subcategory === 'fresh-fruits';
    if (selectedCategory === 'staples') return p.category === 'grocery-staples' && p.subcategory !== 'millets';
    if (selectedCategory === 'millets') return p.subcategory === 'millets';
    return true;
  });

  const selectedPlanDetails = subscriptionPlans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading text-lg font-bold flex items-center gap-2">
              <Repeat className="w-5 h-5" />
              Subscriptions
            </h1>
            <p className="text-xs opacity-80">Save up to 15% on regular deliveries</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-2xl p-5 border border-border shadow-elevated overflow-hidden relative">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-soft">
              <Calendar className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-xl font-bold text-foreground mb-1">
                Never Run Out of Essentials
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                Subscribe to your daily essentials and get them delivered automatically
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="fresh" className="text-xs">
                  <Percent className="w-3 h-3 mr-1" /> Up to 15% OFF
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" /> Flexible Schedule
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <section>
          <h3 className="font-heading text-base font-bold text-foreground mb-3">
            Choose Your Plan
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {subscriptionPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "relative p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98]",
                  selectedPlan === plan.id
                    ? "border-primary bg-primary/5 shadow-soft"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                {selectedPlan === plan.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Repeat className={cn(
                    "w-4 h-4",
                    selectedPlan === plan.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="text-xs font-medium text-muted-foreground capitalize">
                    {plan.frequency}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">{plan.name}</h4>
                <div className="flex items-center gap-1">
                  <Badge variant="offer" className="text-xs">
                    {plan.discount}% OFF
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Selected Plan Details */}
        {selectedPlanDetails && (
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">{selectedPlanDetails.name}</h4>
              <Badge variant="fresh">{selectedPlanDetails.discount}% Savings</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Delivery Days: {selectedPlanDetails.deliveryDays?.join(', ')}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedPlanDetails.deliveryDays?.map(day => (
                <span
                  key={day}
                  className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-foreground"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <section>
          <h3 className="font-heading text-base font-bold text-foreground mb-3">
            Subscribe to Products
          </h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95",
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Subscribable Products */}
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in relative"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="absolute top-2 left-2 z-10">
                <Badge variant="fresh" className="text-[10px]">
                  <Repeat className="w-3 h-3 mr-1" />
                  Subscribe
                </Badge>
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* How It Works */}
        <section className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-heading text-base font-bold text-foreground mb-4">
            How Subscriptions Work
          </h3>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Choose Products', desc: 'Select items you need regularly', icon: Package },
              { step: 2, title: 'Pick Frequency', desc: 'Daily, weekly, or monthly delivery', icon: Calendar },
              { step: 3, title: 'Save & Relax', desc: 'Get automatic deliveries with discounts', icon: Star },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-hero rounded-2xl p-5 text-primary-foreground">
          <h3 className="font-semibold text-lg mb-2">Start Your First Subscription</h3>
          <p className="text-sm opacity-90 mb-4">Add products to cart and choose subscription at checkout</p>
          <Button variant="secondary" className="w-full" onClick={() => navigate('/categories')}>
            Browse Products
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Subscriptions;