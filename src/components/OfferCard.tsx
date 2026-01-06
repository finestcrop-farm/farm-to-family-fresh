import React from 'react';
import { Copy, Check, ChevronRight } from 'lucide-react';
import { Offer } from '@/data/offers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface OfferCardProps {
  offer: Offer;
  variant?: 'default' | 'compact' | 'banner';
  onApply?: (code: string) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, variant = 'default', onApply }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    toast.success(`Coupon code ${offer.code} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(offer.code);
    } else {
      handleCopy();
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-xl border border-border bg-gradient-to-r",
        offer.color
      )}>
        <span className="text-2xl">{offer.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{offer.title}</p>
          <p className="text-xs text-white/80 truncate">{offer.description}</p>
        </div>
        <button
          onClick={handleApply}
          className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-lg text-xs font-bold text-white hover:bg-white/30 transition-colors"
        >
          {offer.code}
        </button>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r shadow-lg",
        offer.color
      )}>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          {offer.badge && (
            <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-0">
              {offer.badge}
            </Badge>
          )}
          
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{offer.icon}</span>
            <div>
              <h3 className="font-heading text-xl font-bold text-white">{offer.title}</h3>
              <p className="text-white/90 text-sm">{offer.description}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 bg-white/20 backdrop-blur rounded-lg border border-dashed border-white/40">
                <span className="font-mono font-bold text-white tracking-wider">{offer.code}</span>
              </div>
              <button
                onClick={handleCopy}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            
            <button
              onClick={handleApply}
              className="flex items-center gap-1 px-4 py-2 bg-white text-foreground font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Apply
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-xs text-white/70 mt-3">
            Min. order: ₹{offer.minOrder} • Valid till {new Date(offer.validTill).toLocaleDateString('en-IN')}
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
      <div className={cn("p-4 bg-gradient-to-r", offer.color)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{offer.icon}</span>
            <div>
              <h3 className="font-semibold text-white">{offer.title}</h3>
              {offer.badge && (
                <Badge variant="secondary" className="mt-1 bg-white/20 text-white border-0 text-[10px]">
                  {offer.badge}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              {offer.discountType === 'percentage' ? `${offer.discount}%` : `₹${offer.discount}`}
            </p>
            <p className="text-xs text-white/80">OFF</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-muted rounded-lg border border-dashed border-border">
              <span className="font-mono font-semibold text-foreground text-sm">{offer.code}</span>
            </div>
            <button
              onClick={handleCopy}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          
          <button
            onClick={handleApply}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Apply
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">
          Min. order ₹{offer.minOrder} {offer.maxDiscount && `• Max discount ₹${offer.maxDiscount}`}
        </p>
      </div>
    </div>
  );
};

export default OfferCard;
