import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Leaf, Heart, Truck, Shield, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Language } from '@/types';
import { cn } from '@/lib/utils';
import logoImg from '@/assets/logo.png';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { setLanguage, completeOnboarding, setSelectedLocation } = useApp();
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [location, setLocation] = useState('');

  const languages = [
    { code: 'en' as Language, name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'hi' as Language, name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'te' as Language, name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  ];

  const features = [
    {
      icon: Leaf,
      title: 'Farm Fresh',
      description: 'Directly from farms to your doorstep',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      icon: Shield,
      title: 'Pure & Natural',
      description: 'No chemicals, only pure goodness',
      color: 'text-fresh',
      bgColor: 'bg-fresh/10',
      borderColor: 'border-fresh/20',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same day delivery to your home',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
  ];

  const handleContinue = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setLanguage(selectedLang);
      setStep(2);
    } else {
      if (location) {
        setSelectedLocation(location);
      }
      completeOnboarding();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {step === 0 && (
          <div className="w-full max-w-sm animate-fade-in">
            {/* Logo with glow */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
                <img 
                  src={logoImg} 
                  alt="Our Pure Naturals" 
                  className="w-48 h-auto mx-auto relative z-10"
                />
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <p className="text-sm text-muted-foreground font-medium">
                  From Our Farm to Your Family
                </p>
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={cn(
                    "flex items-center gap-4 p-4 bg-card rounded-2xl shadow-card border animate-slide-up",
                    feature.borderColor
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", feature.bgColor)}>
                    <feature.icon className={cn("w-7 h-7", feature.color)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-base">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <CheckCircle2 className={cn("w-5 h-5", feature.color)} />
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-trust fill-trust" />
                  <span className="font-bold text-foreground">4.9</span>
                </div>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="font-bold text-foreground">10K+</p>
                <p className="text-xs text-muted-foreground">Customers</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="font-bold text-foreground">100+</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="w-full max-w-sm animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-hero flex items-center justify-center shadow-glow">
                <span className="text-4xl">🌍</span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Choose Your Language
              </h2>
              <p className="text-muted-foreground">
                Select your preferred language
              </p>
            </div>

            <div className="space-y-3">
              {languages.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={cn(
                    "w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] animate-slide-up",
                    selectedLang === lang.code
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground">{lang.native}</p>
                    <p className="text-sm text-muted-foreground">{lang.name}</p>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedLang === lang.code
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}>
                    {selectedLang === lang.code && (
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-sm animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-accent flex items-center justify-center shadow-elevated">
                <MapPin className="w-10 h-10 text-accent-foreground" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Delivery Location
              </h2>
              <p className="text-muted-foreground">
                Where should we deliver your fresh groceries?
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter pincode or area name"
                  className="w-full pl-12 pr-4 py-4 bg-card border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <button className="w-full p-4 rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 flex items-center justify-center gap-3 text-accent font-medium active:scale-[0.98] transition-transform hover:bg-accent/10">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>Use Current Location</span>
              </button>

              {/* Popular areas */}
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-3">Popular areas</p>
                <div className="flex flex-wrap gap-2">
                  {['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai'].map((area) => (
                    <button
                      key={area}
                      onClick={() => setLocation(area)}
                      className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 relative z-10">
        <Button
          variant="hero"
          size="xl"
          onClick={handleContinue}
          className="w-full group"
        >
          {step === 2 ? 'Start Shopping' : 'Continue'}
          <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>

        {step === 2 && (
          <button
            onClick={() => {
              completeOnboarding();
              navigate('/');
            }}
            className="w-full mt-3 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        )}

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => i < step && setStep(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === step 
                  ? "w-8 bg-primary" 
                  : i < step 
                    ? "w-2 bg-primary/50 cursor-pointer hover:bg-primary/70"
                    : "w-2 bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
