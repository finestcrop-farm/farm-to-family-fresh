import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  delivery_address: string;
  delivery_slot: string | null;
  payment_method: string;
  payment_status: string;
  driver_name: string | null;
  driver_phone: string | null;
  driver_lat: number | null;
  driver_lng: number | null;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime updates for orders
    if (user) {
      const channel = supabase
        .channel('orders-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Order update:', payload);
            fetchOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const createOrder = async (
    items: { productId: string; productName: string; quantity: number; price: number }[],
    deliveryAddress: string,
    deliverySlot: string,
    paymentMethod: string,
    totalAmount: number
  ) => {
    if (!user) {
      toast.error('Please login to place order');
      return { success: false, orderId: null };
    }

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          order_number: `ORD-${Date.now()}`,
          total_amount: totalAmount,
          delivery_address: deliveryAddress,
          delivery_slot: deliverySlot,
          payment_method: paymentMethod,
          status: 'pending',
          payment_status: paymentMethod === 'cod' ? 'pending' : 'completed',
          estimated_delivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success('Order placed successfully!');
      await fetchOrders();
      return { success: true, orderId: orderData.id, orderNumber: orderData.order_number };
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
      return { success: false, orderId: null };
    }
  };

  const getOrderById = async (orderId: string) => {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      return { order, items };
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  };

  return {
    orders,
    isLoading,
    createOrder,
    getOrderById,
    refetch: fetchOrders,
  };
};
