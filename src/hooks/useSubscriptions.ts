import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Subscription {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  frequency: string;
  price: number;
  status: string;
  start_date: string;
  next_delivery: string | null;
  created_at: string;
  updated_at: string;
}

export const useSubscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptions = async () => {
    if (!user) {
      setSubscriptions([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  const addSubscription = async (
    productId: string,
    productName: string,
    quantity: number,
    frequency: string,
    price: number
  ) => {
    if (!user) {
      toast.error('Please login to subscribe');
      return { success: false };
    }

    try {
      const nextDelivery = new Date();
      nextDelivery.setDate(nextDelivery.getDate() + (frequency === 'daily' ? 1 : frequency === 'alternate' ? 2 : 7));

      const { error } = await supabase.from('subscriptions').insert({
        user_id: user.id,
        product_id: productId,
        product_name: productName,
        quantity,
        frequency,
        price,
        next_delivery: nextDelivery.toISOString().split('T')[0],
      });

      if (error) throw error;

      toast.success('Subscription added successfully!');
      await fetchSubscriptions();
      return { success: true };
    } catch (error) {
      console.error('Error adding subscription:', error);
      toast.error('Failed to add subscription');
      return { success: false };
    }
  };

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Subscription updated!');
      await fetchSubscriptions();
      return { success: true };
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription');
      return { success: false };
    }
  };

  const pauseSubscription = async (id: string) => {
    return updateSubscription(id, { status: 'paused' });
  };

  const resumeSubscription = async (id: string) => {
    return updateSubscription(id, { status: 'active' });
  };

  const cancelSubscription = async (id: string) => {
    return updateSubscription(id, { status: 'cancelled' });
  };

  return {
    subscriptions,
    isLoading,
    addSubscription,
    updateSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    refetch: fetchSubscriptions,
  };
};
