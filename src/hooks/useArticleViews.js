import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Shared hook: fetches aggregated view counts from the backend instead of
// downloading thousands of ArticleView records. viewsOf(article) = legacy
// views_count + server-aggregated ArticleView count for that article.
//
// Skips the fetch entirely for non-admins since view counts are admin-only.
export function useArticleViews(enabled = true) {
  const { data: counts = {} } = useQuery({
    queryKey: ['article-view-counts'],
    queryFn: async () => {
      const res = await base44.functions.invoke('getArticleViewCounts');
      return res.data.counts;
    },
    staleTime: 60 * 1000,
    enabled,
  });

  const viewsOf = (article) =>
    article ? (article.views_count || 0) + (counts[article.id] || 0) : 0;

  return { viewsOf, counts };
}