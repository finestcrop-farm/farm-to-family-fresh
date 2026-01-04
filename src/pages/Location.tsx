import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, Navigation, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const popularLocations = [
  { id: '1', name: 'Jubilee Hills', area: 'Hyderabad', lat: 17.4325, lng: 78.4071 },
  { id: '2', name: 'HITEC City', area: 'Hyderabad', lat: 17.4504, lng: 78.3809 },
  { id: '3', name: 'Banjara Hills', area: 'Hyderabad', lat: 17.4156, lng: 78.4487 },
  { id: '4', name: 'Gachibowli', area: 'Hyderabad', lat: 17.4401, lng: 78.3489 },
  { id: '5', name: 'Kondapur', area: 'Hyderabad', lat: 17.4712, lng: 78.3575 },
  { id: '6', name: 'Madhapur', area: 'Hyderabad', lat: 17.4485, lng: 78.3908 },
  { id: '7', name: 'Secunderabad', area: 'Hyderabad', lat: 17.4399, lng: 78.4983 },
  { id: '8', name: 'Ameerpet', area: 'Hyderabad', lat: 17.4375, lng: 78.4482 },
];

const Location: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation } = useApp();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredLocations = popularLocations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveLocationToDb = async (location: string, lat?: number, lng?: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_locations')
        .upsert({
          user_id: user.id,
          location_name: location,
          lat,
          lng,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const loadLocationFromDb = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_locations')
        .select('location_name')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setSelectedLocation(data.location_name);
      }
    } catch (error) {
      // No saved location
    }
  };

  useEffect(() => {
    loadLocationFromDb();
  }, [user]);

  const handleSelectLocation = async (location: typeof popularLocations[0]) => {
    setIsSaving(true);
    setSelectedLocation(location.name);
    await saveLocationToDb(location.name, location.lat, location.lng);
    setIsSaving(false);
    toast.success(`Location set to ${location.name}`);
    navigate(-1);
  };

  const handleDetectLocation = () => {
    setIsDetecting(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd reverse geocode this
          const detectedLocation = 'Current Location';
          setSelectedLocation(detectedLocation);
          await saveLocationToDb(detectedLocation, latitude, longitude);
          setIsDetecting(false);
          toast.success('Location detected!');
          navigate(-1);
        },
        (error) => {
          setIsDetecting(false);
          toast.error('Could not detect location. Please select manually.');
        }
      );
    } else {
      setIsDetecting(false);
      toast.error('Geolocation not supported by your browser.');
    }
  };

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
            <h1 className="font-heading text-xl font-bold">Select Location</h1>
            <p className="text-sm opacity-80">Choose your delivery area</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for area, street name..."
            className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        {/* Detect Location */}
        <Button
          variant="outline"
          className="w-full justify-start gap-3 py-6"
          onClick={handleDetectLocation}
          disabled={isDetecting}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Navigation className={cn("w-5 h-5 text-primary", isDetecting && "animate-pulse")} />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">
              {isDetecting ? 'Detecting...' : 'Use Current Location'}
            </p>
            <p className="text-xs text-muted-foreground">Using GPS</p>
          </div>
        </Button>

        {/* Popular Locations */}
        <div className="bg-background rounded-2xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            Popular Locations
          </h2>
          
          <div className="space-y-2">
            {filteredLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleSelectLocation(location)}
                disabled={isSaving}
                className={cn(
                  "w-full p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between",
                  selectedLocation === location.name
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{location.name}</p>
                    <p className="text-xs text-muted-foreground">{location.area}</p>
                  </div>
                </div>
                {selectedLocation === location.name && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No locations found for "{searchQuery}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Location;
