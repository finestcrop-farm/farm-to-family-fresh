import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, Star, Trash2, Edit2, Home, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const addressSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(50),
  full_address: z.string().trim().min(10, "Address must be at least 10 characters").max(500),
  city: z.string().trim().min(1, "City is required").max(100),
  pincode: z.string().trim().regex(/^\d{6}$/, "Invalid pincode"),
});

interface Address {
  id: string;
  label: string;
  full_address: string;
  city: string | null;
  pincode: string | null;
  is_default: boolean | null;
}

const Addresses: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    full_address: '',
    city: '',
    pincode: '',
    is_default: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchAddresses = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = addressSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      if (formData.is_default) {
        // Remove default from other addresses
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user!.id);
      }

      if (editingId) {
        const { error } = await supabase
          .from('addresses')
          .update({
            label: result.data.label,
            full_address: result.data.full_address,
            city: result.data.city,
            pincode: result.data.pincode,
            is_default: formData.is_default,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Address updated');
      } else {
        const { error } = await supabase
          .from('addresses')
          .insert({
            user_id: user!.id,
            label: result.data.label,
            full_address: result.data.full_address,
            city: result.data.city,
            pincode: result.data.pincode,
            is_default: formData.is_default || addresses.length === 0,
          });

        if (error) throw error;
        toast.success('Address added');
      }

      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ label: '', full_address: '', city: '', pincode: '', is_default: false });
    setErrors({});
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      label: address.label,
      full_address: address.full_address,
      city: address.city || '',
      pincode: address.pincode || '',
      is_default: address.is_default || false,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success('Address deleted');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user!.id);

      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      fetchAddresses();
      toast.success('Default address updated');
    } catch (error) {
      console.error('Error setting default:', error);
      toast.error('Failed to update default address');
    }
  };

  const getLabelIcon = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('home')) return Home;
    if (lower.includes('office') || lower.includes('work')) return Briefcase;
    return MapPin;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30 pb-24">
        <div className="bg-gradient-hero text-primary-foreground sticky top-0 z-50">
          <div className="flex items-center gap-4 px-4 py-4 safe-area-top">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-heading text-xl font-bold">Addresses</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <MapPin className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Login to manage addresses</h2>
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
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-heading text-xl font-bold">Addresses</h1>
            <p className="text-sm opacity-80">{addresses.length} saved addresses</p>
          </div>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
            <h2 className="font-semibold text-foreground mb-4">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Label (e.g., Home, Office)"
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                {errors.label && <p className="text-destructive text-xs mt-1">{errors.label}</p>}
              </div>
              <div>
                <textarea
                  value={formData.full_address}
                  onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                  placeholder="Full Address"
                  rows={3}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                />
                {errors.full_address && <p className="text-destructive text-xs mt-1">{errors.full_address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="Pincode"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  {errors.pincode && <p className="text-destructive text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Set as default address</span>
              </label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? 'Saving...' : editingId ? 'Update' : 'Add Address'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center py-20">
            <MapPin className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No addresses saved</h2>
            <p className="text-muted-foreground text-center mb-6">Add an address for faster checkout</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => {
              const LabelIcon = getLabelIcon(address.label);
              return (
                <div
                  key={address.id}
                  className={cn(
                    "bg-background rounded-xl p-4 shadow-sm border-2 transition-all",
                    address.is_default ? "border-primary" : "border-border"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      address.is_default ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <LabelIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{address.label}</span>
                        {address.is_default && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{address.full_address}</p>
                      {address.city && address.pincode && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {address.city} - {address.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    {!address.is_default && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setAsDefault(address.id)}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/30"
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
