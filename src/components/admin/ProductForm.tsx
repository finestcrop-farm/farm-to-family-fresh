import React, { useState, useRef } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAdminProxy } from '@/hooks/useAdminProxy';
import { toast } from 'sonner';

interface ProductFormData {
  id?: string;
  product_id: string;
  name: string;
  name_hindi: string;
  name_telugu: string;
  price: number;
  original_price: number | null;
  unit: string;
  image_url: string;
  category: string;
  subcategory: string;
  description: string;
  farm_source: string;
  freshness_badge: string;
  fssai_license: string;
  expiry_days: number | null;
  storage_tips: string;
  in_stock: boolean;
  is_subscribable: boolean;
}

interface ProductFormProps {
  product?: ProductFormData;
  onClose: () => void;
  onSave: () => void;
  useAdminProxy?: boolean;
}

const categories = [
  { id: 'fruits-vegetables', name: 'Fruits & Vegetables' },
  { id: 'meat-fish', name: 'Meat & Fish' },
  { id: 'dairy-bakery', name: 'Dairy & Bakery' },
  { id: 'grocery-staples', name: 'Grocery Staples' },
  { id: 'pickles-homemade', name: 'Pickles & Homemade' },
  { id: 'organic-health', name: 'Organic & Health' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'snacks-sweets', name: 'Snacks & Sweets' },
];

const freshnessBadges = [
  { id: '', name: 'None' },
  { id: 'farm-fresh', name: 'Farm Fresh' },
  { id: 'organic', name: 'Organic' },
  { id: 'handpicked', name: 'Handpicked' },
  { id: 'local', name: 'Local' },
];



const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSave, useAdminProxy: useProxy = false }) => {
  const [formData, setFormData] = useState<ProductFormData>(
    product || {
      product_id: '',
      name: '',
      name_hindi: '',
      name_telugu: '',
      price: 0,
      original_price: null,
      unit: '',
      image_url: '',
      category: 'fruits-vegetables',
      subcategory: '',
      description: '',
      farm_source: '',
      freshness_badge: '',
      fssai_license: '',
      expiry_days: null,
      storage_tips: '',
      in_stock: true,
      is_subscribable: false,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { adminRequest } = useAdminProxy();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.product_id || Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      if (useProxy) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = (reader.result as string).split(',')[1];
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-storage-upload`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session?.access_token}`,
                  'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                },
                body: JSON.stringify({
                  bucket: 'product-images',
                  path: filePath,
                  file: base64,
                  contentType: file.type,
                }),
              }
            );
            
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            
            setFormData({ ...formData, image_url: result.publicUrl });
            toast.success('Image uploaded successfully');
          } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
          } finally {
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_id || !formData.name || !formData.price || !formData.unit) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSave = {
        product_id: formData.product_id,
        name: formData.name,
        name_hindi: formData.name_hindi || null,
        name_telugu: formData.name_telugu || null,
        price: formData.price,
        original_price: formData.original_price || null,
        unit: formData.unit,
        image_url: formData.image_url || null,
        category: formData.category,
        subcategory: formData.subcategory || '',
        description: formData.description || null,
        farm_source: formData.farm_source || null,
        freshness_badge: formData.freshness_badge || null,
        fssai_license: formData.fssai_license || null,
        expiry_days: formData.expiry_days || null,
        storage_tips: formData.storage_tips || null,
        in_stock: formData.in_stock,
        is_subscribable: formData.is_subscribable,
      };

      if (useProxy) {
        // Use admin proxy for dev admin
        if (product?.id) {
          const { error } = await adminRequest({
            action: 'update',
            table: 'products',
            id: product.id,
            data: dataToSave,
          });
          if (error) throw error;
          toast.success('Product updated successfully');
        } else {
          const { error } = await adminRequest({
            action: 'insert',
            table: 'products',
            data: dataToSave,
          });
          if (error) throw error;
          toast.success('Product added successfully');
        }
      } else {
        // Use regular supabase for authenticated admin
        if (product?.id) {
          const { error } = await supabase
            .from('products')
            .update(dataToSave)
            .eq('id', product.id);
          if (error) throw error;
          toast.success('Product updated successfully');
        } else {
          const { error } = await supabase
            .from('products')
            .insert(dataToSave);
          if (error) throw error;
          toast.success('Product added successfully');
        }
      }

      onSave();
    } catch (error: unknown) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-center gap-4">
              {formData.image_url && (
                <img 
                  src={formData.image_url} 
                  alt="Product" 
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_id">Product ID *</Label>
              <Input
                id="product_id"
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                placeholder="e.g., tomato-1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name (English) *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Farm Fresh Tomatoes"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_hindi">Name (Hindi)</Label>
              <Input
                id="name_hindi"
                value={formData.name_hindi}
                onChange={(e) => setFormData({ ...formData, name_hindi: e.target.value })}
                placeholder="ताज़े टमाटर"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_telugu">Name (Telugu)</Label>
              <Input
                id="name_telugu"
                value={formData.name_telugu}
                onChange={(e) => setFormData({ ...formData, name_telugu: e.target.value })}
                placeholder="తాజా టమాటాలు"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="original_price">Original Price (₹)</Label>
              <Input
                id="original_price"
                type="number"
                value={formData.original_price || ''}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="500g, 1kg, 1L"
                required
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="daily-veggies"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freshness_badge">Freshness Badge</Label>
              <select
                id="freshness_badge"
                value={formData.freshness_badge}
                onChange={(e) => setFormData({ ...formData, freshness_badge: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3"
              >
                {freshnessBadges.map((badge) => (
                  <option key={badge.id} value={badge.id}>{badge.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farm_source">Farm Source</Label>
              <Input
                id="farm_source"
                value={formData.farm_source}
                onChange={(e) => setFormData({ ...formData, farm_source: e.target.value })}
                placeholder="Krishna Farms, Kolar"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fssai_license">FSSAI License</Label>
              <Input
                id="fssai_license"
                value={formData.fssai_license}
                onChange={(e) => setFormData({ ...formData, fssai_license: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry_days">Expiry Days</Label>
              <Input
                id="expiry_days"
                type="number"
                value={formData.expiry_days || ''}
                onChange={(e) => setFormData({ ...formData, expiry_days: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage_tips">Storage Tips</Label>
              <Input
                id="storage_tips"
                value={formData.storage_tips}
                onChange={(e) => setFormData({ ...formData, storage_tips: e.target.value })}
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Switch
                id="in_stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
              />
              <Label htmlFor="in_stock">In Stock</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_subscribable"
                checked={formData.is_subscribable}
                onCheckedChange={(checked) => setFormData({ ...formData, is_subscribable: checked })}
              />
              <Label htmlFor="is_subscribable">Subscribable</Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
