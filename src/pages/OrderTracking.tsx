import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MessageCircle, MapPin, Clock, Package,
  CheckCircle2, Truck, ChefHat, Home, Navigation, Star, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const OrderTracking: React.FC = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const driverMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [eta, setEta] = useState(12);

  const orderId = 'OPN' + Math.random().toString(36).substring(2, 10).toUpperCase();

  const driver = {
    name: 'Ravi Kumar',
    phone: '+91 98765 43210',
    rating: 4.8,
    trips: 1250,
    vehicle: 'Two Wheeler',
    vehicleNumber: 'TS 09 AB 1234',
  };

  const orderSteps = [
    { label: 'Order Placed', time: '10:30 AM', completed: true, icon: Package },
    { label: 'Preparing', time: '10:35 AM', completed: true, icon: ChefHat },
    { label: 'Out for Delivery', time: '10:45 AM', completed: true, current: true, icon: Truck },
    { label: 'Delivered', time: '', completed: false, icon: Home },
  ];

  // Simulated route coordinates (Hyderabad area)
  const routeCoordinates: [number, number][] = [
    [78.4867, 17.3850], // Store
    [78.4800, 17.3900],
    [78.4750, 17.3950],
    [78.4700, 17.4000],
    [78.4650, 17.4050], // Customer
  ];

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [78.4750, 17.3950],
      zoom: 14,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Add route line
      map.current?.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
        },
      });

      map.current?.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#22c55e',
          'line-width': 4,
          'line-dasharray': [2, 1],
        },
      });

      // Store marker
      new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat(routeCoordinates[0])
        .setPopup(new mapboxgl.Popup().setHTML('<b>Store</b>'))
        .addTo(map.current!);

      // Customer marker
      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(routeCoordinates[routeCoordinates.length - 1])
        .setPopup(new mapboxgl.Popup().setHTML('<b>Your Location</b>'))
        .addTo(map.current!);

      // Driver marker (animated)
      const el = document.createElement('div');
      el.className = 'driver-marker';
      el.innerHTML = `
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8c-.1.3-.1.5-.1.8V16c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
      `;

      driverMarker.current = new mapboxgl.Marker(el)
        .setLngLat(routeCoordinates[2])
        .addTo(map.current!);

      // Animate driver
      let step = 2;
      const animateDriver = () => {
        if (step < routeCoordinates.length - 1) {
          step += 0.02;
          const index = Math.min(Math.floor(step), routeCoordinates.length - 2);
          const t = step - index;
          const lng = routeCoordinates[index][0] + t * (routeCoordinates[index + 1][0] - routeCoordinates[index][0]);
          const lat = routeCoordinates[index][1] + t * (routeCoordinates[index + 1][1] - routeCoordinates[index][1]);
          driverMarker.current?.setLngLat([lng, lat]);
          requestAnimationFrame(animateDriver);
        }
      };
      animateDriver();
    });

    setShowTokenInput(false);
  };

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setEta(prev => Math.max(0, prev - 1));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background sticky top-0 z-50 border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="font-heading text-lg font-bold text-foreground">Track Order</h1>
            <p className="text-sm text-muted-foreground font-mono">{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">ETA</p>
            <p className="font-bold text-primary text-lg">{eta} min</p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="relative flex-1 min-h-[300px]">
        {showTokenInput ? (
          <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center p-6 z-10">
            <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Enter Mapbox Token</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              To view live tracking, enter your Mapbox public token
            </p>
            <input
              type="text"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="pk.eyJ1..."
              className="w-full max-w-sm px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary mb-3"
            />
            <Button onClick={initializeMap} disabled={!mapboxToken} className="w-full max-w-sm">
              Enable Live Tracking
            </Button>
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary mt-3 hover:underline"
            >
              Get your free token at mapbox.com
            </a>
          </div>
        ) : null}
        
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* ETA Overlay */}
        {!showTokenInput && (
          <div className="absolute top-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Navigation className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Arriving in {eta} minutes</p>
                <p className="text-sm text-muted-foreground">Driver is on the way</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      <div className="bg-background rounded-t-3xl shadow-elevated border-t border-border p-6 space-y-5 -mt-4 relative z-20">
        {/* Driver Info */}
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-xl">
            {driver.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">{driver.name}</p>
              <span className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {driver.rating}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{driver.vehicle} • {driver.vehicleNumber}</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Phone className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Order Progress */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Order Status</h3>
          <div className="relative">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
            <div className="space-y-3">
              {orderSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 relative">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center z-10",
                    step.completed 
                      ? step.current 
                        ? "bg-primary text-primary-foreground animate-pulse" 
                        : "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "font-medium",
                        step.current ? "text-primary" : step.completed ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </p>
                      {step.time && (
                        <span className="text-xs text-muted-foreground">{step.time}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Delivery Address</p>
              <p className="text-sm text-muted-foreground mt-1">
                123, Green Valley Apartments, Jubilee Hills, Hyderabad - 500033
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
