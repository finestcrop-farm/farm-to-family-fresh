import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Leaf, Truck, Shield, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logoImg from '@/assets/logo.png';

const slides = [
  {
    id: 1,
    icon: Leaf,
    title: 'Farm Fresh Products',
    description: 'Directly sourced from local farms to ensure maximum freshness and quality for your family.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    gradient: 'from-primary/20 via-transparent to-transparent',
  },
  {
    id: 2,
    icon: Shield,
    title: '100% Pure & Natural',
    description: 'No chemicals, no preservatives. Only pure, organic goodness that you can trust.',
    color: 'text-fresh',
    bgColor: 'bg-fresh/10',
    gradient: 'from-fresh/20 via-transparent to-transparent',
  },
  {
    id: 3,
    icon: Truck,
    title: 'Express Delivery',
    description: 'Same-day delivery to your doorstep. Fresh products delivered within 2-4 hours.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    gradient: 'from-accent/20 via-transparent to-transparent',
  },
];

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/onboarding');
    }
  };

  const handleSkip = () => {
    navigate('/onboarding');
  };

  const slide = slides[currentSlide];
  const SlideIcon = slide.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom relative overflow-hidden">
      {/* Background gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-b opacity-50", slide.gradient)} />
      
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <img src={logoImg} alt="OurPureNaturals" className="h-10 w-auto" />
        <button
          onClick={handleSkip}
          className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Illustration area */}
        <div className="relative mb-12">
          {/* Main icon container */}
          <div className={cn(
            "w-40 h-40 rounded-[3rem] flex items-center justify-center shadow-elevated transition-all duration-500",
            slide.bgColor
          )}>
            <SlideIcon className={cn("w-20 h-20 transition-all duration-500", slide.color)} />
          </div>
          
          {/* Floating decorations */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center animate-bounce">
            <Star className="w-6 h-6 text-accent" />
          </div>
          <div className="absolute -bottom-2 -left-6 w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center animate-pulse">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Text content */}
        <div className="text-center max-w-sm animate-fade-in" key={currentSlide}>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            {slide.title}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            {slide.description}
          </p>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center gap-2 mt-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentSlide 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-muted hover:bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 space-y-4">
        <Button
          variant="hero"
          size="xl"
          onClick={handleNext}
          className="w-full group"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
        
        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 text-muted-foreground text-xs">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-trust fill-trust" />
            4.9 Rating
          </span>
          <span>•</span>
          <span>10K+ Happy Customers</span>
          <span>•</span>
          <span>100+ Products</span>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
