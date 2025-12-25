import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
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

  const category = getCategoryById(categoryId || '');
  
  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Category not found</p>
      </div>
    );
  }

  const products = selectedSubcategory
    ? getProductsBySubcategory(category.id, selectedSubcategory)
    : getProductsByCategory(category.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-muted active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-serif text-lg font-bold text-foreground">
                {category.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                {products.length} products
              </p>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-muted active:scale-95 transition-all">
            <SlidersHorizontal className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Subcategory Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-3">
          <button
            onClick={() => setSelectedSubcategory(null)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95",
              !selectedSubcategory
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {sub.name}
              <Badge variant="soft" className="ml-1.5 text-[10px] px-1.5">
                {sub.productCount}
              </Badge>
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product, index) => (
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
            <span className="text-5xl mb-4">{category.icon}</span>
            <h3 className="font-semibold text-foreground mb-1">
              No products yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Products in this category coming soon!
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default CategoryDetail;
