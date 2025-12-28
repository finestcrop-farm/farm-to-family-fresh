import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import BottomNav from '@/components/BottomNav';
import { categories } from '@/data/categories';

const Categories: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-xl font-bold flex-1">
            All Categories
          </h1>
          <button
            onClick={() => navigate('/search')}
            className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Category count */}
        <p className="text-sm text-muted-foreground mb-4">
          {categories.length} categories to explore
        </p>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CategoryCard category={category} variant="large" />
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <p className="text-sm text-foreground font-medium mb-1">
            Can't find what you're looking for?
          </p>
          <p className="text-xs text-muted-foreground">
            Search or contact us for special requests. We deliver farm-fresh products daily.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Categories;
