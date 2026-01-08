import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, BellOff, Package, Truck, Tag, Gift, 
  MessageCircle, Settings, Check, Trash2, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNotifications, type AppNotification } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead: markAllAsReadDb,
    deleteNotification: deleteNotificationDb,
    clearAll: clearAllDb,
  } = useNotifications();

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order': return Package;
      case 'delivery': return Truck;
      case 'offer': return Tag;
      case 'reward': return Gift;
      case 'message': return MessageCircle;
    }
  };

  const getIconColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'order': return 'bg-blue-500/10 text-blue-500';
      case 'delivery': return 'bg-primary/10 text-primary';
      case 'offer': return 'bg-amber-500/10 text-amber-500';
      case 'reward': return 'bg-purple-500/10 text-purple-500';
      case 'message': return 'bg-slate-500/10 text-slate-500';
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadDb();
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotificationDb(id);
    toast.success('Notification deleted');
  };

  const handleClearAll = async () => {
    await clearAllDb();
    toast.success('All notifications cleared');
  };

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        setShowPermissionPrompt(false);
        toast.success('Notifications enabled!');
        
        // Show a test notification
        new Notification('OurPureNaturals', {
          body: 'You will now receive order updates and offers!',
          icon: '/pwa-192x192.png',
        });
      } else {
        toast.error('Please enable notifications in your browser settings');
      }
    }
  };

  // Get action URL from notification data
  const getActionUrl = (notification: AppNotification): string | undefined => {
    const data = notification.data as Record<string, unknown> | undefined;
    return data?.actionUrl as string | undefined;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center p-6">
          <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold mb-2">Login to see notifications</h2>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-8">
      {/* Header */}
      <div className="bg-background sticky top-0 z-50 border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Check className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={() => navigate('/notification-settings')}
              className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Permission Prompt */}
      {showPermissionPrompt && (
        <div className="mx-4 mt-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Enable Push Notifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get instant updates on orders, deliveries, and exclusive offers
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleEnableNotifications}>
                  Enable
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowPermissionPrompt(false)}>
                  Not Now
                </Button>
              </div>
            </div>
            <button 
              onClick={() => setShowPermissionPrompt(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <BellOff className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => {
              const actionUrl = getActionUrl(notification);
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "bg-background rounded-xl p-4 border transition-all",
                    notification.read 
                      ? "border-border" 
                      : "border-primary/30 bg-primary/5"
                  )}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (actionUrl) {
                      navigate(actionUrl);
                    }
                  }}
                >
                  <div className="flex gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      getIconColor(notification.type)
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={cn(
                          "font-medium text-foreground",
                          !notification.read && "font-semibold"
                        )}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {!notification.read && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              );
            })}

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="w-full py-3 text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear All Notifications
              </button>
            )}
          </>
        )}
      </div>

      {/* Enable Notifications CTA */}
      {!notificationsEnabled && !showPermissionPrompt && (
        <div className="fixed bottom-6 left-4 right-4">
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full"
            onClick={() => setShowPermissionPrompt(true)}
          >
            <Bell className="w-5 h-5 mr-2" />
            Enable Push Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
