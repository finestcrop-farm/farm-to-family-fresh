import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Star, Trophy, Zap, ShoppingBag, Share2, Crown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';

const Rewards: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const totalPoints = 0;
  const currentTier = 'Bronze';
  const nextTier = 'Silver';
  const pointsToNext = 500;
  const tierProgress = 0;

  const tiers = [
    { name: 'Bronze', minPoints: 0, icon: '🥉', perks: 'Free delivery on orders above ₹299', color: 'bg-amber-700/10 text-amber-700' },
    { name: 'Silver', minPoints: 500, icon: '🥈', perks: '5% off + Free delivery above ₹199', color: 'bg-gray-400/10 text-gray-500' },
    { name: 'Gold', minPoints: 1500, icon: '🥇', perks: '10% off + Priority delivery + Exclusive offers', color: 'bg-yellow-500/10 text-yellow-600' },
    { name: 'Platinum', minPoints: 5000, icon: '👑', perks: '15% off + Free delivery + Early access to new products', color: 'bg-purple-500/10 text-purple-600' },
  ];

  const earnWays = [
    { icon: ShoppingBag, title: 'Shop & Earn', desc: 'Earn 1 point per ₹10 spent', points: '1pt/₹10' },
    { icon: Star, title: 'Review Products', desc: 'Write a review after delivery', points: '+10 pts' },
    { icon: Share2, title: 'Refer a Friend', desc: 'Get points when friends order', points: '+100 pts' },
    { icon: Zap, title: 'Daily Check-in', desc: 'Open the app daily for bonus', points: '+5 pts' },
  ];

  const redeemOptions = [
    { title: '₹50 Off', points: 200, desc: 'On orders above ₹499' },
    { title: '₹100 Off', points: 400, desc: 'On orders above ₹799' },
    { title: 'Free Delivery', points: 100, desc: 'On your next order' },
    { title: '₹250 Off', points: 800, desc: 'On orders above ₹1499' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg font-bold">Rewards</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-5">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80">Your Points Balance</p>
              <p className="text-4xl font-bold font-heading">{totalPoints}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="opacity-80">{currentTier} Member</span>
              <span className="opacity-80">{pointsToNext} pts to {nextTier}</span>
            </div>
            <Progress value={tierProgress} className="h-2 bg-primary-foreground/20" />
          </div>
        </div>

        {!user && (
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 text-center">
            <p className="text-sm text-foreground font-medium mb-2">Login to start earning rewards!</p>
            <Button variant="hero" size="sm" onClick={() => navigate('/auth')}>
              Login / Sign Up
            </Button>
          </div>
        )}

        {/* Membership Tiers */}
        <div>
          <h2 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">Membership Tiers</h2>
          <div className="grid grid-cols-2 gap-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-card border border-border rounded-2xl p-4 shadow-card ${tier.name === currentTier ? 'ring-2 ring-primary' : ''}`}
              >
                <span className="text-2xl">{tier.icon}</span>
                <p className="font-bold text-foreground text-sm mt-1">{tier.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{tier.minPoints}+ pts</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{tier.perks}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Earn Points */}
        <div>
          <h2 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">Ways to Earn</h2>
          <div className="bg-card border border-border rounded-2xl shadow-card divide-y divide-border overflow-hidden">
            {earnWays.map((way, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <way.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{way.title}</p>
                  <p className="text-xs text-muted-foreground">{way.desc}</p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{way.points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Redeem */}
        <div>
          <h2 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">Redeem Points</h2>
          <div className="grid grid-cols-2 gap-3">
            {redeemOptions.map((option, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-card">
                <p className="font-bold text-foreground">{option.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-accent">{option.points} pts</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    disabled={totalPoints < option.points}
                  >
                    Redeem
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">Recent Activity</h2>
          <div className="bg-card border border-border rounded-2xl shadow-card p-6 text-center">
            <Gift className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No rewards activity yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start shopping to earn points!</p>
            <Button variant="hero" size="sm" className="mt-4" onClick={() => navigate('/')}>
              Start Shopping
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Rewards;
