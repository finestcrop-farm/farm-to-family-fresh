import React, { useState, useEffect } from 'react';
import { Bell, History, RefreshCw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminProxy } from '@/hooks/useAdminProxy';

interface PromoHistory {
  id: string;
  title: string;
  message: string;
  recipient_count: number;
  sent_at: string;
  push_sent: boolean;
  push_success_count: number | null;
  push_failure_count: number | null;
}

const PromoHistoryList: React.FC = () => {
  const { isAdmin } = useAuth();
  const { adminRequest } = useAdminProxy();
  const [promoHistory, setPromoHistory] = useState<PromoHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      if (isDevAdmin) {
        // Use admin proxy for dev admin to bypass RLS
        const { data, error } = await adminRequest<PromoHistory[]>({
          action: 'select',
          table: 'promotional_notification_history',
          data: {
            order: { column: 'sent_at', ascending: false },
            limit: 50,
          },
        });

        if (error) throw error;
        setPromoHistory(data || []);
      } else {
        // Regular admin uses direct supabase
        const { data, error } = await supabase
          .from('promotional_notification_history')
          .select('*')
          .order('sent_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setPromoHistory((data as PromoHistory[]) || []);
      }
    } catch (error) {
      console.error('Error fetching promo history:', error);
      toast.error('Failed to load notification history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [isDevAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (promoHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No promotional notifications sent yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">{promoHistory.length} notifications sent</p>
        <Button variant="ghost" size="sm" onClick={fetchHistory}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      
      {promoHistory.map((promo) => (
        <div key={promo.id} className="bg-card rounded-xl p-4 shadow-card border border-border">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 mr-3">
              <p className="font-semibold text-foreground truncate">{promo.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(promo.sent_at).toLocaleString()}
              </p>
            </div>
            <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
              {promo.recipient_count} users
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{promo.message}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Bell className="w-3 h-3" />
              In-app: {promo.recipient_count}
            </span>
            {promo.push_sent && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Send className="w-3 h-3" />
                Push: {promo.push_success_count || 0}
              </span>
            )}
            {promo.push_sent && promo.push_failure_count && promo.push_failure_count > 0 && (
              <span className="flex items-center gap-1 text-destructive">
                Failed: {promo.push_failure_count}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromoHistoryList;
