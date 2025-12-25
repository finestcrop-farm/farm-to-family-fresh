import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, X, TrendingUp } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
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
    'Country chicken curry cut',
    'Organic vegetables',
    'Cold pressed groundnut oil',
    'Fresh fish',
    'Gongura pickle',
    'Sona Masoori rice',
  ];

  const recentSearches = ['Milk', 'Eggs', 'Paneer', 'Onions'];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for vegetables, fruits, meat..."
              autoFocus
              className="w-full pl-10 pr-10 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
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
            <p className="text-sm text-muted-foreground mb-4">
              {results.length} results for "{query}"
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {results.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-5xl mb-4">🔍</span>
                <h3 className="font-semibold text-foreground mb-1">
                  No products found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </>
        ) : (
          // Empty State - Show suggestions
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-foreground">Recent Searches</h2>
                  <button className="text-sm text-primary font-medium">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setQuery(search)}
                      className="px-4 py-2 bg-secondary rounded-full text-sm text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all"
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
                <h2 className="font-semibold text-foreground">Trending Searches</h2>
              </div>
              <div className="space-y-2">
                {trendingSearches.map((search, index) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="flex items-center gap-3 w-full p-3 bg-card rounded-xl border border-border/50 hover:bg-secondary active:scale-[0.99] transition-all animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">{search}</span>
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
