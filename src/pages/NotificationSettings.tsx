import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Package, Truck, Tag, Gift, 
  MessageCircle, Volume2, Vibrate, Moon
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

const NotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  
  const [masterToggle, setMasterToggle] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [dndEnabled, setDndEnabled] = useState(false);

  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: 'orders', label: 'Order Updates', description: 'Order confirmation, status changes', icon: Package, enabled: true },
    { id: 'delivery', label: 'Delivery Updates', description: 'Real-time delivery tracking', icon: Truck, enabled: true },
    { id: 'offers', label: 'Offers & Promotions', description: 'Discounts, flash sales, coupons', icon: Tag, enabled: true },
    { id: 'rewards', label: 'Rewards & Points', description: 'Points earned, level up rewards', icon: Gift, enabled: true },
    { id: 'messages', label: 'Messages', description: 'Support chat, announcements', icon: MessageCircle, enabled: false },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev => 
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-8">
      {/* Header */}
      <div className="bg-background sticky top-0 z-50 border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-heading text-lg font-bold text-foreground">Notification Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Master Toggle */}
        <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  {masterToggle ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <Switch 
              checked={masterToggle} 
              onCheckedChange={setMasterToggle}
            />
          </div>
        </div>

        {/* Notification Types */}
        <div className={cn(
          "bg-background rounded-2xl shadow-sm border border-border transition-opacity",
          !masterToggle && "opacity-50 pointer-events-none"
        )}>
          <h2 className="font-semibold text-foreground px-4 pt-4 pb-2">Notification Types</h2>
          <div className="divide-y divide-border">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <setting.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <Switch 
                  checked={setting.enabled} 
                  onCheckedChange={() => toggleSetting(setting.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sound & Vibration */}
        <div className={cn(
          "bg-background rounded-2xl shadow-sm border border-border transition-opacity",
          !masterToggle && "opacity-50 pointer-events-none"
        )}>
          <h2 className="font-semibold text-foreground px-4 pt-4 pb-2">Alert Preferences</h2>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Sound</p>
                  <p className="text-sm text-muted-foreground">Play notification sound</p>
                </div>
              </div>
              <Switch 
                checked={soundEnabled} 
                onCheckedChange={setSoundEnabled}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Vibrate className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Vibration</p>
                  <p className="text-sm text-muted-foreground">Vibrate on notification</p>
                </div>
              </div>
              <Switch 
                checked={vibrationEnabled} 
                onCheckedChange={setVibrationEnabled}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Do Not Disturb</p>
                  <p className="text-sm text-muted-foreground">Mute notifications 10 PM - 7 AM</p>
                </div>
              </div>
              <Switch 
                checked={dndEnabled} 
                onCheckedChange={setDndEnabled}
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center px-4">
          You can also manage notification permissions in your device settings.
        </p>
      </div>
    </div>
  );
};

export default NotificationSettings;
