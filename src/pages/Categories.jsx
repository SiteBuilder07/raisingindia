import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ArticleCard from '@/components/news/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORIES = [
  { value: 'newborn', label: 'Newborn', emoji: '👶', color: 'bg-pink-100 text-pink-600 border-pink-200' },
  { value: 'toddler', label: 'Toddler', emoji: '🧸', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
  { value: 'education', label: 'Education', emoji: '📚', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { value: 'health', label: 'Health', emoji: '💊', color: 'bg-green-100 text-green-600 border-green-200' },
  { value: 'activities', label: 'Activities', emoji: '🎨', color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { value: 'nutrition', label: 'Nutrition', emoji: '🥦', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  { value: 'teen', label: 'Teen', emoji: '🎒', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  { value: 'parenting', label: 'Parenting', emoji: '❤️', color: 'bg-rose-100 text-rose-600 border-rose-200' },
];

export default function Categories() {
  const urlParams = new URLSearchParams(window.location.search);
  const [selected, setSelected] = useState(urlParams.get('cat') || null);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ status: 'published' }, '-published_date', 100),
  });

  const filtered = selected ? articles.filter(a => a.category === selected) : articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-black mb-2">Browse Topics 📖</h1>
        <p className="text-muted-foreground font-medium">Find articles tailored to your parenting journey</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {CATEGORIES.map(({ value, label, emoji, color }) => {
          const count = articles.filter(a => a.category === value).length;
          const isActive = selected === value;
          return (
            <button
              key={value}
              onClick={() => setSelected(isActive ? null : value)}
              className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 border-2 ${
                isActive ? 'ring-2 ring-accent ring-offset-2 scale-[1.02]' : 'hover:scale-[1.01]'
              } ${color} bg-opacity-30`}
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <h3 className="font-display font-bold text-sm">{label}</h3>
              <p className="text-xs opacity-70 mt-0.5 font-semibold">{count} {count === 1 ? 'article' : 'articles'}</p>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">
          {selected ? `${CATEGORIES.find(c => c.value === selected)?.emoji} ${CATEGORIES.find(c => c.value === selected)?.label}` : 'All Articles'}
        </h2>
        <span className="text-sm text-muted-foreground font-semibold">{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}</span>
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
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-muted-foreground font-semibold">No articles in this topic yet.</p>
        </div>
      )}
    </div>
  );
}