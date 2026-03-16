import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ArticleCard from '@/components/news/ArticleCard';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = useState('');

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ status: 'published' }, '-published_date', 100),
  });

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles.filter(a =>
      a.title?.toLowerCase().includes(q) ||
      a.summary?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q) ||
      a.author_name?.toLowerCase().includes(q) ||
      a.tags?.some(t => t.toLowerCase().includes(q))
    );
  }, [query, articles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Search</h1>
      <p className="text-muted-foreground mb-8">Find articles across all topics</p>

      <div className="relative max-w-xl mb-10">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search articles, topics, authors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-12 text-base rounded-xl"
          autoFocus
        />
      </div>

      {query.trim() && (
        <p className="text-sm text-muted-foreground mb-6">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : query.trim() ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No results found</p>
          <p className="text-sm text-muted-foreground mt-1">Try different keywords</p>
        </div>
      ) : (
        <div className="text-center py-16">
          <SearchIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Start typing to search articles</p>
        </div>
      )}
    </div>
  );
}