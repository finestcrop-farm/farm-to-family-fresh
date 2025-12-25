import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, Plus, Minus, Truck, Shield, Leaf, Clock } from 'lucide-react';
import { getProductById } from '@/data/products';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { cart, addToCart, updateCartQuantity } = useApp();
  const [isFavorite, setIsFavorite] = useState(false);

  const product = getProductById(productId || '');

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const freshnessBadgeConfig = {
    'farm-fresh': { label: 'Farm Fresh', variant: 'fresh' as const, icon: '🌿' },
    'organic': { label: '100% Organic', variant: 'organic' as const, icon: '🌱' },
    'handpicked': { label: 'Handpicked', variant: 'soft' as const, icon: '✋' },
    'local': { label: 'Locally Sourced', variant: 'soft' as const, icon: '📍' },
  };

  const features = [
    { icon: Truck, label: 'Free Delivery', desc: 'On orders above ₹299' },
    { icon: Shield, label: 'Quality Assured', desc: 'FSSAI certified' },
    { icon: Leaf, label: 'Fresh Guaranteed', desc: 'Or full refund' },
    { icon: Clock, label: 'Express Delivery', desc: 'In 2-4 hours' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-full bg-card/80 backdrop-blur-sm shadow-soft active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={cn(
                "p-2.5 rounded-full bg-card/80 backdrop-blur-sm shadow-soft active:scale-95 transition-all",
                isFavorite && "text-destructive"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
            </button>
            <button className="p-2.5 rounded-full bg-card/80 backdrop-blur-sm shadow-soft active:scale-95 transition-all">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Product Image */}
      <div className="relative aspect-square bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.freshnessBadge && (
          <div className="absolute bottom-4 left-4">
            <Badge variant={freshnessBadgeConfig[product.freshnessBadge].variant} className="text-sm px-3 py-1.5">
              {freshnessBadgeConfig[product.freshnessBadge].icon} {freshnessBadgeConfig[product.freshnessBadge].label}
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 py-5 bg-card rounded-t-3xl -mt-6 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="font-serif text-2xl font-bold text-foreground mb-1">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground">{product.unit}</p>
          </div>
          {product.rating && (
            <div className="flex items-center gap-1 bg-trust/10 px-2.5 py-1.5 rounded-lg">
              <Star className="w-4 h-4 fill-trust text-trust" />
              <span className="font-bold text-sm">{product.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl font-bold text-primary">₹{product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
              <Badge variant="offer">{discount}% OFF</Badge>
            </>
          )}
        </div>

        {/* Farm Source */}
        {product.farmSource && (
          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl mb-5">
            <span className="text-2xl">🌾</span>
            <div>
              <p className="text-xs text-muted-foreground">Sourced from</p>
              <p className="font-semibold text-foreground">{product.farmSource}</p>
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div className="mb-5">
            <h3 className="font-semibold text-foreground mb-2">About this product</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {features.map((feature) => (
            <div key={feature.label} className="flex items-center gap-2 p-3 bg-secondary rounded-xl">
              <feature.icon className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">{feature.label}</p>
                <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Storage Tips */}
        {product.storageTips && (
          <div className="p-4 bg-muted rounded-xl mb-5">
            <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              💡 Storage Tips
            </h3>
            <p className="text-sm text-muted-foreground">{product.storageTips}</p>
          </div>
        )}

        {/* FSSAI & Expiry */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
          {product.fssaiLicense && (
            <span>FSSAI: {product.fssaiLicense}</span>
          )}
          {product.expiryDays && (
            <span>Best before: {product.expiryDays} days</span>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-4 safe-area-bottom z-50">
        <div className="flex items-center gap-4">
          {quantity === 0 ? (
            <Button
              variant="hero"
              size="xl"
              onClick={() => addToCart(product)}
              className="flex-1"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Cart - ₹{product.price}
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-4 bg-primary/10 rounded-2xl px-4 py-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateCartQuantity(product.id, quantity - 1)}
                  className="h-10 w-10 text-primary hover:bg-primary/20"
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <span className="font-bold text-xl text-primary min-w-[32px] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateCartQuantity(product.id, quantity + 1)}
                  className="h-10 w-10 text-primary hover:bg-primary/20"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate('/cart')}
                className="flex-1"
              >
                View Cart - ₹{product.price * quantity}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
