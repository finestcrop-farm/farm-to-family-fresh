import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Heart, Dumbbell, Wheat, Leaf, Activity, Scale, Sprout, ChevronRight } from 'lucide-react';
import { dietaryFilters } from '@/data/dietaryFilters';
import { products } from '@/data/products';
import { productDietaryTags } from '@/data/dietaryFilters';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DietaryTag } from '@/types';

const iconMap: Record<string, React.ReactNode> = {
  'diabetic-friendly': <Activity className="w-5 h-5" />,
  'high-protein': <Dumbbell className="w-5 h-5" />,
  'gluten-free': <Wheat className="w-5 h-5" />,
  'low-carb': <Scale className="w-5 h-5" />,
  'heart-healthy': <Heart className="w-5 h-5" />,
  'weight-loss': <Scale className="w-5 h-5" />,
  'vegan': <Sprout className="w-5 h-5" />,
  'organic': <Leaf className="w-5 h-5" />,
};

const DietaryFilters: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<DietaryTag | null>(null);

  const filteredProducts = selectedFilter 
    ? products.filter(product => {
        const tags = productDietaryTags[product.id] || [];
        return tags.includes(selectedFilter);
      })
    : [];

  const getProductCountForFilter = (filterId: DietaryTag): number => {
    return products.filter(product => {
      const tags = productDietaryTags[product.id] || [];
      return tags.includes(filterId);
    }).length;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-hero text-primary-foreground safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading text-lg font-bold flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Diet & Health Filters
            </h1>
            <p className="text-xs opacity-80">Find foods that match your diet</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Diet Categories Grid */}
        {!selectedFilter && (
          <section>
            <h2 className="font-heading text-base font-bold text-foreground mb-3">
              Choose Your Diet Type
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {dietaryFilters.map((filter, index) => {
                const productCount = getProductCountForFilter(filter.id);
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className="relative p-4 bg-card rounded-2xl border border-border shadow-card hover:shadow-soft transition-all active:scale-[0.98] text-left animate-fade-in overflow-hidden group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full transition-all group-hover:scale-125" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 text-primary">
                        {iconMap[filter.id] || <span className="text-2xl">{filter.icon}</span>}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{filter.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{filter.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {productCount} products
                      </Badge>
                    </div>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Selected Filter Products */}
        {selectedFilter && (
          <>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedFilter(null)}
                className="flex items-center gap-2 text-primary font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Filters
              </button>
              <Badge variant="fresh">
                {filteredProducts.length} products
              </Badge>
            </div>

            {/* Filter Info */}
            <div className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {iconMap[selectedFilter] || <span className="text-2xl">{dietaryFilters.find(f => f.id === selectedFilter)?.icon}</span>}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {dietaryFilters.find(f => f.id === selectedFilter)?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {dietaryFilters.find(f => f.id === selectedFilter)?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Health Tips Section */}
        {!selectedFilter && (
          <section className="bg-gradient-to-br from-fresh/10 via-card to-primary/10 rounded-2xl p-5 border border-border">
            <h3 className="font-heading text-base font-bold text-foreground mb-3">
              🌿 Health Tips
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Millets for Diabetes', desc: 'Low GI millets help manage blood sugar levels' },
                { title: 'Protein Power', desc: 'Include dals, eggs, and lean meat for muscle health' },
                { title: 'Heart Health', desc: 'Cold-pressed oils and nuts support cardiovascular health' },
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-card/50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-fresh/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-fresh" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default DietaryFilters;