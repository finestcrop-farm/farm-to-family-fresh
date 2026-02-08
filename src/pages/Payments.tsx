import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard, Plus, IndianRupee, ArrowUpRight, ArrowDownLeft, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';

const Payments: React.FC = () => {
  const navigate = useNavigate();

  const savedMethods = [
    { id: '1', type: 'upi', label: 'Google Pay', detail: 'user@okicici', icon: Smartphone },
    { id: '2', type: 'card', label: 'HDFC Debit Card', detail: '•••• 4521', icon: CreditCard },
  ];

  const transactions = [
    { id: '1', title: 'Order #ORD-20250201-3842', amount: -345, date: '01 Feb 2026', type: 'debit' },
    { id: '2', title: 'Wallet Recharge', amount: 500, date: '28 Jan 2026', type: 'credit' },
    { id: '3', title: 'Cashback - Order #ORD-20250125', amount: 25, date: '25 Jan 2026', type: 'credit' },
    { id: '4', title: 'Order #ORD-20250120-1190', amount: -580, date: '20 Jan 2026', type: 'debit' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-heading text-lg font-bold">Wallet & Payments</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-5 h-5 opacity-80" />
            <span className="text-sm font-medium opacity-80">Wallet Balance</span>
          </div>
          <p className="text-3xl font-bold flex items-center gap-1">
            <IndianRupee className="w-6 h-6" />
            180.00
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              size="sm"
              variant="secondary"
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0 flex-1"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Money
            </Button>
          </div>
        </div>

        {/* Saved Payment Methods */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Saved Methods
            </h2>
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

        {/* Transaction History */}
        <section>
          <h2 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Recent Transactions
          </h2>
          <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border divide-y divide-border">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'credit' 
                    ? 'bg-fresh/10' 
                    : 'bg-destructive/10'
                }`}>
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft className="w-5 h-5 text-fresh" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{tx.title}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <p className={`font-bold text-sm ${
                  tx.type === 'credit' ? 'text-fresh' : 'text-destructive'
                }`}>
                  {tx.type === 'credit' ? '+' : ''}₹{Math.abs(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Info */}
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
