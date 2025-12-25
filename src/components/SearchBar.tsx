import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  variant?: 'default' | 'hero';
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search for vegetables, fruits, meat...', 
  onSearch,
  autoFocus = false,
  variant = 'default'
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleClick = () => {
    if (!onSearch) {
      navigate('/search');
    }
  };

  const suggestions = [
    'Farm-fresh tomatoes',
    'Andhra Avakaya pickle',
    'Country chicken curry cut',
    'Organic vegetables',
    'Cold pressed oil',
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl transition-all duration-200",
          variant === 'hero' 
            ? "bg-card shadow-elevated p-4 border border-border/50" 
            : "bg-secondary p-3"
        )}
        onClick={handleClick}
      >
        <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none",
            variant === 'hero' ? 'text-base' : 'text-sm'
          )}
        />
        <button
          type="button"
          className="p-1.5 rounded-full bg-primary/10 text-primary active:scale-95 transition-transform"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
