import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  variant?: 'default' | 'hero';
  value?: string;
  onChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search for vegetables, fruits, meat...', 
  onSearch,
  autoFocus = false,
  variant = 'default',
  value: controlledValue,
  onChange: onControlledChange,
}) => {
  const navigate = useNavigate();
  const [internalQuery, setInternalQuery] = useState('');
  
  // Support both controlled and uncontrolled modes
  const query = controlledValue !== undefined ? controlledValue : internalQuery;
  const setQuery = onControlledChange || setInternalQuery;

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
    if (!onSearch && !autoFocus) {
      navigate('/search');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery('');
  };

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
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
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