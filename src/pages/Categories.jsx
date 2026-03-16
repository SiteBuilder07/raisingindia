import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ArticleCard from '@/components/news/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, Cpu, Briefcase, Trophy, Heart, FlaskConical, Clapperboard, Landmark } from 'lucide-react';

const CATEGORIES = [
  { value: 'world', label: 'World', icon: Globe, color: 'bg-blue-500' },
  { value: 'technology', label: 'Technology', icon: Cpu, color: 'bg-violet-500' },
  { value: 'business', label: 'Business', icon: Briefcase, color: 'bg-emerald-500' },
  { value: 'sports', label: 'Sports', icon: Trophy, color: 'bg-orange-500' },
  { value: 'health', label: 'Health', icon: Heart, color: 'bg-rose-500' },
  { value: 'science', label: 'Science', icon: FlaskConical, color: 'bg-cyan-500' },
  { value: 'entertainment', label: 'Entertainment', icon: Clapperboard, color: 'bg-pink-500' },
  { value: 'politics', label: 'Politics', icon: Landmark, color: 'bg-amber-500' },
];

export default function Categories() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get('cat') || null;
  const [selected, setSelected] = useState(initialCat);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ status: 'published' }, '-published_date', 100),
  });

  const filtered = selected
    ? articles.filter(a => a.category === selected)
    : articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Categories</h1>
      <p className="text-muted-foreground mb-8">Browse news by topic</p>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {CATEGORIES.map(({ value, label, icon: Icon, color }) => {
          const count = articles.filter(a => a.category === value).length;
          const isActive = selected === value;
          return (
            <button
              key={value}
              onClick={() => setSelected(isActive ? null : value)}
              className={`relative overflow-hidden rounded-xl p-5 text-left transition-all duration-200 border ${
                isActive
                  ? 'border-foreground/20 bg-secondary shadow-md'
                  : 'border-border bg-card hover:border-foreground/10 hover:shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${color} bg-opacity-10 flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="font-semibold text-sm">{label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{count} articles</p>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">
          {selected ? CATEGORIES.find(c => c.value === selected)?.label : 'All Articles'}
        </h2>
        <span className="text-sm text-muted-foreground">{filtered.length} articles</span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No articles in this category yet.</p>
        </div>
      )}
    </div>
  );
}