import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, Plus, Minus, Truck, Shield, Leaf, Clock, ChevronRight, MapPin } from 'lucide-react';
import { getProductById, getFeaturedProducts } from '@/data/products';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import QuantitySelector from '@/components/QuantitySelector';
import { cn } from '@/lib/utils';
import { QuantityVariant } from '@/types';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { cart, addToCart, updateCartQuantity, selectedLocation } = useApp();
  const [isFavorite, setIsFavorite] = useState(false);

  const product = getProductById(productId || '');
  const relatedProducts = getFeaturedProducts().filter(p => p.id !== productId).slice(0, 4);

  // Selected variant state
  const defaultVariant: QuantityVariant = product?.quantityVariants?.[0] || 
    { unit: product?.unit || '', price: product?.price || 0, originalPrice: product?.originalPrice };
  const [selectedVariant, setSelectedVariant] = useState<QuantityVariant>(defaultVariant);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <span className="text-6xl mb-4">🔍</span>
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">Product not found</h2>
        <p className="text-muted-foreground text-sm mb-4">The product you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
        >
          Go Home
        </button>
      </div>
    );
  }

  const cartItem = cart.find(item => 
    item.product.id === product.id && 
    (item.selectedVariant?.unit || item.product.unit) === selectedVariant.unit
  );
  const quantity = cartItem?.quantity || 0;

  const currentPrice = selectedVariant.price;
  const currentOriginalPrice = selectedVariant.originalPrice;
  const discount = currentOriginalPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
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

  const hasVariants = product.quantityVariants && product.quantityVariants.length > 1;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-full bg-card/90 backdrop-blur-sm shadow-elevated active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={cn(
                "p-2.5 rounded-full bg-card/90 backdrop-blur-sm shadow-elevated active:scale-95 transition-all",
                isFavorite && "text-destructive"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
            </button>
            <button className="p-2.5 rounded-full bg-card/90 backdrop-blur-sm shadow-elevated active:scale-95 transition-all">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-card">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.freshnessBadge && (
          <div className="absolute bottom-4 left-4">
            <Badge variant={freshnessBadgeConfig[product.freshnessBadge].variant} className="text-sm px-3 py-1.5 shadow-soft">
              {freshnessBadgeConfig[product.freshnessBadge].icon} {freshnessBadgeConfig[product.freshnessBadge].label}
            </Badge>
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-4 right-4">
            <Badge variant="offer" className="text-sm px-3 py-1.5 shadow-soft">
              {discount}% OFF
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 py-5 bg-card rounded-t-3xl -mt-6 relative">
        {/* Delivery Location */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Delivering to:</span>
          <span className="font-medium text-foreground">{selectedLocation}</span>
        </div>

        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground">{selectedVariant.unit}</p>
          </div>
          {product.rating && (
            <div className="flex items-center gap-1 bg-trust/10 px-3 py-1.5 rounded-xl">
              <Star className="w-4 h-4 fill-trust text-trust" />
              <span className="font-bold text-sm text-foreground">{product.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl font-bold text-primary">₹{currentPrice}</span>
          {currentOriginalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              ₹{currentOriginalPrice}
            </span>
          )}
          {discount > 0 && (
            <Badge variant="offer" className="text-sm">
              Save ₹{currentOriginalPrice! - currentPrice}
            </Badge>
          )}
        </div>

        {/* Quantity Variants Selector */}
        {hasVariants && (
          <div className="mb-5 p-4 bg-secondary/50 rounded-xl border border-border">
            <QuantitySelector
              variants={product.quantityVariants!}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />
          </div>
        )}

        {/* Farm Source */}
        {product.farmSource && (
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl mb-5 border border-primary/10">
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
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">About this product</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Dietary Tags */}
        {product.dietaryTags && product.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {product.dietaryTags.map(tag => (
              <Badge key={tag} variant="soft" className="text-xs">
                {tag.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {features.map((feature) => (
            <div key={feature.label} className="flex items-center gap-2 p-3 bg-secondary rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{feature.label}</p>
                <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Storage Tips */}
        {product.storageTips && (
          <div className="p-4 bg-accent/5 rounded-xl mb-5 border border-accent/10">
            <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2 text-sm">
              💡 Storage Tips
            </h3>
            <p className="text-sm text-muted-foreground">{product.storageTips}</p>
          </div>
        )}

        {/* FSSAI & Expiry */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4 mb-5">
          {product.fssaiLicense && (
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              FSSAI: {product.fssaiLicense}
            </span>
          )}
          {product.expiryDays && (
            <span>Best before: {product.expiryDays} days</span>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h3 className="font-heading text-sm font-bold text-foreground mb-3">You may also like</h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
              {relatedProducts.map((p) => (
                <div key={p.id} className="flex-shrink-0 w-[140px]">
                  <ProductCard product={p} variant="compact" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-4 safe-area-bottom z-50 shadow-elevated">
        <div className="flex items-center gap-4">
          {quantity === 0 ? (
            <Button
              variant="hero"
              size="xl"
              onClick={() => addToCart(product, selectedVariant)}
              className="flex-1 shadow-glow"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Cart — ₹{currentPrice}
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-4 bg-primary/10 rounded-2xl px-4 py-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateCartQuantity(product.id, quantity - 1, selectedVariant)}
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
                  onClick={() => updateCartQuantity(product.id, quantity + 1, selectedVariant)}
                  className="h-10 w-10 text-primary hover:bg-primary/20"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate('/cart')}
                className="flex-1 shadow-glow"
              >
                View Cart — ₹{currentPrice * quantity}
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
