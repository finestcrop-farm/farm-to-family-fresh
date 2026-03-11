import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Package, Heart, Wallet, 
  Settings, HelpCircle, LogOut, ChevronRight,
  Bell, Gift, Star, Shield, Phone, Mail, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import logoImg from '@/assets/logo.png';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut, isLoading } = useAuth();
  const { orders } = useOrders();

  const orderCount = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const rewardPoints = Math.floor(totalSpent / 10); // 1 point per ₹10

  const menuItems = [
    {
      section: 'Orders & Favorites',
      items: [
        { icon: Package, label: 'My Orders', desc: 'Track & manage orders', path: '/orders', color: 'text-primary bg-primary/10' },
        { icon: Heart, label: 'Favorites', desc: 'Your saved items', path: '/favorites', color: 'text-destructive bg-destructive/10' },
        { icon: Bell, label: 'Subscriptions', desc: 'Manage auto-delivery', path: '/subscriptions', color: 'text-accent bg-accent/10' },
      ],
    },
    {
      section: 'Account & Payments',
      items: [
        { icon: MapPin, label: 'Addresses', desc: 'Manage delivery addresses', path: '/addresses', color: 'text-fresh bg-fresh/10' },
        { icon: Wallet, label: 'Wallet & Payments', desc: 'UPI, cards & wallet', path: '/payments', color: 'text-trust bg-trust/10' },
        { icon: Gift, label: 'Rewards', desc: 'Earn & redeem points', path: '/rewards', color: 'text-accent bg-accent/10' },
      ],
    },
    {
      section: 'Help & Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs & contact us', path: '/help', color: 'text-primary bg-primary/10' },
        { icon: Star, label: 'Rate Us', desc: 'Share your feedback', path: '/rate', color: 'text-trust bg-trust/10' },
        { icon: Shield, label: 'Privacy Policy', desc: 'Data protection info', path: '/privacy', color: 'text-muted-foreground bg-secondary' },
        { icon: Shield, label: 'Terms & Conditions', desc: 'Usage terms', path: '/terms', color: 'text-muted-foreground bg-secondary' },
      ],
    },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center overflow-hidden shadow-soft">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="font-heading text-xl font-bold">
                      {profile?.full_name || 'Welcome!'}
                    </h1>
                    {isAdmin && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-200 text-xs font-semibold rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm opacity-80">{profile?.phone || user.phone || user.email}</p>
                </>
              ) : (
                <>
                  <h1 className="font-heading text-xl font-bold">Welcome!</h1>
                  <p className="text-sm opacity-80">Login to access your account</p>
                </>
              )}
            </div>
          </div>
          
          {!user && (
            <Button 
              onClick={() => navigate('/login')}
              variant="secondary" 
              className="w-full mt-4 bg-primary-foreground text-primary border-0 hover:bg-primary-foreground/90 font-semibold shadow-soft"
            >
              <Phone className="w-4 h-4 mr-2" />
              Login / Sign Up
            </Button>
          )}
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="w-full p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg flex items-center gap-4 text-white"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Admin Dashboard</p>
              <p className="text-sm opacity-80">Manage orders & subscriptions</p>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Orders', value: String(orderCount), icon: Package, color: 'text-primary' },
            { label: 'Rewards', value: String(rewardPoints), icon: Gift, color: 'text-accent' },
            { label: 'Wallet', value: '₹0', icon: Wallet, color: 'text-trust' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-card rounded-xl text-center shadow-card border border-border animate-fade-in">
              <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className={`font-bold text-lg ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {menuItems.map((section, sectionIndex) => (
          <div key={section.section} className="animate-fade-in" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
            <h2 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.section}
            </h2>
            <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border divide-y divide-border">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-4 w-full p-4 hover:bg-muted/50 active:bg-muted transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
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

        <div className="space-y-2">
          <button 
            onClick={() => navigate('/notification-settings')}
            className="flex items-center gap-4 w-full p-4 bg-card rounded-xl shadow-card border border-border hover:bg-muted/50 active:bg-muted transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="flex-1 text-left font-medium text-foreground">Settings</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {user && (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 w-full p-4 bg-card rounded-xl shadow-card border border-border hover:bg-destructive/5 active:bg-destructive/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <span className="flex-1 text-left font-medium text-destructive">Logout</span>
            </button>
          )}
        </div>

        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
          <h3 className="font-semibold text-foreground text-sm mb-2">Need Help?</h3>
          <div className="flex items-center gap-3">
            <a href="tel:+919999999999" className="flex items-center gap-2 text-sm text-primary font-medium">
              <Phone className="w-4 h-4" />
              Call Us
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="mailto:support@ourpurenaturals.com" className="flex items-center gap-2 text-sm text-primary font-medium">
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>
        </div>

        <div className="text-center pt-4 pb-2">
          <img src={logoImg} alt="Our Pure Naturals" className="w-28 h-auto mx-auto mb-2 opacity-60" />
          <p className="text-xs text-muted-foreground">
            Version 1.0.0 • Made with 💚 in India
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Account;
