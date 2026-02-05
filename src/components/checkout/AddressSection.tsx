 import React from 'react';
 import { MapPin, Plus, Check } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { cn } from '@/lib/utils';
 
 interface Address {
   id: string;
   label: string;
   full_address: string;
   city: string | null;
   pincode: string | null;
   is_default: boolean | null;
 }
 
 interface AddressSectionProps {
   addresses: Address[];
   selectedAddress: string;
   onSelectAddress: (id: string) => void;
   onManageAddresses: () => void;
   isLoading: boolean;
 }
 
 const AddressSection: React.FC<AddressSectionProps> = ({
   addresses,
   selectedAddress,
   onSelectAddress,
   onManageAddresses,
   isLoading,
 }) => {
   return (
     <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
       <div className="flex items-center justify-between mb-3">
         <h2 className="font-semibold text-foreground flex items-center gap-2">
           <MapPin className="w-5 h-5 text-primary" />
           Delivery Address
         </h2>
         <button 
           onClick={onManageAddresses}
           className="text-primary text-sm font-medium flex items-center gap-1"
         >
           <Plus className="w-4 h-4" />
           {addresses.length > 0 ? 'Manage' : 'Add'}
         </button>
       </div>
       
       {isLoading ? (
         <div className="py-4 text-center">
           <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
         </div>
       ) : addresses.length === 0 ? (
         <div className="py-4 text-center">
           <p className="text-muted-foreground text-sm mb-3">No saved addresses</p>
           <Button variant="outline" size="sm" onClick={onManageAddresses}>
             <Plus className="w-4 h-4 mr-2" />
             Add Address
           </Button>
         </div>
       ) : (
         <div className="space-y-3">
           {addresses.map((address) => (
             <button
               key={address.id}
               onClick={() => onSelectAddress(address.id)}
               className={cn(
                 "w-full p-3 rounded-xl border-2 text-left transition-all",
                 selectedAddress === address.id
                   ? "border-primary bg-primary/5"
                   : "border-border hover:border-primary/30"
               )}
             >
               <div className="flex items-start gap-3">
                 <div className={cn(
                   "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                   selectedAddress === address.id
                     ? "border-primary bg-primary"
                     : "border-muted-foreground"
                 )}>
                   {selectedAddress === address.id && (
                     <Check className="w-3 h-3 text-primary-foreground" />
                   )}
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2">
                     <span className="font-medium text-foreground">{address.label}</span>
                     {address.is_default && (
                       <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                         Default
                       </span>
                     )}
                   </div>
                   <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                     {address.full_address}
                   </p>
                 </div>
               </div>
             </button>
           ))}
         </div>
       )}
     </div>
   );
 };
 
 export default AddressSection;