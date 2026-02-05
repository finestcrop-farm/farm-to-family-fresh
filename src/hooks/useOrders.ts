 import { useState, useEffect, useCallback } from 'react';
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
   const { user, profile } = useAuth();
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

   const cancelOrder = async (orderId: string) => {
     if (!user) {
       toast.error('Please login to cancel order');
       return false;
     }
 
     try {
       const { data: order, error: fetchError } = await supabase
         .from('orders')
         .select('order_number, status')
         .eq('id', orderId)
         .single();
 
       if (fetchError) throw fetchError;
 
       if (['delivered', 'cancelled', 'out_for_delivery'].includes(order.status)) {
         toast.error('Cannot cancel order in current status');
         return false;
       }
 
       const { error: updateError } = await supabase
         .from('orders')
         .update({ 
           status: 'cancelled',
           updated_at: new Date().toISOString()
         })
         .eq('id', orderId);
 
       if (updateError) throw updateError;
 
       // Send SMS notification
       if (profile?.phone) {
         try {
           await supabase.functions.invoke('send-order-sms', {
             body: {
               to: profile.phone,
               orderNumber: order.order_number,
               type: 'cancelled',
             }
           });
         } catch (smsError) {
           console.log('SMS notification failed:', smsError);
         }
       }
 
       toast.success('Order cancelled successfully');
       await fetchOrders();
       return true;
     } catch (error) {
       console.error('Error cancelling order:', error);
       toast.error('Failed to cancel order');
       return false;
     }
   };
 
   const reorder = async (orderId: string) => {
     try {
       const orderData = await getOrderById(orderId);
       if (!orderData) {
         toast.error('Order not found');
         return null;
       }
       
       return orderData.items;
     } catch (error) {
       console.error('Error getting order items:', error);
       toast.error('Failed to get order items');
       return null;
     }
   };
 
   const sendOrderSMS = async (orderNumber: string, type: string, phone: string, amount?: number, estimatedTime?: string) => {
     try {
       await supabase.functions.invoke('send-order-sms', {
         body: {
           to: phone,
           orderNumber,
           type,
           amount,
           estimatedTime,
         }
       });
       return true;
     } catch (error) {
       console.error('SMS notification failed:', error);
       return false;
     }
   };
 
   return {
    orders,
    isLoading,
    createOrder,
    getOrderById,
     refetch: fetchOrders,
     cancelOrder,
     reorder,
     sendOrderSMS,
  };
};
