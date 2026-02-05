 import React from 'react';
 import { Clock } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 export interface DeliverySlot {
   id: string;
   label: string;
   time: string;
   price: number;
   badge?: string;
 }
 
 interface DeliverySlotSectionProps {
   slots: DeliverySlot[];
   selectedSlot: string;
   onSelectSlot: (id: string) => void;
 }
 
 const DeliverySlotSection: React.FC<DeliverySlotSectionProps> = ({
   slots,
   selectedSlot,
   onSelectSlot,
 }) => {
   return (
     <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
       <h2 className="font-semibold text-foreground flex items-center gap-2 mb-3">
         <Clock className="w-5 h-5 text-primary" />
         Delivery Slot
       </h2>
       
       <div className="grid grid-cols-3 gap-2">
         {slots.map((slot) => (
           <button
             key={slot.id}
             onClick={() => onSelectSlot(slot.id)}
             className={cn(
               "p-3 rounded-xl border-2 text-center transition-all relative",
               selectedSlot === slot.id
                 ? "border-primary bg-primary/5"
                 : "border-border hover:border-primary/30"
             )}
           >
             {slot.badge && (
               <span className={cn(
                 "absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full",
                 slot.badge === 'Fastest' ? "bg-amber-500 text-white" : "bg-primary text-primary-foreground"
               )}>
                 {slot.badge}
               </span>
             )}
             <p className="font-medium text-foreground text-sm">{slot.label}</p>
             <p className="text-xs text-muted-foreground mt-1">{slot.time}</p>
             <p className={cn(
               "text-xs font-semibold mt-1",
               slot.price === 0 ? "text-primary" : "text-foreground"
             )}>
               {slot.price === 0 ? 'FREE' : `₹${slot.price}`}
             </p>
           </button>
         ))}
       </div>
     </div>
   );
 };
 
 export default DeliverySlotSection;