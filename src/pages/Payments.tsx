import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard, Plus, IndianRupee, ArrowUpRight, ArrowDownLeft, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface WalletTransaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  created_at: string;
}

const Payments: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    const load = async () => {
      const { data } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) {
        setTransactions(data);
        const balance = data.reduce((sum, tx) => {
          return sum + (tx.type === 'credit' ? Number(tx.amount) : -Number(tx.amount));
        }, 0);
        setWalletBalance(Math.max(0, balance));
      }
      setIsLoading(false);
    };
    load();
  }, [user]);

  const savedMethods = [
    { id: '1', type: 'upi', label: 'Google Pay', detail: 'user@okicici', icon: Smartphone },
    { id: '2', type: 'card', label: 'HDFC Debit Card', detail: '•••• 4521', icon: CreditCard },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-heading text-lg font-bold">Wallet & Payments</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-5 h-5 opacity-80" />
            <span className="text-sm font-medium opacity-80">Wallet Balance</span>
          </div>
          <p className="text-3xl font-bold flex items-center gap-1">
            <IndianRupee className="w-6 h-6" />
            {walletBalance.toFixed(2)}
          </p>
          <div className="flex gap-3 mt-4">
            <Button size="sm" variant="secondary" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0 flex-1">
              <Plus className="w-4 h-4 mr-1" />
              Add Money
            </Button>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Saved Methods</h2>
            <button className="text-xs text-primary font-semibold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              Add New
            </button>
          </div>
          <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border divide-y divide-border">
            {savedMethods.map((method) => (
              <div key={method.id} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <method.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{method.label}</p>
                  <p className="text-xs text-muted-foreground">{method.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Recent Transactions</h2>
          <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No transactions yet
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 p-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'credit' ? 'bg-fresh/10' : 'bg-destructive/10'
                  }`}>
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft className="w-5 h-5 text-fresh" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{tx.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                  </div>
                  <p className={`font-bold text-sm ${tx.type === 'credit' ? 'text-fresh' : 'text-destructive'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{Math.abs(Number(tx.amount))}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
          <p className="text-xs text-muted-foreground leading-relaxed">
            💡 <span className="font-semibold text-foreground">Tip:</span> Add money to your wallet for faster checkout. 
            Wallet balance is non-refundable but can be used for all future orders.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Payments;
