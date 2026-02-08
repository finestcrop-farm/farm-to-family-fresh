import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Truck, Clock, Tag, ChevronRight, Shield } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNav';
import { getFeaturedProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, cartTotal, clearCart } = useApp();
  const recommendations = getFeaturedProducts().slice(0, 4);

  const deliveryFee = cartTotal >= 299 ? 0 : 30;
  const total = cartTotal + deliveryFee;
  const freeDeliveryProgress = Math.min((cartTotal / 299) * 100, 100);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-heading text-xl font-bold">Your Cart</h1>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 animate-bounce-soft">
            <ShoppingBag className="w-12 h-12 text-primary" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6 max-w-[260px]">
            Looks like you haven't added any farm-fresh items yet!
          </p>
          <Button variant="hero" size="lg" onClick={() => navigate('/')}>
            Start Shopping
          </Button>

          {/* Recommendations */}
          <div className="w-full mt-12">
            <h3 className="font-heading text-lg font-bold text-foreground text-left mb-4">
              Popular Items
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((product, index) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <ProductCard product={product} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-56">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading text-xl font-bold">Your Cart</h1>
              <p className="text-xs opacity-80">{cart.length} items</p>
            </div>
          </div>
          <button
            onClick={clearCart}
            className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
          >
            Clear All
          </button>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Free Delivery Progress */}
        {cartTotal < 299 && (
          <div className="p-4 bg-gradient-card rounded-xl border border-accent/20 shadow-soft animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <Truck className="w-5 h-5 text-accent" />
              <p className="text-sm text-foreground font-medium">
                Add ₹{299 - cartTotal} more for <span className="text-accent font-bold">FREE delivery!</span>
              </p>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-accent rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {cartTotal >= 299 && (
          <div className="flex items-center gap-3 p-3 bg-fresh/10 rounded-xl border border-fresh/20 animate-fade-in">
            <Truck className="w-5 h-5 text-fresh" />
            <p className="text-sm text-foreground font-medium">
              🎉 Yay! You've unlocked <span className="text-fresh font-bold">FREE delivery!</span>
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-3">
          {cart.map((item, index) => {
            const itemPrice = item.selectedVariant?.price || item.product.price;
            const itemUnit = item.selectedVariant?.unit || item.product.unit;
            
            return (
              <div
                key={`${item.product.id}-${itemUnit}`}
                className="flex gap-3 p-3 bg-card rounded-xl shadow-card border border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  onClick={() => navigate(`/product/${item.product.id}`)}
                  className="w-20 h-20 object-cover rounded-lg bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                />
                <div className="flex-1 min-w-0">
                  <h3 
                    onClick={() => navigate(`/product/${item.product.id}`)}
                    className="font-semibold text-sm text-foreground line-clamp-2 mb-1 cursor-pointer hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">{itemUnit}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-lg">
                      ₹{itemPrice * item.quantity}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                          className="p-1 rounded hover:bg-primary/20 text-primary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-primary min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                          className="p-1 rounded hover:bg-primary/20 text-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coupon Section */}
        <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 shadow-soft">
          <Tag className="w-5 h-5 text-accent" />
          <input
            type="text"
            placeholder="Enter coupon code"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
          />
          <Button variant="soft" size="sm">Apply</Button>
        </div>

        {/* Delivery Slot */}
        <div className="p-4 bg-card rounded-xl border border-border/50 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Delivery Slot</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { label: 'Express', time: '2-4 hrs', active: true },
              { label: 'Standard', time: 'Today', active: false },
              { label: 'Morning', time: '6-9 AM', active: false },
            ].map((slot) => (
              <button
                key={slot.label}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm transition-all active:scale-95 ${
                  slot.active
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <p className="font-semibold">{slot.label}</p>
                <p className="text-xs opacity-80">{slot.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center gap-2 p-3 bg-fresh/5 rounded-xl border border-fresh/10">
          <Shield className="w-4 h-4 text-fresh" />
          <p className="text-xs text-foreground">
            100% Quality Guarantee • Safe & Secure Payment
          </p>
        </div>

        {/* Recommendations */}
        <section>
          <h3 className="font-heading text-lg font-bold text-foreground mb-3">
            Add more items
          </h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            {recommendations.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[140px]">
                <ProductCard product={product} variant="compact" />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border px-4 py-4 safe-area-bottom z-40 shadow-elevated">
        {/* Bill Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Item Total</span>
            <span className="text-foreground font-medium">₹{cartTotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className={deliveryFee === 0 ? 'text-fresh font-bold' : 'text-foreground'}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
            <span className="text-foreground">Total</span>
            <span className="text-primary">₹{total}</span>
          </div>
        </div>

        <Button variant="hero" size="xl" className="w-full shadow-glow" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Cart;
