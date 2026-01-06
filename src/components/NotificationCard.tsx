import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, Tag, Gift, MessageCircle, Bell, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NotificationItem {
  id: string;
  type: 'order' | 'delivery' | 'offer' | 'reward' | 'message' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  image?: string;
}

interface NotificationCardProps {
  notification: NotificationItem;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  variant?: 'default' | 'compact' | 'banner';
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onRead,
  onDelete,
  variant = 'default',
}) => {
  const navigate = useNavigate();

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order': return Package;
      case 'delivery': return Truck;
      case 'offer': return Tag;
      case 'reward': return Gift;
      case 'message': return MessageCircle;
      case 'alert': return Bell;
    }
  };

  const getIconStyle = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order': return 'bg-blue-500/10 text-blue-500';
      case 'delivery': return 'bg-primary/10 text-primary';
      case 'offer': return 'bg-amber-500/10 text-amber-500';
      case 'reward': return 'bg-purple-500/10 text-purple-500';
      case 'message': return 'bg-slate-500/10 text-slate-500';
      case 'alert': return 'bg-red-500/10 text-red-500';
    }
  };

  const handleClick = () => {
    if (onRead) onRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const Icon = getIcon(notification.type);

  if (variant === 'banner') {
    return (
      <div
        className={cn(
          "relative flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer",
          notification.read
            ? "bg-card border-border"
            : "bg-primary/5 border-primary/30 shadow-soft"
        )}
        onClick={handleClick}
      >
        {!notification.read && (
          <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
        )}
        
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
          getIconStyle(notification.type)
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-medium text-foreground",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
        </div>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            className="absolute top-4 right-10 p-1 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
          notification.read
            ? "bg-muted/50 border-border"
            : "bg-primary/5 border-primary/20"
        )}
        onClick={handleClick}
      >
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          getIconStyle(notification.type)
        )}>
          <Icon className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm text-foreground truncate",
            !notification.read && "font-medium"
          )}>
            {notification.title}
          </p>
          <p className="text-xs text-muted-foreground">{notification.time}</p>
        </div>
        
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-soft",
        notification.read
          ? "bg-card border-border"
          : "bg-primary/5 border-primary/20"
      )}
      onClick={handleClick}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
        getIconStyle(notification.type)
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
      
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
      )}
    </div>
  );
};

export default NotificationCard;
