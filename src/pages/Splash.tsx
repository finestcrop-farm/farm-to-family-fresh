import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import logoImg from '@/assets/logo.png';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    // Animate content
    const contentTimer = setTimeout(() => setShowContent(true), 300);
    const taglineTimer = setTimeout(() => setShowTagline(true), 800);
    
    // Navigate after splash
    const navTimer = setTimeout(() => {
      navigate('/welcome');
    }, 2500);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(taglineTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/90 flex flex-col items-center justify-center safe-area-top safe-area-bottom relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-primary-foreground/5 rounded-full blur-2xl" />
        
        {/* Floating leaves */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.1,
            }}
          >
            <Leaf className="w-8 h-8 text-primary-foreground" style={{ transform: `rotate(${i * 45}deg)` }} />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container with glow effect */}
        <div 
          className={`relative transition-all duration-700 ease-out ${
            showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div className="absolute inset-0 bg-primary-foreground/20 blur-3xl rounded-full scale-150" />
          <div className="relative bg-primary-foreground rounded-3xl p-6 shadow-2xl">
            <img 
              src={logoImg} 
              alt="OurPureNaturals" 
              className="w-48 h-auto"
            />
          </div>
        </div>

        {/* Tagline */}
        <div 
          className={`mt-8 text-center transition-all duration-700 ease-out delay-300 ${
            showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-primary-foreground/90 text-lg font-medium tracking-wide">
            Farm Fresh • Pure Natural
          </p>
          <p className="text-primary-foreground/70 text-sm mt-2">
            From Our Farm to Your Family
          </p>
        </div>

        {/* Loading indicator */}
        <div 
          className={`mt-12 flex items-center gap-2 transition-all duration-500 ${
            showTagline ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20 fill-primary-foreground/5">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>
    </div>
  );
};

export default Splash;
