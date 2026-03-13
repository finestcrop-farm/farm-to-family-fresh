import React, { useState, useEffect } from 'react';
import { Bell, History, Megaphone, RefreshCw, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminProxy } from '@/hooks/useAdminProxy';

interface PromoHistory {
  id: string;
  title: string;
  message: string;
  recipient_count: number;
  sent_at: string;
  push_sent: boolean;
  push_success_count: number | null;
  push_failure_count: number | null;
}

interface PromoNotificationsProps {
  totalUsers: number;
  onRefresh?: () => void;
}

const notificationTemplates = [
  {
    id: 'flash-sale',
    icon: '⚡',
    label: 'Flash Sale',
    title: '⚡ Flash Sale Alert!',
    message: 'Limited time offer! Get up to 50% off on selected items. Shop now before stocks run out!',
  },
  {
    id: 'new-arrivals',
    icon: '✨',
    label: 'New Arrivals',
    title: '✨ Fresh Arrivals Just Landed!',
    message: 'Check out our latest collection of fresh produce and grocery essentials. Order now for same-day delivery!',
  },
  {
    id: 'weekend-deal',
    icon: '🎉',
    label: 'Weekend Deal',
    title: '🎉 Weekend Special Deals!',
    message: 'Enjoy exclusive weekend discounts on your favorite products. Valid Saturday & Sunday only!',
  },
  {
    id: 'free-delivery',
    icon: '🚚',
    label: 'Free Delivery',
    title: '🚚 Free Delivery Today!',
    message: 'No minimum order required for free delivery today. Order now and save on delivery charges!',
  },
];

const PromoNotifications: React.FC<PromoNotificationsProps> = ({ totalUsers, onRefresh }) => {
  const { isAdmin } = useAuth();
  const { adminRequest } = useAdminProxy();
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [promoHistory, setPromoHistory] = useState<PromoHistory[]>([]);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const applyTemplate = (template: typeof notificationTemplates[0]) => {
    setNotificationTitle(template.title);
    setNotificationMessage(template.message);
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      if (isAdmin) {
        // Use admin proxy for dev admin to bypass RLS
        const { data, error } = await adminRequest<PromoHistory[]>({
          action: 'select',
          table: 'promotional_notification_history',
          data: {
            order: { column: 'sent_at', ascending: false },
            limit: 50,
          },
        });

        if (error) throw error;
        setPromoHistory(data || []);
      } else {
        // Regular admin uses direct supabase
        const { data, error } = await supabase
          .from('promotional_notification_history')
          .select('*')
          .order('sent_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setPromoHistory((data as PromoHistory[]) || []);
      }
    } catch (error) {
      console.error('Error fetching promo history:', error);
      toast.error('Failed to load notification history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [isAdmin]);

  const sendPromotionalNotification = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    setIsSendingNotification(true);
    try {
      let profiles: { user_id: string }[] = [];

      if (isAdmin) {
        // Use admin proxy for dev admin
        const { data, error } = await adminRequest<{ user_id: string }[]>({
          action: 'select',
          table: 'profiles',
          data: { columns: 'user_id' },
        });

        if (error) throw error;
        profiles = data || [];
      } else {
        // Regular admin uses direct supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id');

        if (error) throw error;
        profiles = data || [];
      }

      if (profiles.length === 0) {
        toast.error('No users found to send notifications');
        return;
      }

      const recipientCount = profiles.length;

      // Insert notifications for each user
      const notifications = profiles.map((profile) => ({
        user_id: profile.user_id,
        title: notificationTitle.trim(),
        message: notificationMessage.trim(),
        type: 'offer',
        read: false,
        data: { sent_by: 'admin', sent_at: new Date().toISOString() },
      }));

      if (isAdmin) {
        // Use admin proxy to insert notifications - insert one by one or batch
        for (const notification of notifications) {
          const { error: insertError } = await adminRequest({
            action: 'insert',
            table: 'notifications',
            data: notification as unknown as Record<string, unknown>,
          });
          if (insertError) {
            console.error('Failed to insert notification:', insertError);
          }
        }
      } else {
        const { error: insertError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (insertError) throw insertError;
      }

      // Send push notifications via edge function
      let pushResult = { pushSent: false, successCount: 0, failureCount: 0 };
      try {
        const response = await supabase.functions.invoke('send-push-notification', {
          body: {
            title: notificationTitle.trim(),
            message: notificationMessage.trim(),
          },
        });
        if (response.data) {
          pushResult = response.data;
        }
      } catch (pushError) {
        console.error('Push notification error:', pushError);
      }

      // Record in history
      const historyEntry = {
        title: notificationTitle.trim(),
        message: notificationMessage.trim(),
        recipient_count: recipientCount,
        push_sent: pushResult.pushSent,
        push_success_count: pushResult.successCount,
        push_failure_count: pushResult.failureCount,
      };

      if (isDevAdmin) {
        const { error: historyError } = await adminRequest({
          action: 'insert',
          table: 'promotional_notification_history',
          data: historyEntry,
        });

        if (historyError) console.error('Failed to save history:', historyError);
      } else {
        await supabase
          .from('promotional_notification_history')
          .insert(historyEntry);
      }

      toast.success(`Notification sent to ${recipientCount} users!`);
      setNotificationTitle('');
      setNotificationMessage('');
      fetchHistory();
      onRefresh?.();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setIsSendingNotification(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Templates */}
      <div className="bg-card rounded-xl p-4 shadow-card border border-border">
        <h3 className="font-semibold text-foreground mb-3">Quick Templates</h3>
        <div className="grid grid-cols-2 gap-2">
          {notificationTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => applyTemplate(template)}
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left border border-transparent hover:border-primary/20"
            >
              <span className="text-xl">{template.icon}</span>
              <span className="text-sm font-medium text-foreground">{template.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Send Notification Form */}
      <div className="bg-card rounded-xl p-4 shadow-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Send Promotional Alert</h3>
            <p className="text-xs text-muted-foreground">Notify all users instantly</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
            <Input
              placeholder="e.g., Flash Sale Today!"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
            <Textarea
              placeholder="e.g., Get 50% off on all vegetables today only!"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>
          <Button 
            className="w-full"
            onClick={sendPromotionalNotification}
            disabled={isSendingNotification || !notificationTitle.trim() || !notificationMessage.trim()}
          >
            {isSendingNotification ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send to All Users ({totalUsers})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Promo History */}
      <div className="bg-card rounded-xl p-4 shadow-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent History
          </h3>
          <Button variant="ghost" size="sm" onClick={fetchHistory} disabled={isLoadingHistory}>
            <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {promoHistory.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No notifications sent yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {promoHistory.slice(0, 5).map((promo) => (
              <div key={promo.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-sm text-foreground truncate flex-1 mr-2">{promo.title}</p>
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full shrink-0">
                    {promo.recipient_count} users
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{promo.message}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{new Date(promo.sent_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    <Bell className="w-3 h-3" />
                    In-app
                  </span>
                  {promo.push_sent && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Send className="w-3 h-3" />
                      Push: {promo.push_success_count || 0}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoNotifications;
