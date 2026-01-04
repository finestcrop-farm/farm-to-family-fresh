import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavoriteIds(new Set(data?.map(f => f.product_id) || []));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    const isFavorite = favoriteIds.has(productId);

    // Optimistic update
    const newFavorites = new Set(favoriteIds);
    if (isFavorite) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavoriteIds(newFavorites);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;
        toast.success('Added to favorites');
      }
    } catch (error) {
      // Revert optimistic update
      setFavoriteIds(favoriteIds);
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const isFavorite = (productId: string) => favoriteIds.has(productId);

  return {
    favoriteIds,
    isLoading,
    toggleFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
}
