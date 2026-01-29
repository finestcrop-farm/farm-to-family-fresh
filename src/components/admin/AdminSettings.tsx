import React, { useState, useEffect } from 'react';
import { Settings, ChevronRight, Bell, Palette, Store, CreditCard, Truck, Shield, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const settingsSections: SettingsSection[] = [
  { id: 'store', title: 'Store Details', icon: Store, description: 'Business name, contact info' },
  { id: 'delivery', title: 'Delivery Settings', icon: Truck, description: 'Zones, charges, timings' },
  { id: 'payment', title: 'Payment Settings', icon: CreditCard, description: 'Payment methods, COD' },
  { id: 'notifications', title: 'Notifications', icon: Bell, description: 'Email, push settings' },
];

const AdminSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Farm to Family Fresh',
    phone: '+91 9876543210',
    email: 'support@farmtofamily.in',
    address: 'Hyderabad, Telangana',
    gst: '',
    fssai: '',
  });

  // Delivery settings state
  const [deliverySettings, setDeliverySettings] = useState({
    freeDeliveryThreshold: 500,
    standardDeliveryCharge: 30,
    expressDeliveryCharge: 50,
    enableExpress: true,
    enableEarlyMorning: true,
    maxDeliveryRadius: 10,
  });

  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState({
    enableCOD: true,
    enableUPI: true,
    enableCards: true,
    codLimit: 5000,
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    promotionalEmails: true,
    pushNotifications: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // In production, save to database
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully');
    setIsSaving(false);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'store':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={storeSettings.phone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={storeSettings.email}
                  onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={storeSettings.address}
                onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gst">GST Number</Label>
                <Input
                  id="gst"
                  value={storeSettings.gst}
                  onChange={(e) => setStoreSettings({ ...storeSettings, gst: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fssai">FSSAI License</Label>
                <Input
                  id="fssai"
                  value={storeSettings.fssai}
                  onChange={(e) => setStoreSettings({ ...storeSettings, fssai: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        );

      case 'delivery':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="freeThreshold">Free Delivery Above (₹)</Label>
                <Input
                  id="freeThreshold"
                  type="number"
                  value={deliverySettings.freeDeliveryThreshold}
                  onChange={(e) => setDeliverySettings({ ...deliverySettings, freeDeliveryThreshold: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="standardCharge">Standard Charge (₹)</Label>
                <Input
                  id="standardCharge"
                  type="number"
                  value={deliverySettings.standardDeliveryCharge}
                  onChange={(e) => setDeliverySettings({ ...deliverySettings, standardDeliveryCharge: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expressCharge">Express Charge (₹)</Label>
                <Input
                  id="expressCharge"
                  type="number"
                  value={deliverySettings.expressDeliveryCharge}
                  onChange={(e) => setDeliverySettings({ ...deliverySettings, expressDeliveryCharge: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxRadius">Max Radius (km)</Label>
                <Input
                  id="maxRadius"
                  type="number"
                  value={deliverySettings.maxDeliveryRadius}
                  onChange={(e) => setDeliverySettings({ ...deliverySettings, maxDeliveryRadius: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableExpress">Enable Express Delivery</Label>
                <Switch
                  id="enableExpress"
                  checked={deliverySettings.enableExpress}
                  onCheckedChange={(checked) => setDeliverySettings({ ...deliverySettings, enableExpress: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enableEarlyMorning">Enable Early Morning Delivery</Label>
                <Switch
                  id="enableEarlyMorning"
                  checked={deliverySettings.enableEarlyMorning}
                  onCheckedChange={(checked) => setDeliverySettings({ ...deliverySettings, enableEarlyMorning: checked })}
                />
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableCOD">Cash on Delivery</Label>
                  <p className="text-xs text-muted-foreground">Allow customers to pay on delivery</p>
                </div>
                <Switch
                  id="enableCOD"
                  checked={paymentSettings.enableCOD}
                  onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableCOD: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableUPI">UPI Payments</Label>
                  <p className="text-xs text-muted-foreground">Accept UPI payments</p>
                </div>
                <Switch
                  id="enableUPI"
                  checked={paymentSettings.enableUPI}
                  onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableUPI: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableCards">Card Payments</Label>
                  <p className="text-xs text-muted-foreground">Accept debit/credit cards</p>
                </div>
                <Switch
                  id="enableCards"
                  checked={paymentSettings.enableCards}
                  onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, enableCards: checked })}
                />
              </div>
            </div>
            {paymentSettings.enableCOD && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="codLimit">COD Limit (₹)</Label>
                <Input
                  id="codLimit"
                  type="number"
                  value={paymentSettings.codLimit}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, codLimit: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">Maximum order value for COD</p>
              </div>
            )}
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Order Notifications</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="orderConfirmation">Order Confirmation</Label>
                <Switch
                  id="orderConfirmation"
                  checked={notificationSettings.orderConfirmation}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, orderConfirmation: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="orderShipped">Order Shipped</Label>
                <Switch
                  id="orderShipped"
                  checked={notificationSettings.orderShipped}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, orderShipped: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="orderDelivered">Order Delivered</Label>
                <Switch
                  id="orderDelivered"
                  checked={notificationSettings.orderDelivered}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, orderDelivered: checked })}
                />
              </div>
            </div>
            <hr className="my-4" />
            <h4 className="font-medium text-sm">Marketing</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="promotionalEmails">Promotional Emails</Label>
                <Switch
                  id="promotionalEmails"
                  checked={notificationSettings.promotionalEmails}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, promotionalEmails: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <Switch
                  id="pushNotifications"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (activeSection) {
    const section = settingsSections.find(s => s.id === activeSection);
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveSection(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Settings
        </button>
        
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            {section && <section.icon className="w-5 h-5 text-primary" />}
            <div>
              <h3 className="font-semibold">{section?.title}</h3>
              <p className="text-xs text-muted-foreground">{section?.description}</p>
            </div>
          </div>
          
          {renderSectionContent()}
          
          <div className="flex gap-3 mt-6 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setActiveSection(null)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {settingsSections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className="w-full flex items-center gap-3 bg-card rounded-xl p-4 border border-border text-left hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <section.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{section.title}</p>
            <p className="text-xs text-muted-foreground">{section.description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
};

export default AdminSettings;
