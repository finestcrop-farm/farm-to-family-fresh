 import React from 'react';
 
 interface OrderSummarySectionProps {
   cartTotal: number;
   deliveryFee: number;
   discount: number;
   finalTotal: number;
 }
 
 const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
   cartTotal,
   deliveryFee,
   discount,
   finalTotal,
 }) => {
   return (
     <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
       <h2 className="font-semibold text-foreground mb-3">Order Summary</h2>
       
       <div className="space-y-2 text-sm">
         <div className="flex justify-between">
           <span className="text-muted-foreground">Item Total</span>
           <span className="text-foreground">₹{cartTotal.toFixed(2)}</span>
         </div>
         <div className="flex justify-between">
           <span className="text-muted-foreground">Delivery Fee</span>
           <span className={deliveryFee === 0 ? "text-primary font-medium" : "text-foreground"}>
             {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
           </span>
         </div>
         {discount > 0 && (
           <div className="flex justify-between text-primary">
             <span>Coupon Discount</span>
             <span>-₹{discount}</span>
           </div>
         )}
         <div className="border-t border-border pt-2 mt-2">
           <div className="flex justify-between font-semibold text-base">
             <span className="text-foreground">Total</span>
             <span className="text-foreground">₹{finalTotal.toFixed(2)}</span>
           </div>
         </div>
       </div>
     </div>
   );
 };
 
 export default OrderSummarySection;