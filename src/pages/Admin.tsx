import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Users, ShoppingBag,
  RefreshCw, CheckCircle, XCircle, Truck,
  MessageSquare, Megaphone, History, ClipboardList,
  Settings, FileText, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Admin Components
import ProductsManager from '@/components/admin/ProductsManager';
import DocumentUpload from '@/components/admin/DocumentUpload';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminSettings from '@/components/admin/AdminSettings';
import PromoNotifications from '@/components/admin/PromoNotifications';
import PromoHistoryList from '@/components/admin/PromoHistoryList';
import AuditLogList from '@/components/admin/AuditLogList';

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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

type TabType = 'dashboard' | 'products' | 'orders' | 'subscriptions' | 'messages' | 'users' | 'documents' | 'notifications' | 'history' | 'audit' | 'settings';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setOrders(ordersData || []);

      const { data: subsData } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setSubscriptions(subsData || []);

      const { data: messagesData } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setMessages(messagesData || []);

      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      setUsers(usersData || []);

      const totalOrders = ordersData?.length || 0;
      const pendingOrders = ordersData?.filter(o => o.status === 'pending').length || 0;
      const activeSubscriptions = subsData?.filter(s => s.status === 'active').length || 0;
      const totalRevenue = ordersData?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
      const totalUsers = usersData?.length || 0;
      const pendingMessages = messagesData?.filter(m => m.status === 'pending').length || 0;

      setStats({
        totalOrders,
        pendingOrders,
        activeSubscriptions,
        totalRevenue,
        totalUsers,
        pendingMessages,
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

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);

      if (error) throw error;
      toast.success('Message status updated');
      fetchData();
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin && !isDevAdmin) {
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
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: stats.pendingOrders },
    { id: 'subscriptions', label: 'Subs', icon: RefreshCw },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: stats.pendingMessages },
    { id: 'documents', label: 'Docs', icon: FileText },
    { id: 'notifications', label: 'Promo', icon: Megaphone },
    { id: 'history', label: 'Promo Log', icon: History },
    { id: 'audit', label: 'Audit', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

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
            <p className="text-sm opacity-80">Full Store Management</p>
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
        {/* Tabs - Scrollable */}
        <div className="flex gap-1 bg-muted p-1 rounded-xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-2 px-3 rounded-lg font-medium text-xs transition-colors flex items-center gap-1 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-destructive text-destructive-foreground text-[10px] px-1.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && <AdminAnalytics />}

        {/* Products Tab */}
        {activeTab === 'products' && <ProductsManager />}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
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
                          Dispatch
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
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
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

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No users yet</p>
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="bg-card rounded-xl p-4 shadow-card border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {user.full_name || 'No name'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.phone || 'No phone'}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-card rounded-xl p-4 shadow-card border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{msg.name}</p>
                      <p className="text-xs text-muted-foreground">{msg.email}</p>
                    </div>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(msg.status))}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="font-medium text-sm text-foreground">{msg.subject}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{msg.message}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                    {msg.status === 'pending' && (
                      <Button size="sm" onClick={() => updateMessageStatus(msg.id, 'resolved')}>
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && <DocumentUpload />}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <PromoNotifications totalUsers={stats.totalUsers} onRefresh={fetchData} />
        )}

        {/* Promo History Tab */}
        {activeTab === 'history' && <PromoHistoryList />}

        {/* Audit Log Tab */}
        {activeTab === 'audit' && <AuditLogList />}

        {/* Settings Tab */}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};

export default Admin;
