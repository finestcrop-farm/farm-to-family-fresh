import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Users, ShoppingBag, TrendingUp,
  RefreshCw, Eye, CheckCircle, XCircle, Truck, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  delivery_address: string;
  payment_method: string;
  payment_status: string;
}

interface Subscription {
  id: string;
  product_name: string;
  quantity: number;
  frequency: string;
  status: string;
  next_delivery: string | null;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions'>('orders');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all orders (admin has access to all)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch all subscriptions
      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (subsError) throw subsError;
      setSubscriptions(subsData || []);

      // Calculate stats
      const totalOrders = ordersData?.length || 0;
      const pendingOrders = ordersData?.filter(o => o.status === 'pending').length || 0;
      const activeSubscriptions = subsData?.filter(s => s.status === 'active').length || 0;
      const totalRevenue = ordersData?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

      setStats({
        totalOrders,
        pendingOrders,
        activeSubscriptions,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Order status updated to ${status}`);
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-purple-100 text-purple-700';
      case 'out_for_delivery': return 'bg-cyan-100 text-cyan-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground sticky top-0 z-50">
        <div className="flex items-center gap-4 px-4 py-4 safe-area-top">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-heading text-xl font-bold">Admin Dashboard</h1>
            <p className="text-sm opacity-80">Manage orders & subscriptions</p>
          </div>
          <button 
            onClick={fetchData}
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      <main className="px-4 py-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-primary' },
            { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: 'text-amber-500' },
            { label: 'Subscriptions', value: stats.activeSubscriptions, icon: RefreshCw, color: 'text-purple-500' },
            { label: 'Revenue', value: `₹${stats.totalRevenue.toFixed(0)}`, icon: TrendingUp, color: 'text-green-500' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-card rounded-xl shadow-card border border-border">
              <stat.icon className={cn("w-5 h-5 mb-2", stat.color)} />
              <p className="font-bold text-xl text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-muted p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors",
              activeTab === 'orders'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors",
              activeTab === 'subscriptions'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Subscriptions
          </button>
        </div>

        {/* Content */}
        {activeTab === 'orders' ? (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-card rounded-xl p-4 shadow-card border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono font-semibold text-foreground">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(order.status))}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-3">
                    <p className="line-clamp-1">{order.delivery_address}</p>
                    <p className="mt-1">
                      <span className="font-medium text-foreground">₹{order.total_amount}</span>
                      {' • '}
                      {order.payment_method.toUpperCase()}
                      {' • '}
                      <span className={order.payment_status === 'completed' ? 'text-green-600' : 'text-amber-600'}>
                        {order.payment_status}
                      </span>
                    </p>
                  </div>

                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <Button size="sm" className="flex-1" onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                      )}
                      {order.status === 'confirmed' && (
                        <Button size="sm" className="flex-1" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                          Preparing
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button size="sm" className="flex-1" onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}>
                          <Truck className="w-4 h-4 mr-1" />
                          Out for Delivery
                        </Button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <Button size="sm" className="flex-1" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Delivered
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive border-destructive/30"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.length === 0 ? (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No subscriptions yet</p>
              </div>
            ) : (
              subscriptions.map((sub) => (
                <div key={sub.id} className="bg-card rounded-xl p-4 shadow-card border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{sub.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {sub.quantity} • {sub.frequency}
                      </p>
                      {sub.next_delivery && (
                        <p className="text-xs text-primary mt-1">
                          Next: {new Date(sub.next_delivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(sub.status))}>
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
