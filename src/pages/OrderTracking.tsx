import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MessageCircle, MapPin, Clock, Package,
  CheckCircle2, Truck, ChefHat, Home, Navigation, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useOrders } from '@/hooks/useOrders';

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const storeIcon = new L.DivIcon({
  html: `<div style="background:#22c55e;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const customerIcon = new L.DivIcon({
  html: `<div style="background:#ef4444;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const driverIcon = new L.DivIcon({
  html: `<div style="background:hsl(142,76%,36%);width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.4);animation:pulse 2s infinite">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8c-.1.3-.1.5-.1.8V16c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    </svg>
  </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Animated driver marker component
const AnimatedDriver: React.FC<{ route: [number, number][], startIndex: number }> = ({ route, startIndex }) => {
  const map = useMap();
  const [position, setPosition] = useState<[number, number]>(route[startIndex]);

  useEffect(() => {
    let step = startIndex;
    let animFrame: number;
    const animate = () => {
      if (step < route.length - 1) {
        step += 0.005;
        const idx = Math.min(Math.floor(step), route.length - 2);
        const t = step - idx;
        const lat = route[idx][0] + t * (route[idx + 1][0] - route[idx][0]);
        const lng = route[idx][1] + t * (route[idx + 1][1] - route[idx][1]);
        setPosition([lat, lng]);
        animFrame = requestAnimationFrame(animate);
      }
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [route, startIndex]);

  return <Marker position={position} icon={driverIcon}><Popup>🚗 Driver is here</Popup></Marker>;
};

const OrderTracking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getOrderById } = useOrders();
  const [eta, setEta] = useState(12);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then(data => setOrderData(data));
    }
  }, [orderId]);

  const driver = {
    name: orderData?.order?.driver_name || 'Ravi Kumar',
    phone: orderData?.order?.driver_phone || '+91 98765 43210',
    rating: 4.8,
    trips: 1250,
    vehicle: 'Two Wheeler',
    vehicleNumber: 'TS 09 AB 1234',
  };

  const orderNumber = orderData?.order?.order_number || 'ORD-XXXXXXXX';
  const status = orderData?.order?.status || 'out_for_delivery';

  const orderSteps = [
    { label: 'Order Placed', time: '10:30 AM', completed: ['pending','confirmed','preparing','out_for_delivery','delivered'].includes(status), icon: Package },
    { label: 'Confirmed', time: '10:32 AM', completed: ['confirmed','preparing','out_for_delivery','delivered'].includes(status), icon: CheckCircle2 },
    { label: 'Preparing', time: '10:35 AM', completed: ['preparing','out_for_delivery','delivered'].includes(status), icon: ChefHat },
    { label: 'Out for Delivery', time: '10:45 AM', completed: ['out_for_delivery','delivered'].includes(status), current: status === 'out_for_delivery', icon: Truck },
    { label: 'Delivered', time: '', completed: status === 'delivered', icon: Home },
  ];

  // Simulated route (Hyderabad area) - lat/lng format for Leaflet
  const routeCoordinates: [number, number][] = [
    [17.3850, 78.4867], // Store
    [17.3900, 78.4800],
    [17.3950, 78.4750],
    [17.4000, 78.4700],
    [17.4050, 78.4650], // Customer
  ];

  const center: [number, number] = [17.3950, 78.4750];

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
            <p className="text-sm text-muted-foreground font-mono">{orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">ETA</p>
            <p className="font-bold text-primary text-lg">{eta} min</p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="relative flex-1 min-h-[300px]">
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        `}</style>
        <MapContainer 
          center={center} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Route line */}
          <Polyline 
            positions={routeCoordinates} 
            pathOptions={{ color: '#22c55e', weight: 4, dashArray: '10, 6' }} 
          />
          {/* Store marker */}
          <Marker position={routeCoordinates[0]} icon={storeIcon}>
            <Popup>🏪 Store</Popup>
          </Marker>
          {/* Customer marker */}
          <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={customerIcon}>
            <Popup>📍 Your Location</Popup>
          </Marker>
          {/* Animated driver */}
          <AnimatedDriver route={routeCoordinates} startIndex={2} />
        </MapContainer>

        {/* ETA Overlay */}
        <div className="absolute top-4 left-4 right-4 z-[1000] bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border">
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
            <a href={`tel:${driver.phone}`} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Phone className="w-5 h-5" />
            </a>
            <button onClick={() => navigate('/chat')} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
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
                      {step.time && step.completed && (
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
                {orderData?.order?.delivery_address || '123, Green Valley Apartments, Jubilee Hills, Hyderabad - 500033'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
