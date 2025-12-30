import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Clock, Tag, ChevronRight, Shield, 
  CreditCard, Smartphone, Building2, Wallet, Plus, Check,
  Truck, Gift, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface Address {
  id: string;
  label: string;
  fullAddress: string;
  isDefault: boolean;
}

interface DeliverySlot {
  id: string;
  label: string;
  time: string;
  price: number;
  badge?: string;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartTotal } = useApp();
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [selectedSlot, setSelectedSlot] = useState('1');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');

  const addresses: Address[] = [
    { id: '1', label: 'Home', fullAddress: '123, Green Valley Apartments, Jubilee Hills, Hyderabad - 500033', isDefault: true },
    { id: '2', label: 'Office', fullAddress: '456, Tech Park, HITEC City, Hyderabad - 500081', isDefault: false },
  ];

  const deliverySlots: DeliverySlot[] = [
    { id: '1', label: 'Express', time: '30-45 mins', price: 29, badge: 'Fastest' },
    { id: '2', label: 'Standard', time: '2-3 hours', price: 0, badge: 'Free' },
    { id: '3', label: 'Scheduled', time: 'Tomorrow 9-11 AM', price: 0 },
  ];

  const paymentMethods = [
    { id: 'upi' as PaymentMethod, label: 'UPI', icon: Smartphone, description: 'GPay, PhonePe, Paytm & more' },
    { id: 'card' as PaymentMethod, label: 'Card', icon: CreditCard, description: 'Credit/Debit Cards' },
    { id: 'netbanking' as PaymentMethod, label: 'Net Banking', icon: Building2, description: 'All major banks' },
    { id: 'wallet' as PaymentMethod, label: 'Wallet', icon: Wallet, description: 'Paytm, Mobikwik & more' },
    { id: 'cod' as PaymentMethod, label: 'Cash on Delivery', icon: Truck, description: 'Pay when delivered' },
  ];

  const deliveryFee = deliverySlots.find(s => s.id === selectedSlot)?.price || 0;
  const discount = appliedCoupon ? 50 : 0;
  const finalTotal = cartTotal + deliveryFee - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'FRESH50') {
      setAppliedCoupon('FRESH50');
      toast.success('Coupon applied! ₹50 off');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handlePayment = async () => {
    if (selectedPayment === 'upi' && !upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Payment successful!');
    navigate('/order-confirmation');
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
        {/* Delivery Address */}
        <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Delivery Address
            </h2>
            <button className="text-primary text-sm font-medium flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
          
          <div className="space-y-3">
            {addresses.map((address) => (
              <button
                key={address.id}
                onClick={() => setSelectedAddress(address.id)}
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
                      {address.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {address.fullAddress}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Slot */}
        <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-primary" />
            Delivery Slot
          </h2>
          
          <div className="grid grid-cols-3 gap-2">
            {deliverySlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
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

        {/* Coupon */}
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
                onClick={() => {
                  setAppliedCoupon(null);
                  setCouponCode('');
                }}
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
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <Button onClick={handleApplyCoupon} variant="outline" className="px-6">
                Apply
              </Button>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Try: FRESH50 for ₹50 off
          </p>
        </div>

        {/* Payment Method */}
        <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment Method
          </h2>
          
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
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
                    <p className="font-medium text-foreground">{method.label}</p>
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

          {/* UPI Input */}
          {selectedPayment === 'upi' && (
            <div className="mt-4 p-4 bg-muted/50 rounded-xl">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Enter UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <div className="flex gap-2 mt-3">
                {['@ybl', '@paytm', '@okaxis', '@ibl'].map((suffix) => (
                  <button
                    key={suffix}
                    onClick={() => setUpiId(prev => prev.split('@')[0] + suffix)}
                    className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {suffix}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
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
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <>
              Pay ₹{finalTotal.toFixed(2)}
              <ChevronRight className="w-5 h-5 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
