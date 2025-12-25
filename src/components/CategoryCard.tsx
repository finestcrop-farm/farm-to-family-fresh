import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'large' | 'compact';
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, variant = 'default' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.id}`);
  };

  if (variant === 'large') {
    return (
      <button
        onClick={handleClick}
        className="flex flex-col items-center justify-center p-4 bg-card rounded-2xl shadow-card border border-border/50 aspect-square active:scale-[0.97] transition-all duration-200 hover:shadow-elevated"
      >
        <span className="text-4xl mb-3">{category.icon}</span>
        <h3 className="font-semibold text-sm text-foreground text-center leading-tight">
          {category.name}
        </h3>
        <p className="text-[10px] text-muted-foreground mt-1">
          {category.subcategories.length} categories
        </p>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className="flex flex-col items-center p-2 active:scale-[0.95] transition-all duration-200"
      >
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-1.5 shadow-card">
          <span className="text-2xl">{category.icon}</span>
        </div>
        <span className="text-[10px] font-medium text-foreground text-center leading-tight line-clamp-2 w-16">
          {category.name}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 p-3 bg-card rounded-xl shadow-card border border-border/50 w-full active:scale-[0.98] transition-all duration-200"
    >
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">{category.icon}</span>
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-sm text-foreground">{category.name}</h3>
        <p className="text-xs text-muted-foreground">
          {category.subcategories.reduce((acc, sub) => acc + sub.productCount, 0)}+ items
        </p>
      </div>
    </button>
  );
};

export default CategoryCard;
