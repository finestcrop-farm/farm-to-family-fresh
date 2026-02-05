 import React from 'react';
 import { CreditCard, Smartphone, Building2, Wallet, Truck, Check } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import { LucideIcon } from 'lucide-react';
 
 export type PaymentMethod = 'razorpay' | 'cod';
 
 interface PaymentMethodOption {
   id: PaymentMethod;
   label: string;
   icon: LucideIcon;
   description: string;
   badge?: string;
 }
 
 interface PaymentMethodSectionProps {
   selectedPayment: PaymentMethod;
   onSelectPayment: (method: PaymentMethod) => void;
 }
 
 const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
   selectedPayment,
   onSelectPayment,
 }) => {
   const paymentMethods: PaymentMethodOption[] = [
     { 
       id: 'razorpay', 
       label: 'Pay Online', 
       icon: CreditCard, 
       description: 'UPI, Cards, Net Banking, Wallets',
       badge: 'Recommended'
     },
     { 
       id: 'cod', 
       label: 'Cash on Delivery', 
       icon: Truck, 
       description: 'Pay when delivered' 
     },
   ];
 
   return (
     <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
       <h2 className="font-semibold text-foreground flex items-center gap-2 mb-3">
         <CreditCard className="w-5 h-5 text-primary" />
         Payment Method
       </h2>
       
       <div className="space-y-2">
         {paymentMethods.map((method) => (
           <button
             key={method.id}
             onClick={() => onSelectPayment(method.id)}
             className={cn(
               "w-full p-3 rounded-xl border-2 text-left transition-all",
               selectedPayment === method.id
                 ? "border-primary bg-primary/5"
                 : "border-border hover:border-primary/30"
             )}
           >
             <div className="flex items-center gap-3">
               <div className={cn(
                 "w-10 h-10 rounded-lg flex items-center justify-center",
                 selectedPayment === method.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
               )}>
                 <method.icon className="w-5 h-5" />
               </div>
               <div className="flex-1">
                 <div className="flex items-center gap-2">
                   <p className="font-medium text-foreground">{method.label}</p>
                   {method.badge && (
                     <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-semibold">
                       {method.badge}
                     </span>
                   )}
                 </div>
                 <p className="text-xs text-muted-foreground">{method.description}</p>
               </div>
               <div className={cn(
                 "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                 selectedPayment === method.id
                   ? "border-primary bg-primary"
                   : "border-muted-foreground"
               )}>
                 {selectedPayment === method.id && (
                   <Check className="w-3 h-3 text-primary-foreground" />
                 )}
               </div>
             </div>
           </button>
         ))}
       </div>
     </div>
   );
 };
 
 export default PaymentMethodSection;