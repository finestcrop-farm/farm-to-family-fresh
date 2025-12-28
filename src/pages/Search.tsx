import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, X, TrendingUp, Clock, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { searchProducts, products } from '@/data/products';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(query);
  }, [query]);

  const trendingSearches = [
    'Farm-fresh tomatoes',
    'Andhra Avakaya pickle',
    'Country chicken',
    'Organic vegetables',
    'Cold pressed oil',
    'Fresh fish',
    'Gongura pickle',
    'Sona Masoori rice',
  ];

  const recentSearches = ['Milk', 'Eggs', 'Paneer', 'Onions'];

  const popularCategories = [
    { name: 'Vegetables', emoji: '🥬', color: 'bg-fresh/10' },
    { name: 'Fruits', emoji: '🍎', color: 'bg-accent/10' },
    { name: 'Meat', emoji: '🍗', color: 'bg-destructive/10' },
    { name: 'Dairy', emoji: '🥛', color: 'bg-primary/10' },
  ];

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
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for vegetables, fruits, meat..."
              autoFocus
              className="w-full pl-10 pr-10 py-3 bg-primary-foreground rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {query.trim() ? (
          // Search Results
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {results.length} results for "<span className="text-foreground font-medium">{query}</span>"
              </p>
            </div>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {results.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <SearchIcon className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                  No products found
                </h3>
                <p className="text-sm text-muted-foreground max-w-[240px]">
                  Try searching with different keywords or browse categories
                </p>
              </div>
            )}
          </>
        ) : (
          // Empty State - Show suggestions
          <>
            {/* Quick Categories */}
            <section className="mb-6">
              <h2 className="font-heading text-sm font-bold text-foreground mb-3">Quick Browse</h2>
              <div className="grid grid-cols-4 gap-2">
                {popularCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setQuery(cat.name)}
                    className={`flex flex-col items-center p-3 rounded-xl ${cat.color} active:scale-95 transition-all`}
                  >
                    <span className="text-2xl mb-1">{cat.emoji}</span>
                    <span className="text-xs font-medium text-foreground">{cat.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <h2 className="font-heading text-sm font-bold text-foreground">Recent Searches</h2>
                  </div>
                  <button className="text-xs text-primary font-medium">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setQuery(search)}
                      className="px-4 py-2 bg-card rounded-full text-sm text-foreground border border-border hover:bg-secondary active:scale-95 transition-all"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Trending Searches */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-accent" />
                <h2 className="font-heading text-sm font-bold text-foreground">Trending Searches</h2>
              </div>
              <div className="space-y-2">
                {trendingSearches.map((search, index) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="flex items-center gap-3 w-full p-3 bg-card rounded-xl border border-border/50 hover:bg-secondary active:scale-[0.99] transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground flex-1 text-left">{search}</span>
                    <Sparkles className="w-4 h-4 text-accent/50" />
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;
