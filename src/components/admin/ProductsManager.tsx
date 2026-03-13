import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAdminProxy } from '@/hooks/useAdminProxy';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ProductForm from './ProductForm';

interface Product {
  id: string;
  product_id: string;
  name: string;
  name_hindi: string | null;
  name_telugu: string | null;
  price: number;
  original_price: number | null;
  unit: string;
  image_url: string | null;
  category: string;
  subcategory: string;
  description: string | null;
  farm_source: string | null;
  freshness_badge: string | null;
  fssai_license: string | null;
  expiry_days: number | null;
  storage_tips: string | null;
  in_stock: boolean;
  is_subscribable: boolean;
  created_at: string;
}

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'fruits-vegetables', name: 'Fruits & Vegetables' },
  { id: 'meat-fish', name: 'Meat & Fish' },
  { id: 'dairy-bakery', name: 'Dairy & Bakery' },
  { id: 'grocery-staples', name: 'Grocery Staples' },
  { id: 'pickles-homemade', name: 'Pickles' },
  { id: 'organic-health', name: 'Organic' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'snacks-sweets', name: 'Snacks' },
];

const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  
  const { adminRequest, isAdmin } = useAdminProxy();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Products are publicly readable, so we can use regular supabase client for fetching
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (stockFilter === 'in-stock') {
        query = query.eq('in_stock', true);
      } else if (stockFilter === 'out-of-stock') {
        query = query.eq('in_stock', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts((data as Product[]) || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, stockFilter]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.product_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      const { error } = await adminRequest({
        action: 'delete',
        table: 'products',
        id: product.id,
      });

      if (error) throw error;
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    }
  };

  const toggleStock = async (product: Product) => {
    try {
      const { error } = await adminRequest({
        action: 'update',
        table: 'products',
        id: product.id,
        data: { in_stock: !product.in_stock },
      });

      if (error) throw error;
      toast.success(`Product marked as ${!product.in_stock ? 'in stock' : 'out of stock'}`);
      fetchProducts();
    } catch (error) {
      console.error('Toggle stock error:', error);
      toast.error('Failed to update stock status');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSave = () => {
    handleFormClose();
    fetchProducts();
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            size="sm"
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat.id)}
            className="whitespace-nowrap"
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Stock Filter */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'in-stock', label: 'In Stock' },
          { id: 'out-of-stock', label: 'Out of Stock' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStockFilter(filter.id as 'all' | 'in-stock' | 'out-of-stock')}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              stockFilter === filter.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Products List */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No products found</p>
          <Button className="mt-3" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add First Product
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{product.name}</p>
                  {product.freshness_badge && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-accent text-accent-foreground rounded">
                      {product.freshness_badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {product.product_id} • {product.category}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-primary">₹{product.price}</span>
                  {product.original_price && (
                    <span className="text-xs line-through text-muted-foreground">
                      ₹{product.original_price}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">/ {product.unit}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => toggleStock(product)}
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    product.in_stock
                      ? "bg-accent text-accent-foreground"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {product.in_stock ? 'In Stock' : 'Out'}
                </button>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(product)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct ? {
            id: editingProduct.id,
            product_id: editingProduct.product_id,
            name: editingProduct.name,
            name_hindi: editingProduct.name_hindi || '',
            name_telugu: editingProduct.name_telugu || '',
            price: editingProduct.price,
            original_price: editingProduct.original_price,
            unit: editingProduct.unit,
            image_url: editingProduct.image_url || '',
            category: editingProduct.category,
            subcategory: editingProduct.subcategory,
            description: editingProduct.description || '',
            farm_source: editingProduct.farm_source || '',
            freshness_badge: editingProduct.freshness_badge || '',
            fssai_license: editingProduct.fssai_license || '',
            expiry_days: editingProduct.expiry_days,
            storage_tips: editingProduct.storage_tips || '',
            in_stock: editingProduct.in_stock,
            is_subscribable: editingProduct.is_subscribable,
          } : undefined}
          onClose={handleFormClose}
          onSave={handleFormSave}
          useAdminProxy={isAdmin}
        />
      )}
    </div>
  );
};

export default ProductsManager;
