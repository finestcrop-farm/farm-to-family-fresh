import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Sparkles, Grid3X3, LayoutGrid } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import BottomNav from '@/components/BottomNav';
import { categories } from '@/data/categories';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 -ml-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-xl font-bold flex-1">
            All Categories
          </h1>
          <button
            onClick={() => navigate('/search')}
            className="p-2.5 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Header with view toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <p className="text-sm text-muted-foreground font-medium">
              {categories.length} categories to explore
            </p>
          </div>
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'grid' ? "bg-background shadow-sm" : "hover:bg-background/50"
              )}
            >
              <Grid3X3 className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={() => setViewMode('large')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'large' ? "bg-background shadow-sm" : "hover:bg-background/50"
              )}
            >
              <LayoutGrid className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        <div className={cn(
          "grid gap-3",
          viewMode === 'grid' ? "grid-cols-3" : "grid-cols-2"
        )}>
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <CategoryCard 
                category={category} 
                variant={viewMode === 'grid' ? 'compact' : 'large'} 
              />
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-border">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💬</span>
            </div>
            <div>
              <p className="text-sm text-foreground font-semibold mb-1">
                Can't find what you're looking for?
              </p>
              <p className="text-xs text-muted-foreground">
                Search or contact us for special requests. We deliver farm-fresh products daily.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Categories;
