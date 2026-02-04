import React from 'react';
import { QuantityVariant } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface QuantitySelectorProps {
  variants: QuantityVariant[];
  selectedVariant: QuantityVariant;
  onSelect: (variant: QuantityVariant) => void;
  compact?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  variants,
  selectedVariant,
  onSelect,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {variants.map((variant) => {
          const isSelected = variant.unit === selectedVariant.unit;
          const discount = variant.originalPrice
            ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
            : 0;

          return (
            <button
              key={variant.unit}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(variant);
              }}
              className={cn(
                "px-2 py-1 rounded-lg text-[10px] font-medium transition-all border",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-secondary text-foreground border-border hover:border-primary/50"
              )}
            >
              {variant.unit}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Select Quantity</p>
      <div className="grid grid-cols-3 gap-2">
        {variants.map((variant) => {
          const isSelected = variant.unit === selectedVariant.unit;
          const discount = variant.originalPrice
            ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
            : 0;

          return (
            <button
              key={variant.unit}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(variant);
              }}
              className={cn(
                "relative p-3 rounded-xl border-2 transition-all text-left",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/50 bg-card"
              )}
            >
              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              )}
              <p className="font-semibold text-sm text-foreground">{variant.unit}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-primary font-bold text-sm">₹{variant.price}</span>
                {variant.originalPrice && (
                  <span className="text-[10px] text-muted-foreground line-through">
                    ₹{variant.originalPrice}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="text-[9px] font-medium text-offer mt-0.5 block">
                  {discount}% OFF
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuantitySelector;
