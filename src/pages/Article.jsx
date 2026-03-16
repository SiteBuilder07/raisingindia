import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Eye, Bookmark, BookmarkCheck, Share2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import CommentSection from '@/components/news/CommentSection';
import NewsletterSignup from '@/components/news/NewsletterSignup';

export default function Article() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [viewCounted, setViewCounted] = useState(false);

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => base44.entities.Article.filter({ id: articleId }).then(r => r[0]),
    enabled: !!articleId,
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks', user?.email],
    queryFn: () => base44.entities.Bookmark.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  const isBookmarked = bookmarks.some(b => b.article_id === articleId);

  const toggleBookmark = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        const bm = bookmarks.find(b => b.article_id === articleId);
        if (bm) await base44.entities.Bookmark.delete(bm.id);
      } else {
        await base44.entities.Bookmark.create({ article_id: articleId, user_email: user?.email });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success(isBookmarked ? 'Removed from saved' : 'Saved for later');
    },
  });

  // Count view
  useEffect(() => {
    if (article && !viewCounted) {
      base44.entities.Article.update(article.id, { views_count: (article.views_count || 0) + 1 });
      setViewCounted(true);
    }
  }, [article, viewCounted]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: article.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
        <div className="space-y-3">
          {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-muted-foreground">Article not found.</p>
        <Link to="/Home"><Button variant="outline" className="mt-4">Go Home</Button></Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link to="/Home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4">
        <Badge variant="outline" className="text-xs">{article.category}</Badge>
        {article.published_date && (
          <span className="text-sm text-muted-foreground">
            {format(new Date(article.published_date), 'MMMM d, yyyy')}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        {article.title}
      </h1>

      {/* Summary */}
      {article.summary && (
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">{article.summary}</p>
      )}

      {/* Author & Actions */}
      <div className="flex items-center justify-between py-4 border-y border-border mb-8">
        <div className="flex items-center gap-3">
          {article.author_avatar ? (
            <img src={article.author_avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
              {article.author_name?.[0] || '?'}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">{article.author_name || 'Staff Writer'}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {article.reading_time_minutes && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.reading_time_minutes} min read</span>
              )}
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.views_count || 0} views</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => toggleBookmark.mutate()}>
            {isBookmarked ? <BookmarkCheck className="w-5 h-5 text-accent" /> : <Bookmark className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      {article.cover_image && (
        <img
          src={article.cover_image}
          alt={article.title}
          className="w-full rounded-2xl mb-8 aspect-[16/9] object-cover"
        />
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-accent prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: article.content || '' }}
      />

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
          {article.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
          ))}
        </div>
      )}

      {/* Comments */}
      <CommentSection articleId={articleId} />

      {/* Newsletter */}
      <div className="mt-12">
        <NewsletterSignup />
      </div>
    </article>
  );
}