import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Package, Truck, Tag, Gift, 
  MessageCircle, Volume2, Vibrate, Moon
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const NotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [masterToggle, setMasterToggle] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [dndEnabled, setDndEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [settings, setSettings] = useState({
    orders: true,
    delivery: true,
    offers: true,
    rewards: true,
    messages: false,
  });

  const settingsList = [
    { id: 'orders' as const, label: 'Order Updates', description: 'Order confirmation, status changes', icon: Package },
    { id: 'delivery' as const, label: 'Delivery Updates', description: 'Real-time delivery tracking', icon: Truck },
    { id: 'offers' as const, label: 'Offers & Promotions', description: 'Discounts, flash sales, coupons', icon: Tag },
    { id: 'rewards' as const, label: 'Rewards & Points', description: 'Points earned, level up rewards', icon: Gift },
    { id: 'messages' as const, label: 'Messages', description: 'Support chat, announcements', icon: MessageCircle },
  ];

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    const load = async () => {
      const { data } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setSettings({
          orders: data.order_updates ?? true,
          delivery: data.delivery_updates ?? true,
          offers: data.offers ?? true,
          rewards: data.rewards ?? true,
          messages: data.chat_messages ?? false,
        });
        setSoundEnabled(data.sound_enabled ?? true);
        setVibrationEnabled(data.vibration_enabled ?? true);
        setDndEnabled(data.dnd_enabled ?? false);
      }
      setIsLoading(false);
    };
    load();
  }, [user]);

  const save = async (updates: Record<string, any>) => {
    if (!user) return;
    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        order_updates: settings.orders,
        delivery_updates: settings.delivery,
        offers: settings.offers,
        rewards: settings.rewards,
        chat_messages: settings.messages,
        sound_enabled: soundEnabled,
        vibration_enabled: vibrationEnabled,
        dnd_enabled: dndEnabled,
        ...updates,
      }, { onConflict: 'user_id' });
    if (error) toast.error('Failed to save preferences');
  };

  const toggleSetting = (id: keyof typeof settings) => {
    const newVal = !settings[id];
    setSettings(prev => ({ ...prev, [id]: newVal }));
    const fieldMap: Record<string, string> = {
      orders: 'order_updates', delivery: 'delivery_updates',
      offers: 'offers', rewards: 'rewards', messages: 'chat_messages',
    };
    save({ [fieldMap[id]]: newVal });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-8">
      <div className="bg-background sticky top-0 z-50 border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-heading text-lg font-bold text-foreground">Notification Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">{masterToggle ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            <Switch checked={masterToggle} onCheckedChange={setMasterToggle} />
          </div>
        </div>

        <div className={cn("bg-background rounded-2xl shadow-sm border border-border transition-opacity", !masterToggle && "opacity-50 pointer-events-none")}>
          <h2 className="font-semibold text-foreground px-4 pt-4 pb-2">Notification Types</h2>
          <div className="divide-y divide-border">
            {settingsList.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{s.label}</p>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </div>
                <Switch checked={settings[s.id]} onCheckedChange={() => toggleSetting(s.id)} />
              </div>
            ))}
          </div>
        </div>

        <div className={cn("bg-background rounded-2xl shadow-sm border border-border transition-opacity", !masterToggle && "opacity-50 pointer-events-none")}>
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
              <Switch checked={soundEnabled} onCheckedChange={(v) => { setSoundEnabled(v); save({ sound_enabled: v }); }} />
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
              <Switch checked={vibrationEnabled} onCheckedChange={(v) => { setVibrationEnabled(v); save({ vibration_enabled: v }); }} />
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
              <Switch checked={dndEnabled} onCheckedChange={(v) => { setDndEnabled(v); save({ dnd_enabled: v }); }} />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center px-4">
          You can also manage notification permissions in your device settings.
        </p>
      </div>
    </div>
  );
};

export default NotificationSettings;
