import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Sparkles } from 'lucide-react';
import logoImg from '@/assets/logo.png';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate content
    const contentTimer = setTimeout(() => setShowContent(true), 200);
    const taglineTimer = setTimeout(() => setShowTagline(true), 600);
    const loaderTimer = setTimeout(() => setShowLoader(true), 900);
    
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    
    // Navigate after splash
    const navTimer = setTimeout(() => {
      navigate('/welcome');
    }, 2800);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(taglineTimer);
      clearTimeout(loaderTimer);
      clearTimeout(navTimer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/90 flex flex-col items-center justify-center safe-area-top safe-area-bottom relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 right-10 w-40 h-40 bg-primary-foreground/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Floating leaves */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          >
            <Leaf 
              className="w-6 h-6 text-primary-foreground/10" 
              style={{ transform: `rotate(${i * 40}deg)` }} 
            />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-8">
        {/* Logo container with glow effect */}
        <div 
          className={`relative transition-all duration-700 ease-out ${
            showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary-foreground/30 blur-3xl rounded-full scale-150 animate-pulse" />
          
          {/* Logo card */}
          <div className="relative bg-primary-foreground rounded-3xl p-8 shadow-2xl">
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            </div>
            <img 
              src={logoImg} 
              alt="OurPureNaturals" 
              className="w-56 h-auto"
            />
          </div>
        </div>

        {/* Tagline */}
        <div 
          className={`mt-10 text-center transition-all duration-700 ease-out ${
            showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-primary-foreground text-xl font-semibold tracking-wide">
            Farm Fresh • Pure Natural
          </p>
          <p className="text-primary-foreground/70 text-sm mt-3 max-w-[280px]">
            Bringing nature's best from our farm directly to your family
          </p>
        </div>

        {/* Loading indicator */}
        <div 
          className={`mt-12 w-48 transition-all duration-500 ${
            showLoader ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress bar */}
          <div className="h-1.5 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-foreground rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-primary-foreground/60 text-xs text-center mt-3">
            Loading fresh goodness...
          </p>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-24 fill-primary-foreground/5">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>

      {/* Version badge */}
      <div className="absolute bottom-6 text-primary-foreground/40 text-xs">
        v1.0.0
      </div>
    </div>
  );
};

export default Splash;
