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
import AuthorAvatar from '@/components/common/AuthorAvatar';
import { getCategoryImage } from '@/lib/categoryImages';

const CATEGORY_LABEL = {
  newborn: 'Newborn', toddler: 'Toddler', education: 'Education', health: 'Health',
  activities: 'Activities', nutrition: 'Nutrition', teen: 'Teen', parenting: 'Parenting',
};

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
      {/* Back — category-aware */}
      <Link
        to={article.category ? `/Categories?cat=${article.category}` : '/Home'}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {article.category ? CATEGORY_LABEL[article.category] || 'Topics' : 'Home'}
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
      <div className="flex items-center justify-between py-4 border-y border-border mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <AuthorAvatar name={article.author_name} src={article.author_avatar} size="md" />
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
          <Button
            variant="outline"
            onClick={() => toggleBookmark.mutate()}
            className="gap-2 rounded-full font-bold border-2"
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-accent" /> : <Bookmark className="w-4 h-4" />}
            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
          </Button>
          <Button
            onClick={handleShare}
            className="gap-2 rounded-full font-bold bg-accent text-white hover:bg-accent/90"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      <img
        src={article.cover_image || getCategoryImage(article.category)}
        alt={article.title}
        className="w-full rounded-2xl mb-8 aspect-[16/9] object-cover"
      />

      {/* Content — styled H2/H3, comfortable reading width */}
      <div
        className="article-body prose max-w-none
          prose-p:text-base prose-p:leading-[1.8] prose-p:text-foreground/90 prose-p:my-5
          prose-headings:font-display prose-headings:font-black prose-headings:text-foreground
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:leading-tight
          prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-3 prose-h3:leading-tight
          prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-2
          prose-a:text-accent prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-bold
          prose-ul:my-5 prose-ol:my-5 prose-li:my-1.5 prose-li:leading-[1.7]
          prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-secondary/60 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:font-medium
          prose-img:rounded-2xl prose-img:my-6"
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