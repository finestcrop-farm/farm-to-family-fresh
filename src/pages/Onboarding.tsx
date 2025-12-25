import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Leaf, Heart, Truck } from 'lucide-react';
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
    { code: 'en' as Language, name: 'English', native: 'English' },
    { code: 'hi' as Language, name: 'Hindi', native: 'हिंदी' },
    { code: 'te' as Language, name: 'Telugu', native: 'తెలుగు' },
  ];

  const features = [
    {
      icon: Leaf,
      title: 'Farm Fresh',
      description: 'Directly from farms to your doorstep',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Heart,
      title: 'Pure & Natural',
      description: 'No chemicals, only pure goodness',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same day delivery to your home',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
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
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {step === 0 && (
          <div className="w-full max-w-sm animate-fade-in">
            {/* Logo */}
            <div className="text-center mb-10">
              <img 
                src={logoImg} 
                alt="Our Pure Naturals" 
                className="w-56 h-auto mx-auto mb-4"
              />
            </div>

            {/* Features */}
            <div className="space-y-3 mb-10">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card border border-border/50 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", feature.bgColor)}>
                    <feature.icon className={cn("w-6 h-6", feature.color)} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="w-full max-w-sm animate-fade-in">
            <div className="text-center mb-8">
              <img 
                src={logoImg} 
                alt="Our Pure Naturals" 
                className="w-32 h-auto mx-auto mb-4"
              />
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Choose Your Language
              </h2>
              <p className="text-muted-foreground">
                Select your preferred language
              </p>
            </div>

            <div className="space-y-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-200 active:scale-[0.98]",
                    selectedLang === lang.code
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold",
                      selectedLang === lang.code
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    )}>
                      {lang.native.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{lang.native}</p>
                      <p className="text-sm text-muted-foreground">{lang.name}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedLang === lang.code
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}>
                    {selectedLang === lang.code && (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Delivery Location
              </h2>
              <p className="text-muted-foreground">
                Enter your area or pincode
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
                  className="w-full pl-12 pr-4 py-4 bg-card border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <button className="w-full p-4 rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 flex items-center justify-center gap-2 text-accent font-medium active:scale-[0.98] transition-transform">
                <MapPin className="w-5 h-5" />
                Use Current Location
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6">
        <Button
          variant="hero"
          size="xl"
          onClick={handleContinue}
          className="w-full"
        >
          {step === 2 ? 'Start Shopping' : 'Continue'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>

        {step === 2 && (
          <button
            onClick={() => {
              completeOnboarding();
              navigate('/');
            }}
            className="w-full mt-3 text-muted-foreground text-sm font-medium"
          >
            Skip for now
          </button>
        )}

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === step ? "w-6 bg-primary" : "w-2 bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
