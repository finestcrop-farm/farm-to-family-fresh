import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Package, Heart, Wallet, 
  Settings, HelpCircle, LogOut, ChevronRight,
  Bell, Gift, Star, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import logoImg from '@/assets/logo.png';

const Account: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      section: 'Orders',
      items: [
        { icon: Package, label: 'My Orders', desc: 'Track & manage orders', path: '/orders' },
        { icon: Heart, label: 'Favorites', desc: 'Your saved items', path: '/favorites' },
        { icon: Bell, label: 'Subscriptions', desc: 'Manage auto-delivery', path: '/subscriptions' },
      ],
    },
    {
      section: 'Account',
      items: [
        { icon: MapPin, label: 'Addresses', desc: 'Manage delivery addresses', path: '/addresses' },
        { icon: Wallet, label: 'Wallet & Payments', desc: 'UPI, cards & wallet', path: '/payments' },
        { icon: Gift, label: 'Rewards', desc: 'Earn & redeem points', path: '/rewards' },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs & contact us', path: '/help' },
        { icon: Star, label: 'Rate Us', desc: 'Share your feedback', path: '/rate' },
        { icon: Shield, label: 'Privacy Policy', desc: 'Terms & conditions', path: '/privacy' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground safe-area-top">
        <div className="px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-xl font-bold">Welcome!</h1>
              <p className="text-sm text-primary-foreground/80">Login to access your account</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            className="w-full mt-4 bg-primary-foreground/20 text-primary-foreground border-0 hover:bg-primary-foreground/30"
          >
            Login / Sign Up
          </Button>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Orders', value: '0' },
            { label: 'Rewards', value: '0' },
            { label: 'Wallet', value: '₹0' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-card rounded-xl text-center shadow-card border border-border">
              <p className="font-bold text-xl text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Menu Sections */}
        {menuItems.map((section) => (
          <div key={section.section}>
            <h2 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-2 px-1">
              {section.section}
            </h2>
            <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border divide-y divide-border">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-4 w-full p-4 hover:bg-muted/50 active:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Settings & Logout */}
        <div className="space-y-2">
          <button className="flex items-center gap-4 w-full p-4 bg-card rounded-xl shadow-card border border-border hover:bg-muted/50 active:bg-muted transition-colors">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="flex-1 text-left font-medium text-foreground">Settings</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button className="flex items-center gap-4 w-full p-4 bg-card rounded-xl shadow-card border border-border hover:bg-destructive/5 active:bg-destructive/10 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <span className="flex-1 text-left font-medium text-destructive">Logout</span>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center pt-4">
          <img 
            src={logoImg} 
            alt="Our Pure Naturals" 
            className="w-28 h-auto mx-auto mb-2 opacity-60"
          />
          <p className="text-xs text-muted-foreground">
            Version 1.0.0
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Account;
