import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Sparkles, Clock } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import OfferCard from '@/components/OfferCard';
import { getActiveOffers, offerBanners } from '@/data/offers';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Offers: React.FC = () => {
  const navigate = useNavigate();
  const offers = getActiveOffers();

  const handleApplyOffer = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon ${code} copied! Apply at checkout.`);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground sticky top-0 z-50">
        <div className="flex items-center gap-4 px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading text-xl font-bold">Offers & Deals</h1>
            <p className="text-sm text-primary-foreground/80">Save more on every order</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Flash Sale Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg overflow-hidden relative">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Flash Sale
              </Badge>
            </div>
            <h2 className="text-2xl font-bold mb-1">🔥 Today's Hot Deals</h2>
            <p className="text-white/90 text-sm mb-3">Limited time offers - Don't miss out!</p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>Ends in 12:45:30</span>
            </div>
          </div>
        </div>

        {/* Offer Banners Carousel */}
        <section>
          <h2 className="font-heading text-lg font-bold text-foreground mb-3">
            Featured Deals
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            {offers.slice(0, 3).map((offer) => (
              <div key={offer.id} className="flex-shrink-0 w-[320px]">
                <OfferCard offer={offer} variant="banner" onApply={handleApplyOffer} />
              </div>
            ))}
          </div>
        </section>

        {/* All Coupons */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg font-bold text-foreground">
              All Coupons
            </h2>
            <Badge variant="outline" className="ml-auto">
              {offers.length} available
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {offers.map((offer) => (
              <OfferCard 
                key={offer.id} 
                offer={offer} 
                onApply={handleApplyOffer}
              />
            ))}
          </div>
        </section>

        {/* Category Offers */}
        <section>
          <h2 className="font-heading text-lg font-bold text-foreground mb-4">
            Category Offers
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {offerBanners.map((banner) => (
              <button
                key={banner.id}
                onClick={() => navigate(banner.ctaLink)}
                className={`${banner.backgroundColor} rounded-2xl p-4 text-left shadow-soft overflow-hidden relative`}
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
                <Badge className="bg-white/20 text-white border-0 text-[10px] mb-2">
                  {banner.badge}
                </Badge>
                <h3 className="font-semibold text-white text-sm">{banner.title}</h3>
                <p className="text-xs text-white/80 mt-1">{banner.subtitle}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Terms */}
        <div className="bg-muted/50 rounded-xl p-4">
          <h3 className="font-medium text-foreground text-sm mb-2">Terms & Conditions</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Offers cannot be combined with other promotions</li>
            <li>• Valid on selected products only</li>
            <li>• Minimum order value applies</li>
            <li>• Offers subject to availability</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Offers;
