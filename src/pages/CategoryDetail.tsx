import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, Search, Grid, List, X, ChevronDown, Check } from 'lucide-react';
import { getCategoryById } from '@/data/categories';
import { getProductsByCategory, getProductsBySubcategory } from '@/data/products';
import { dietaryFilters } from '@/data/dietaryFilters';
import { productDietaryTags } from '@/data/dietaryFilters';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { DietaryTag } from '@/types';

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDietaryFilters, setSelectedDietaryFilters] = useState<DietaryTag[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

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

  const baseProducts = selectedSubcategory
    ? getProductsBySubcategory(category.id, selectedSubcategory)
    : getProductsByCategory(category.id);

  // Apply dietary filters
  const filteredProducts = useMemo(() => {
    let result = baseProducts;
    
    // Filter by dietary tags
    if (selectedDietaryFilters.length > 0) {
      result = result.filter(product => {
        const productTags = productDietaryTags[product.id] || [];
        return selectedDietaryFilters.some(filter => productTags.includes(filter));
      });
    }
    
    // Filter by price range
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Sort
    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result = [...result].reverse();
        break;
    }
    
    return result;
  }, [baseProducts, selectedDietaryFilters, sortBy, priceRange]);

  const toggleDietaryFilter = (tag: DietaryTag) => {
    setSelectedDietaryFilters(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedDietaryFilters([]);
    setPriceRange([0, 1000]);
    setSortBy('relevance');
  };

  const activeFilterCount = selectedDietaryFilters.length + (sortBy !== 'relevance' ? 1 : 0);

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
                {filteredProducts.length} products available
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
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all relative">
                  <SlidersHorizontal className="w-5 h-5" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
                <SheetHeader className="pb-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="font-heading">Filters & Sort</SheetTitle>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-primary font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </SheetHeader>
                
                <div className="py-4 space-y-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                  {/* Sort Options */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Sort By</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'relevance', label: 'Relevance' },
                        { id: 'price-low', label: 'Price: Low to High' },
                        { id: 'price-high', label: 'Price: High to Low' },
                        { id: 'rating', label: 'Top Rated' },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSortBy(option.id as SortOption)}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
                            sortBy === option.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border hover:border-primary/50"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Filters */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Dietary Preferences</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {dietaryFilters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => toggleDietaryFilter(filter.id)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-xl text-left transition-all border",
                            selectedDietaryFilters.includes(filter.id)
                              ? "bg-primary/10 text-primary border-primary"
                              : "bg-card text-foreground border-border hover:border-primary/50"
                          )}
                        >
                          <span className="text-lg">{filter.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{filter.name}</p>
                          </div>
                          {selectedDietaryFilters.includes(filter.id) && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold active:scale-[0.98] transition-all"
                  >
                    Show {filteredProducts.length} Products
                  </button>
                </div>
              </SheetContent>
            </Sheet>
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

      {/* Active Filters */}
      {selectedDietaryFilters.length > 0 && (
        <div className="px-4 py-2 bg-card border-b border-border">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-xs text-muted-foreground flex-shrink-0">Filters:</span>
            {selectedDietaryFilters.map((filter) => {
              const filterData = dietaryFilters.find(f => f.id === filter);
              return (
                <button
                  key={filter}
                  onClick={() => toggleDietaryFilter(filter)}
                  className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium flex-shrink-0"
                >
                  <span>{filterData?.icon}</span>
                  {filterData?.name}
                  <X className="w-3 h-3 ml-1" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* View toggle */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} items
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
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-3" : "space-y-3"}>
            {filteredProducts.map((product, index) => (
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
              No products found
            </h3>
            <p className="text-sm text-muted-foreground max-w-[240px] mb-4">
              {selectedDietaryFilters.length > 0 
                ? "Try removing some filters to see more products"
                : "Products in this category are coming soon. Check back later!"}
            </p>
            {selectedDietaryFilters.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default CategoryDetail;