import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Package, Truck, MapPin, Clock, Phone, 
  Share2, Download, Home, ChevronRight, Star, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Confetti from '@/components/Confetti';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  const orderId = 'OPN' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const estimatedDelivery = '30-45 mins';

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const orderSteps = [
    { label: 'Order Placed', time: 'Just now', completed: true, current: true },
    { label: 'Preparing', time: '', completed: false, current: false },
    { label: 'Out for Delivery', time: '', completed: false, current: false },
    { label: 'Delivered', time: '', completed: false, current: false },
  ];

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {showConfetti && <Confetti />}
      
      {/* Success Header */}
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-20 text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary-foreground/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-primary-foreground/5 rounded-full" />
        
        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary-foreground/20 flex items-center justify-center animate-bounce-slow">
            <CheckCircle2 className="w-14 h-14 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-primary-foreground/80">
            Thank you for shopping with us
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
            <Package className="w-4 h-4" />
            <span className="font-mono font-semibold">{orderId}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-8 relative z-10 pb-8 space-y-4">
        {/* Delivery Card */}
        <div className="bg-card rounded-2xl p-5 shadow-elevated border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="font-heading text-xl font-bold text-foreground">{estimatedDelivery}</p>
            </div>
          </div>

          {/* Order Progress */}
          <div className="relative">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
            <div className="space-y-4">
              {orderSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 relative">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center z-10",
                    step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-current" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className={cn(
                      "font-medium",
                      step.current ? "text-primary" : step.completed ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </p>
                    {step.time && (
                      <p className="text-sm text-muted-foreground">{step.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => navigate('/order-tracking')}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Track Live
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        </div>

        {/* Delivery Address */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-primary" />
            Delivery Address
          </h3>
          <p className="text-sm text-muted-foreground">
            123, Green Valley Apartments, Jubilee Hills, Hyderabad - 500033
          </p>
        </div>

        {/* Contact Support */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <h3 className="font-semibold text-foreground mb-3">Need Help?</h3>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share Order
            </Button>
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Gift className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">You earned 25 points!</p>
              <p className="text-sm text-muted-foreground">Collect more to unlock rewards</p>
            </div>
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <Button 
            variant="hero" 
            size="xl" 
            className="w-full"
            onClick={() => navigate('/order-tracking')}
          >
            Track Order
            <MapPin className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
