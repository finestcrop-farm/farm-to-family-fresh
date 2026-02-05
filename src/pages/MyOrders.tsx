 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 import { 
   ArrowLeft, Package, Clock, CheckCircle, Truck, 
   XCircle, MapPin, ChevronRight, RefreshCw, ShoppingBag,
   RotateCcw, X, AlertCircle
 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, Order } from '@/hooks/useOrders';
 import { cn } from '@/lib/utils';
 import { useApp } from '@/contexts/AppContext';
 import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
 } from "@/components/ui/alert-dialog";
 import { toast } from 'sonner';

 const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
   const { orders, isLoading, refetch, cancelOrder, reorder } = useOrders();
   const { addToCart } = useApp();
   const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
   const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(null);
 
   const handleCancelOrder = async (orderId: string) => {
     setCancellingOrderId(orderId);
     await cancelOrder(orderId);
     setCancellingOrderId(null);
   };
 
   const handleReorder = async (orderId: string) => {
     setReorderingOrderId(orderId);
     const items = await reorder(orderId);
     if (items && items.length > 0) {
       // Note: This navigates user to add items manually for now
       // In a full implementation, you'd add items to cart directly
       toast.success(`Found ${items.length} items from your previous order. Redirecting to cart...`);
       navigate('/');
     }
     setReorderingOrderId(null);
   };
 
   const canCancelOrder = (status: string) => {
     return ['pending', 'confirmed', 'preparing'].includes(status);
   };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          icon: Clock, 
          color: 'text-amber-600 bg-amber-100', 
          label: 'Order Placed',
          progress: 25 
        };
      case 'confirmed':
        return { 
          icon: CheckCircle, 
          color: 'text-blue-600 bg-blue-100', 
          label: 'Confirmed',
          progress: 40 
        };
      case 'preparing':
        return { 
          icon: Package, 
          color: 'text-purple-600 bg-purple-100', 
          label: 'Preparing',
          progress: 60 
        };
      case 'out_for_delivery':
        return { 
          icon: Truck, 
          color: 'text-cyan-600 bg-cyan-100', 
          label: 'Out for Delivery',
          progress: 80 
        };
      case 'delivered':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600 bg-green-100', 
          label: 'Delivered',
          progress: 100 
        };
      case 'cancelled':
        return { 
          icon: XCircle, 
          color: 'text-red-600 bg-red-100', 
          label: 'Cancelled',
          progress: 0 
        };
      default:
        return { 
          icon: Package, 
          color: 'text-gray-600 bg-gray-100', 
          label: status,
          progress: 0 
        };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-gradient-hero text-primary-foreground sticky top-0 z-50 safe-area-top">
          <div className="flex items-center gap-4 px-4 py-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-heading text-xl font-bold">My Orders</h1>
          </div>
        </header>
        
        <main className="px-4 py-12 text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">
            Login to view orders
          </h2>
          <p className="text-muted-foreground mb-6">
            Track your orders and view order history
          </p>
          <Button onClick={() => navigate('/login')}>
            Login / Sign Up
          </Button>
        </main>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground sticky top-0 z-50 safe-area-top">
        <div className="flex items-center gap-4 px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-heading text-xl font-bold">My Orders</h1>
            <p className="text-sm opacity-80">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
          </div>
          <button 
            onClick={() => refetch()}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
          </button>
        </div>
      </header>

      <main className="px-4 py-4">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Your order history will appear here
            </p>
            <Button onClick={() => navigate('/')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              const isActive = !['delivered', 'cancelled'].includes(order.status);
              
              return (
                <div 
                  key={order.id}
                  className="bg-card rounded-2xl shadow-card border border-border overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-mono font-semibold text-foreground">
                          {order.order_number}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
                        statusConfig.color
                      )}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </div>
                    
                    {/* Progress Bar for Active Orders */}
                    {isActive && statusConfig.progress > 0 && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${statusConfig.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Order Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {order.delivery_address}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          ₹{Number(order.total_amount).toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.payment_method.toUpperCase()} • {order.payment_status}
                        </p>
                      </div>
                      
                      {isActive && (
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/order-tracking?orderId=${order.id}`)}
                          className="gap-1"
                        >
                          <Truck className="w-4 h-4" />
                          Track Order
                        </Button>
                      )}
                      
                       {/* Cancel Button for eligible orders */}
                       {canCancelOrder(order.status) && (
                         <AlertDialog>
                           <AlertDialogTrigger asChild>
                             <Button 
                               size="sm"
                               variant="outline"
                               className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                               disabled={cancellingOrderId === order.id}
                             >
                               {cancellingOrderId === order.id ? (
                                 <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                               ) : (
                                 <X className="w-4 h-4" />
                               )}
                               Cancel
                             </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                             <AlertDialogHeader>
                               <AlertDialogTitle className="flex items-center gap-2">
                                 <AlertCircle className="w-5 h-5 text-destructive" />
                                 Cancel Order?
                               </AlertDialogTitle>
                               <AlertDialogDescription>
                                 Are you sure you want to cancel order {order.order_number}? 
                                 This action cannot be undone. Refund (if applicable) will be 
                                 processed within 5-7 business days.
                               </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                               <AlertDialogCancel>Keep Order</AlertDialogCancel>
                               <AlertDialogAction 
                                 onClick={() => handleCancelOrder(order.id)}
                                 className="bg-destructive hover:bg-destructive/90"
                               >
                                 Yes, Cancel Order
                               </AlertDialogAction>
                             </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                       )}
                       
                       {/* Reorder Button for delivered/cancelled orders */}
                       {['delivered', 'cancelled'].includes(order.status) && (
                         <Button 
                           size="sm"
                           variant="outline"
                           onClick={() => handleReorder(order.id)}
                           className="gap-1"
                           disabled={reorderingOrderId === order.id}
                         >
                           {reorderingOrderId === order.id ? (
                             <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                           ) : (
                             <RotateCcw className="w-4 h-4" />
                           )}
                           Reorder
                         </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Estimated Delivery for Active Orders */}
                  {isActive && order.estimated_delivery && (
                    <div className="px-4 py-3 bg-primary/5 border-t border-primary/10">
                      <p className="text-xs text-primary font-medium flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Estimated delivery: {formatDate(order.estimated_delivery)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default MyOrders;
