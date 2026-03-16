import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import ArticleCard from '@/components/news/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark } from 'lucide-react';

export default function Bookmarks() {
  const { user } = useAuth();

  const { data: bookmarks = [], isLoading: loadingBookmarks } = useQuery({
    queryKey: ['bookmarks', user?.email],
    queryFn: () => base44.entities.Bookmark.filter({ user_email: user?.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const { data: articles = [], isLoading: loadingArticles } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ status: 'published' }, '-published_date', 200),
  });

  const bookmarkedArticles = articles.filter(a => bookmarks.some(b => b.article_id === a.id));
  const isLoading = loadingBookmarks || loadingArticles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Saved Articles</h1>
      <p className="text-muted-foreground mb-8">Your reading list</p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : bookmarkedArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bookmark className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-lg">No saved articles yet</p>
          <p className="text-sm text-muted-foreground mt-1">Bookmark articles to read them later</p>
        </div>
      )}
    </div>
  );
}