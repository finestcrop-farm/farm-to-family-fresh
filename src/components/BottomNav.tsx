import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Grid3X3 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItemCount } = useApp();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid3X3, label: 'Categories', path: '/categories' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: cartItemCount },
    { icon: User, label: 'Account', path: '/account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full transition-all duration-200",
                "active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon 
                  className={cn(
                    "w-6 h-6 transition-all duration-200",
                    isActive && "scale-110"
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-accent text-accent-foreground text-[10px] font-bold rounded-full px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] mt-1 font-medium transition-all duration-200",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
