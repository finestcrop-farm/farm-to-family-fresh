 import React from 'react';
 import { Tag, Gift, Info } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 
 interface CouponSectionProps {
   couponCode: string;
   onCouponChange: (code: string) => void;
   appliedCoupon: string | null;
   discount: number;
   onApplyCoupon: () => void;
   onRemoveCoupon: () => void;
 }
 
 const CouponSection: React.FC<CouponSectionProps> = ({
   couponCode,
   onCouponChange,
   appliedCoupon,
   discount,
   onApplyCoupon,
   onRemoveCoupon,
 }) => {
   return (
     <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
       <h2 className="font-semibold text-foreground flex items-center gap-2 mb-3">
         <Tag className="w-5 h-5 text-primary" />
         Apply Coupon
       </h2>
       
       {appliedCoupon ? (
         <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/20">
           <div className="flex items-center gap-2">
             <Gift className="w-5 h-5 text-primary" />
             <span className="font-medium text-primary">{appliedCoupon}</span>
             <span className="text-sm text-muted-foreground">- ₹{discount} off</span>
           </div>
           <button 
             onClick={onRemoveCoupon}
             className="text-sm text-destructive font-medium"
           >
             Remove
           </button>
         </div>
       ) : (
         <div className="flex gap-2">
           <input
             type="text"
             value={couponCode}
             onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
             placeholder="Enter coupon code"
             className="flex-1 px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
           />
           <Button onClick={onApplyCoupon} variant="outline" className="px-6">
             Apply
           </Button>
         </div>
       )}
       
       <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
         <Info className="w-3 h-3" />
         Try: FRESH50 for ₹50 off
       </p>
     </div>
   );
 };
 
 export default CouponSection;