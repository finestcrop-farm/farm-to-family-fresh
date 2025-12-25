import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Truck, Clock, Tag } from 'lucide-react';
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-muted active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-serif text-xl font-bold text-foreground">Your Cart</h1>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some fresh items to get started!
          </p>
          <Button variant="hero" onClick={() => navigate('/')}>
            Start Shopping
          </Button>

          {/* Recommendations */}
          <div className="w-full mt-12">
            <h3 className="font-semibold text-foreground text-left mb-4">
              Popular Items
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-48">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-muted active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground">Your Cart</h1>
              <p className="text-xs text-muted-foreground">{cart.length} items</p>
            </div>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-destructive font-medium"
          >
            Clear All
          </button>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Free Delivery Banner */}
        {cartTotal < 299 && (
          <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-xl border border-accent/20">
            <Truck className="w-5 h-5 text-accent" />
            <p className="text-sm text-foreground">
              Add ₹{299 - cartTotal} more for <span className="font-semibold">FREE delivery!</span>
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-3 p-3 bg-card rounded-xl shadow-card border border-border/50"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg bg-muted"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
                  {item.product.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">{item.product.unit}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">
                    ₹{item.product.price * item.quantity}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded hover:bg-primary/20 text-primary"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-primary min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded hover:bg-primary/20 text-primary"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Section */}
        <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50">
          <Tag className="w-5 h-5 text-primary" />
          <input
            type="text"
            placeholder="Enter coupon code"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button variant="soft" size="sm">Apply</Button>
        </div>

        {/* Delivery Slot */}
        <div className="p-4 bg-card rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Delivery Slot</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['Express (2-4 hrs)', 'Standard (Today)', 'Early Morning'].map((slot, i) => (
              <button
                key={slot}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                  i === 0
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <section>
          <h3 className="font-semibold text-foreground mb-3">
            Add more items
          </h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {recommendations.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[140px]">
                <ProductCard product={product} variant="compact" />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border px-4 py-4 safe-area-bottom z-40">
        {/* Bill Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Item Total</span>
            <span className="text-foreground">₹{cartTotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className={deliveryFee === 0 ? 'text-fresh font-medium' : 'text-foreground'}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
            <span className="text-foreground">Total</span>
            <span className="text-primary">₹{total}</span>
          </div>
        </div>

        <Button variant="hero" size="xl" className="w-full">
          Proceed to Checkout
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Cart;
