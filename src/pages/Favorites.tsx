import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { products } from '@/data/products';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Favorite {
  id: string;
  product_id: string;
}

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useApp();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id, product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
      setFavorites(favorites.filter(f => f.id !== favoriteId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      toast.success('Added to cart');
    }
  };

  const favoriteProducts = favorites
    .map(fav => ({
      ...fav,
      product: products.find(p => p.id === fav.product_id),
    }))
    .filter(item => item.product);

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30 pb-24">
        <div className="bg-gradient-hero text-primary-foreground sticky top-0 z-50">
          <div className="flex items-center gap-4 px-4 py-4 safe-area-top">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-heading text-xl font-bold">Favorites</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <Heart className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Login to see favorites</h2>
          <p className="text-muted-foreground text-center mb-6">
            Sign in to save your favorite products
          </p>
          <Button onClick={() => navigate('/')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground sticky top-0 z-50">
        <div className="flex items-center gap-4 px-4 py-4 safe-area-top">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading text-xl font-bold">Favorites</h1>
            <p className="text-sm opacity-80">{favorites.length} items</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No favorites yet</h2>
            <p className="text-muted-foreground text-center mb-6">
              Start adding products you love!
            </p>
            <Button onClick={() => navigate('/')}>Browse Products</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteProducts.map(({ id, product }) => (
              <div
                key={id}
                className="bg-background rounded-xl p-3 shadow-sm border border-border flex gap-3"
              >
                <img
                  src={product!.image}
                  alt={product!.name}
                  className="w-20 h-20 rounded-lg object-cover"
                  onClick={() => navigate(`/product/${product!.id}`)}
                />
                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-medium text-foreground line-clamp-1 cursor-pointer"
                    onClick={() => navigate(`/product/${product!.id}`)}
                  >
                    {product!.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{product!.unit}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-foreground">₹{product!.price}</span>
                    {product!.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{product!.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(product!.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/30"
                      onClick={() => removeFavorite(id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
