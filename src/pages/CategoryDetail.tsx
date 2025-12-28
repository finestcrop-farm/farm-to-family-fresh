import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, Search, Grid, List } from 'lucide-react';
import { getCategoryById } from '@/data/categories';
import { getProductsByCategory, getProductsBySubcategory } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const category = getCategoryById(categoryId || '');
  
  if (!category) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <span className="text-6xl mb-4">🔍</span>
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">Category not found</h2>
        <p className="text-muted-foreground text-sm mb-4">The category you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/categories')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
        >
          Browse Categories
        </button>
      </div>
    );
  }

  const products = selectedSubcategory
    ? getProductsBySubcategory(category.id, selectedSubcategory)
    : getProductsByCategory(category.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold flex items-center gap-2">
                <span>{category.icon}</span>
                {category.name}
              </h1>
              <p className="text-xs opacity-80">
                {products.length} products available
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/search')}
              className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subcategory Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-3">
          <button
            onClick={() => setSelectedSubcategory(null)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95",
              !selectedSubcategory
                ? "bg-primary-foreground text-primary shadow-soft"
                : "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
            )}
          >
            All
          </button>
          {category.subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubcategory(sub.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 whitespace-nowrap",
                selectedSubcategory === sub.id
                  ? "bg-primary-foreground text-primary shadow-soft"
                  : "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
              )}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </header>

      {/* View toggle */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} items
        </p>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-1.5 rounded-md transition-all",
              viewMode === 'grid' ? "bg-card shadow-soft" : "hover:bg-card/50"
            )}
          >
            <Grid className={cn("w-4 h-4", viewMode === 'grid' ? "text-primary" : "text-muted-foreground")} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "p-1.5 rounded-md transition-all",
              viewMode === 'list' ? "bg-card shadow-soft" : "hover:bg-card/50"
            )}
          >
            <List className={cn("w-4 h-4", viewMode === 'list' ? "text-primary" : "text-muted-foreground")} />
          </button>
        </div>
      </div>

      <main className="px-4 py-4">
        {products.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-3" : "space-y-3"}>
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <ProductCard product={product} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-4xl">{category.icon}</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-1">
              No products yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-[240px]">
              Products in this category are coming soon. Check back later!
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default CategoryDetail;
