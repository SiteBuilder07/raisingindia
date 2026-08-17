import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Eye, Bookmark, BookmarkCheck, Share2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { setPageMeta, resetPageMeta } from '@/lib/seo';
import { toast } from 'sonner';
import CommentSection from '@/components/news/CommentSection';
import NewsletterSignup from '@/components/news/NewsletterSignup';
import AuthorAvatar from '@/components/common/AuthorAvatar';
import { getCategoryImage } from '@/lib/categoryImages';
import { getCategoryMeta } from '@/lib/categories';

export default function Article() {
  const { slug } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id');
  const { user, navigateToLogin } = useAuth();
  const queryClient = useQueryClient();
  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug || idParam],
    queryFn: async () => {
      if (slug) {
        const matches = await base44.entities.Article.filter({ slug }, '-published_date', 1);
        return matches[0] || null;
      }
      return base44.entities.Article.get(idParam);
    },
    enabled: !!(slug || idParam),
  });

  const articleId = article?.id || idParam;

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks', user?.email],
    queryFn: () => base44.entities.Bookmark.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  const isBookmarked = bookmarks.some(b => b.article_id === articleId);

  const toggleBookmark = useMutation({
    mutationFn: async () => {
      // Saving requires an account — otherwise the save would fail silently.
      if (!user?.email) {
        navigateToLogin();
        return;
      }
      if (isBookmarked) {
        const bm = bookmarks.find(b => b.article_id === articleId);
        if (bm) await base44.entities.Bookmark.delete(bm.id);
      } else {
        await base44.entities.Bookmark.create({ article_id: articleId, user_email: user?.email });
      }
    },
    onSuccess: () => {
      if (!user?.email) return;
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success(isBookmarked ? 'Removed from saved' : 'Saved for later');
      base44.analytics.track({ eventName: 'article_bookmark', properties: { article_id: articleId, action: isBookmarked ? 'remove' : 'save' } });
    },
  });

  // Per-article view records — readers can't write to Article, so views live here.
  const { data: viewRecords = [] } = useQuery({
    queryKey: ['article-views', articleId],
    queryFn: () => base44.entities.ArticleView.filter({ article_id: articleId }, '-created_date', 10000),
    enabled: !!articleId,
  });
  const totalViews = (article?.views_count || 0) + viewRecords.length;

  // One view per reader per article per day, guarded by a dated localStorage entry.
  useEffect(() => {
    if (!articleId) return;
    const key = `viewed:${articleId}`;
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(key) === today) return;
    localStorage.setItem(key, today);
    base44.entities.ArticleView.create({ article_id: articleId }).catch(() => {});
  }, [articleId]);

  // SEO — title, description and social preview tags
  useEffect(() => {
    if (article?.title) {
      setPageMeta({
        title: article.title,
        description: article.summary,
        image: article.cover_image,
      });
    }
    return resetPageMeta;
  }, [article]);

  const handleShare = async () => {
    base44.analytics.track({ eventName: 'article_share', properties: { article_id: articleId } });
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

  // Auto-estimate reading time from content if not explicitly set
  const readingTime = article.reading_time_minutes ||
    (article.content ? Math.max(1, Math.ceil(article.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length / 200)) : null);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back — category-aware */}
      <Link
        to={article.category ? `/Categories?cat=${article.category}` : '/Home'}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {article.category ? getCategoryMeta(article.category).label : 'Home'}
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
              {readingTime && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readingTime} min read</span>
              )}
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{totalViews} views</span>
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