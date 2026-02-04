import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Star, ChevronDown } from 'lucide-react';
import { Product, QuantityVariant } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const navigate = useNavigate();
  const { cart, addToCart, updateCartQuantity } = useApp();
  
  // Track selected variant
  const defaultVariant = product.quantityVariants?.[0] || { unit: product.unit, price: product.price, originalPrice: product.originalPrice };
  const [selectedVariant, setSelectedVariant] = useState<QuantityVariant>(defaultVariant);
  const [showVariants, setShowVariants] = useState(false);

  const cartItem = cart.find(item => 
    item.product.id === product.id && 
    (item.selectedVariant?.unit || item.product.unit) === selectedVariant.unit
  );
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant);
  };

  const handleUpdateQuantity = (e: React.MouseEvent, newQuantity: number) => {
    e.stopPropagation();
    updateCartQuantity(product.id, newQuantity, selectedVariant);
  };

  const handleVariantSelect = (e: React.MouseEvent, variant: QuantityVariant) => {
    e.stopPropagation();
    setSelectedVariant(variant);
    setShowVariants(false);
  };

  const currentPrice = selectedVariant.price;
  const currentOriginalPrice = selectedVariant.originalPrice;
  const discount = currentOriginalPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  const freshnessBadgeConfig = {
    'farm-fresh': { label: 'Farm Fresh', variant: 'fresh' as const },
    'organic': { label: 'Organic', variant: 'organic' as const },
    'handpicked': { label: 'Handpicked', variant: 'soft' as const },
    'local': { label: 'Local', variant: 'soft' as const },
  };

  const hasVariants = product.quantityVariants && product.quantityVariants.length > 1;

  if (variant === 'horizontal') {
    return (
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="flex gap-3 p-3 bg-card rounded-xl shadow-card border border-border/50 cursor-pointer active:scale-[0.99] transition-all duration-200"
      >
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg bg-muted"
          />
          {product.freshnessBadge && (
            <Badge
              variant={freshnessBadgeConfig[product.freshnessBadge].variant}
              className="absolute -top-1 -left-1 text-[9px] px-1.5 py-0.5"
            >
              {freshnessBadgeConfig[product.freshnessBadge].label}
            </Badge>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
            {product.name}
          </h3>
          
          {/* Quantity Selector */}
          {hasVariants ? (
            <div className="relative mb-2">
              <button
                onClick={(e) => { e.stopPropagation(); setShowVariants(!showVariants); }}
                className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-md"
              >
                <span className="font-medium">{selectedVariant.unit}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", showVariants && "rotate-180")} />
              </button>
              {showVariants && (
                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
                  {product.quantityVariants?.map((v) => (
                    <button
                      key={v.unit}
                      onClick={(e) => handleVariantSelect(e, v)}
                      className={cn(
                        "w-full px-3 py-2 text-left text-xs hover:bg-secondary transition-colors flex justify-between",
                        v.unit === selectedVariant.unit && "bg-primary/10 text-primary"
                      )}
                    >
                      <span>{v.unit}</span>
                      <span className="font-semibold">₹{v.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mb-2">{product.unit}</p>
          )}
          
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-primary">₹{currentPrice}</span>
            {currentOriginalPrice && (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  ₹{currentOriginalPrice}
                </span>
                <Badge variant="offer" className="text-[10px]">
                  {discount}% OFF
                </Badge>
              </>
            )}
          </div>

          {quantity === 0 ? (
            <Button
              variant="soft"
              size="sm"
              onClick={handleAddToCart}
              className="w-full h-8"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-3 bg-primary/10 rounded-lg h-8">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                className="h-7 w-7 text-primary hover:bg-primary/20"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-bold text-primary min-w-[20px] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                className="h-7 w-7 text-primary hover:bg-primary/20"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className={cn(
        "flex flex-col bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200",
        variant === 'compact' ? 'p-2' : 'p-3'
      )}
    >
      <div className="relative aspect-square mb-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl bg-muted"
        />
        {discount > 0 && (
          <Badge variant="offer" className="absolute top-2 right-2 text-[10px]">
            {discount}% OFF
          </Badge>
        )}
        {product.freshnessBadge && (
          <Badge
            variant={freshnessBadgeConfig[product.freshnessBadge].variant}
            className="absolute top-2 left-2 text-[9px] px-1.5 py-0.5"
          >
            {freshnessBadgeConfig[product.freshnessBadge].label}
          </Badge>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className={cn(
          "font-semibold text-foreground line-clamp-2 mb-1",
          variant === 'compact' ? 'text-xs' : 'text-sm'
        )}>
          {product.name}
        </h3>

        {/* Quantity Selector Chips */}
        {hasVariants ? (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.quantityVariants?.slice(0, 3).map((v) => (
              <button
                key={v.unit}
                onClick={(e) => handleVariantSelect(e, v)}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-medium transition-all border",
                  v.unit === selectedVariant.unit
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-muted-foreground border-transparent hover:border-primary/30"
                )}
              >
                {v.unit}
              </button>
            ))}
            {product.quantityVariants && product.quantityVariants.length > 3 && (
              <span className="text-[9px] text-muted-foreground px-1">+{product.quantityVariants.length - 3}</span>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mb-2">{product.unit}</p>
        )}

        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-trust text-trust" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-primary">₹{currentPrice}</span>
            {currentOriginalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{currentOriginalPrice}
              </span>
            )}
          </div>

          {quantity === 0 ? (
            <Button
              variant="soft"
              size="sm"
              onClick={handleAddToCart}
              className="w-full h-9"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-3 bg-primary/10 rounded-xl h-9">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                className="h-7 w-7 text-primary hover:bg-primary/20"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-bold text-primary min-w-[20px] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                className="h-7 w-7 text-primary hover:bg-primary/20"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
