import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Star } from 'lucide-react';
import { Product } from '@/types';
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

  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleUpdateQuantity = (e: React.MouseEvent, newQuantity: number) => {
    e.stopPropagation();
    updateCartQuantity(product.id, newQuantity);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const freshnessBadgeConfig = {
    'farm-fresh': { label: 'Farm Fresh', variant: 'fresh' as const },
    'organic': { label: 'Organic', variant: 'organic' as const },
    'handpicked': { label: 'Handpicked', variant: 'soft' as const },
    'local': { label: 'Local', variant: 'soft' as const },
  };

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
          <p className="text-xs text-muted-foreground mb-2">{product.unit}</p>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-primary">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.originalPrice}
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
        <p className="text-xs text-muted-foreground mb-2">{product.unit}</p>

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
            <span className="font-bold text-primary">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.originalPrice}
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
