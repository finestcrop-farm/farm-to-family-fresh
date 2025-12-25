import React, { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { cn } from '@/lib/utils';

interface PWAInstallBannerProps {
  className?: string;
}

const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ className }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if already installed, not installable, or dismissed
  if (isInstalled || !isInstallable || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    await install();
  };

  return (
    <div className={cn(
      "fixed bottom-20 left-4 right-4 z-50 animate-slide-up",
      className
    )}>
      <div className="bg-card rounded-2xl shadow-elevated border border-border p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm mb-1">
              Install OurPureNaturals
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Add to home screen for quick access & offline browsing
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="hero"
                size="sm"
                onClick={handleInstall}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-1.5" />
                Install App
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDismissed(true)}
                className="text-muted-foreground"
              >
                Later
              </Button>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
