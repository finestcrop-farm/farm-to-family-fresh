import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ShoppingBag, Users, Package, IndianRupee, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalUsers: number;
  activeSubscriptions: number;
  todayOrders: number;
  weekOrders: number;
}

const AdminAnalytics: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
    todayOrders: 0,
    weekOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch orders
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        // Fetch users
        const { data: users } = await supabase
          .from('profiles')
          .select('id');

        // Fetch subscriptions
        const { data: subs } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('status', 'active');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const todayOrders = orders?.filter(o => new Date(o.created_at) >= today).length || 0;
        const weekOrders = orders?.filter(o => new Date(o.created_at) >= weekAgo).length || 0;

        setStats({
          totalOrders: orders?.length || 0,
          pendingOrders: orders?.filter(o => o.status === 'pending').length || 0,
          completedOrders: orders?.filter(o => o.status === 'delivered').length || 0,
          totalRevenue: orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0,
          totalUsers: users?.length || 0,
          activeSubscriptions: subs?.length || 0,
          todayOrders,
          weekOrders,
        });

        setRecentOrders((orders || []).slice(0, 5));
      } catch (error) {
        console.error('Analytics error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 1000).toFixed(1)}k`,
      icon: IndianRupee,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: Package,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl p-4 border border-border"
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", stat.bgColor)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-card rounded-lg p-3 border border-border text-center">
          <p className="text-lg font-bold text-foreground">{stats.todayOrders}</p>
          <p className="text-[10px] text-muted-foreground">Today's Orders</p>
        </div>
        <div className="bg-card rounded-lg p-3 border border-border text-center">
          <p className="text-lg font-bold text-foreground">{stats.weekOrders}</p>
          <p className="text-[10px] text-muted-foreground">This Week</p>
        </div>
        <div className="bg-card rounded-lg p-3 border border-border text-center">
          <p className="text-lg font-bold text-amber-500">{stats.pendingOrders}</p>
          <p className="text-[10px] text-muted-foreground">Pending</p>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="font-semibold mb-3">Order Status</h3>
        <div className="space-y-2">
          {[
            { label: 'Pending', count: stats.pendingOrders, color: 'bg-amber-500' },
            { label: 'Completed', count: stats.completedOrders, color: 'bg-green-500' },
            { label: 'Total', count: stats.totalOrders, color: 'bg-blue-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full", item.color)} />
              <span className="flex-1 text-sm text-muted-foreground">{item.label}</span>
              <span className="font-medium">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="font-semibold mb-3">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">₹{order.total_amount}</p>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded",
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
