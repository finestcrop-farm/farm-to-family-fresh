 import React, { useState, useEffect, useCallback } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { ArrowLeft, ChevronRight, Shield } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { useApp } from '@/contexts/AppContext';
 import { useAuth } from '@/contexts/AuthContext';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from 'sonner';
 import AddressSection from '@/components/checkout/AddressSection';
 import DeliverySlotSection, { DeliverySlot } from '@/components/checkout/DeliverySlotSection';
 import CouponSection from '@/components/checkout/CouponSection';
 import PaymentMethodSection, { PaymentMethod } from '@/components/checkout/PaymentMethodSection';
 import OrderSummarySection from '@/components/checkout/OrderSummarySection';
 
 interface Address {
   id: string;
   label: string;
   full_address: string;
   city: string | null;
   pincode: string | null;
   is_default: boolean | null;
 }
 
 declare global {
   interface Window {
     Razorpay: any;
   }
 }
 
 const Checkout: React.FC = () => {
   const navigate = useNavigate();
   const { cart, cartTotal, clearCart } = useApp();
   const { user } = useAuth();
   const [addresses, setAddresses] = useState<Address[]>([]);
   const [selectedAddress, setSelectedAddress] = useState<string>('');
   const [selectedSlot, setSelectedSlot] = useState('2');
   const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('razorpay');
   const [couponCode, setCouponCode] = useState('');
   const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);
   const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
   const [razorpayLoaded, setRazorpayLoaded] = useState(false);
 
   const deliverySlots: DeliverySlot[] = [
     { id: '1', label: 'Express', time: '30-45 mins', price: 29, badge: 'Fastest' },
     { id: '2', label: 'Standard', time: '2-3 hours', price: 0, badge: 'Free' },
     { id: '3', label: 'Scheduled', time: 'Tomorrow 9-11 AM', price: 0 },
   ];
 
   const deliveryFee = deliverySlots.find(s => s.id === selectedSlot)?.price || 0;
   const discount = appliedCoupon ? 50 : 0;
   const finalTotal = cartTotal + deliveryFee - discount;
 
   // Load Razorpay SDK
   useEffect(() => {
     const script = document.createElement('script');
     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
     script.async = true;
     script.onload = () => setRazorpayLoaded(true);
     document.body.appendChild(script);
     
     return () => {
       if (document.body.contains(script)) {
         document.body.removeChild(script);
       }
     };
   }, []);
 
   useEffect(() => {
     const fetchAddresses = async () => {
       if (!user) {
         setIsLoadingAddresses(false);
         return;
       }
 
       try {
         const { data, error } = await supabase
           .from('addresses')
           .select('*')
           .eq('user_id', user.id)
           .order('is_default', { ascending: false });
 
         if (error) throw error;
         setAddresses(data || []);
         
         const defaultAddr = data?.find(a => a.is_default) || data?.[0];
         if (defaultAddr) {
           setSelectedAddress(defaultAddr.id);
         }
       } catch (error) {
         console.error('Error fetching addresses:', error);
       } finally {
         setIsLoadingAddresses(false);
       }
     };
 
     fetchAddresses();
   }, [user]);
 
   const handleApplyCoupon = useCallback(() => {
     if (couponCode.toUpperCase() === 'FRESH50') {
       setAppliedCoupon('FRESH50');
       toast.success('Coupon applied! ₹50 off');
     } else {
       toast.error('Invalid coupon code');
     }
   }, [couponCode]);
 
   const handleRemoveCoupon = useCallback(() => {
     setAppliedCoupon(null);
     setCouponCode('');
   }, []);
 
   const createDatabaseOrder = async (paymentMethod: string, paymentStatus: string) => {
     const selectedAddr = addresses.find(a => a.id === selectedAddress);
     
     const { data: order, error: orderError } = await supabase
       .from('orders')
       .insert({
         user_id: user!.id,
         total_amount: finalTotal,
         delivery_address: selectedAddr ? `${selectedAddr.label}: ${selectedAddr.full_address}` : 'Guest checkout',
         payment_method: paymentMethod,
         payment_status: paymentStatus,
         delivery_slot: deliverySlots.find(s => s.id === selectedSlot)?.time || null,
         order_number: '',
         estimated_delivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
       })
       .select()
       .single();
 
     if (orderError) throw orderError;
 
     const orderItems = cart.map(item => ({
       order_id: order.id,
       product_id: item.product.id,
       product_name: item.product.name,
       quantity: item.quantity,
       price: item.selectedVariant?.price || item.product.price,
     }));
 
     const { error: itemsError } = await supabase
       .from('order_items')
       .insert(orderItems);
 
     if (itemsError) throw itemsError;
 
     return order;
   };
 
   const handleRazorpayPayment = async () => {
     if (!razorpayLoaded) {
       toast.error('Payment gateway is loading. Please try again.');
       return;
     }
 
     setIsProcessing(true);
 
     try {
       const { data: razorpayOrder, error: razorpayError } = await supabase.functions.invoke('create-razorpay-order', {
         body: {
           amount: finalTotal,
           currency: 'INR',
           receipt: `order_${Date.now()}`,
         }
       });
 
       if (razorpayError || !razorpayOrder?.orderId) {
         toast.error('Online payment not available. Proceeding with Cash on Delivery.');
         await handleCODPayment();
         return;
       }
 
       const dbOrder = await createDatabaseOrder('razorpay', 'pending');
 
       const options = {
         key: razorpayOrder.keyId,
         amount: razorpayOrder.amount,
         currency: razorpayOrder.currency,
         name: 'Farm to Family',
         description: 'Fresh Grocery Order',
         order_id: razorpayOrder.orderId,
         handler: async (response: any) => {
           const { data: verifyResult } = await supabase.functions.invoke('verify-razorpay-payment', {
             body: {
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature,
               order_id: dbOrder.id,
             }
           });
 
           if (verifyResult?.verified) {
             clearCart();
             toast.success('Payment successful!');
             navigate('/order-confirmation');
           } else {
             toast.error('Payment verification failed. Please contact support.');
           }
         },
         prefill: {
           name: user?.user_metadata?.full_name || '',
           email: user?.email || '',
           contact: user?.phone || '',
         },
         theme: {
           color: '#22c55e',
         },
         modal: {
           ondismiss: () => {
             setIsProcessing(false);
             toast.error('Payment cancelled');
           }
         }
       };
 
       const razorpay = new window.Razorpay(options);
       razorpay.open();
     } catch (error) {
       console.error('Error processing payment:', error);
       toast.error('Failed to process payment. Please try again.');
       setIsProcessing(false);
     }
   };
 
   const handleCODPayment = async () => {
     setIsProcessing(true);
     
     try {
       await createDatabaseOrder('cod', 'pending');
       
       try {
         const selectedSlotData = deliverySlots.find(s => s.id === selectedSlot);
         await supabase.functions.invoke('send-order-sms', {
           body: {
             to: user?.phone || '',
             orderNumber: 'Your order',
             type: 'confirmation',
             amount: finalTotal,
             estimatedTime: selectedSlotData?.time || '45 minutes',
           }
         });
       } catch (smsError) {
         console.log('SMS notification failed:', smsError);
       }
       
       clearCart();
       toast.success('Order placed successfully!');
       navigate('/order-confirmation');
     } catch (error) {
       console.error('Error creating order:', error);
       toast.error('Failed to place order. Please try again.');
     } finally {
       setIsProcessing(false);
     }
   };
 
   const handlePayment = async () => {
     const selectedAddr = addresses.find(a => a.id === selectedAddress);
     if (!selectedAddr && user) {
       toast.error('Please select a delivery address');
       return;
     }
 
     if (!user) {
       toast.error('Please login to place order');
       navigate('/login');
       return;
     }
 
     if (cart.length === 0) {
       toast.error('Your cart is empty');
       return;
     }
 
     if (selectedPayment === 'razorpay') {
       await handleRazorpayPayment();
     } else {
       await handleCODPayment();
     }
   };
 
   return (
     <div className="min-h-screen bg-muted/30 pb-32">
       {/* Header */}
       <div className="bg-background sticky top-0 z-50 border-b border-border">
         <div className="flex items-center gap-4 px-4 py-4">
           <button 
             onClick={() => navigate(-1)}
             className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
           >
             <ArrowLeft className="w-5 h-5 text-foreground" />
           </button>
           <div>
             <h1 className="font-heading text-lg font-bold text-foreground">Checkout</h1>
             <p className="text-sm text-muted-foreground">{cart.length} items in cart</p>
           </div>
         </div>
       </div>
 
       <div className="p-4 space-y-4">
         <AddressSection
           addresses={addresses}
           selectedAddress={selectedAddress}
           onSelectAddress={setSelectedAddress}
           onManageAddresses={() => navigate('/addresses')}
           isLoading={isLoadingAddresses}
         />
 
         <DeliverySlotSection
           slots={deliverySlots}
           selectedSlot={selectedSlot}
           onSelectSlot={setSelectedSlot}
         />
 
         <CouponSection
           couponCode={couponCode}
           onCouponChange={setCouponCode}
           appliedCoupon={appliedCoupon}
           discount={discount}
           onApplyCoupon={handleApplyCoupon}
           onRemoveCoupon={handleRemoveCoupon}
         />
 
         <PaymentMethodSection
           selectedPayment={selectedPayment}
           onSelectPayment={setSelectedPayment}
         />
 
         <OrderSummarySection
           cartTotal={cartTotal}
           deliveryFee={deliveryFee}
           discount={discount}
           finalTotal={finalTotal}
         />
       </div>
 
       {/* Sticky Footer */}
       <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-area-bottom">
         <div className="flex items-center justify-between mb-3">
           <div>
             <p className="text-sm text-muted-foreground">Total Amount</p>
             <p className="text-xl font-bold text-foreground">₹{finalTotal.toFixed(2)}</p>
           </div>
           <div className="flex items-center gap-1 text-xs text-muted-foreground">
             <Shield className="w-4 h-4 text-primary" />
             100% Secure
           </div>
         </div>
         <Button 
           variant="hero" 
           size="xl" 
           className="w-full"
           onClick={handlePayment}
           disabled={isProcessing || cart.length === 0}
         >
           {isProcessing ? (
             <div className="flex items-center gap-2">
               <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
               Processing...
             </div>
           ) : (
             <>
               {selectedPayment === 'razorpay' ? 'Pay' : 'Place Order'} ₹{finalTotal.toFixed(2)}
               <ChevronRight className="w-5 h-5 ml-1" />
             </>
           )}
         </Button>
       </div>
     </div>
   );
 };
 
 export default Checkout;