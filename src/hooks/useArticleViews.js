import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Shared hook: one cached fetch of the ArticleView history serves every card
// and admin row on a page. viewsOf(article) = legacy views_count + the number
// of ArticleView records for that article. Never writes to views_count.
//
// Known scaling limit: this downloads the full view history. If traffic grows
// this needs revisiting (server-side aggregation isn't available on Starter).
export function useArticleViews() {
  const { data: views = [] } = useQuery({
    queryKey: ['article-views-all'],
    queryFn: () => base44.entities.ArticleView.list('-created_date', 10000),
    staleTime: 60 * 1000,
  });

  const counts = {};
  for (let i = 0; i < views.length; i++) {
    const id = views[i].article_id;
    counts[id] = (counts[id] || 0) + 1;
  }

  const viewsOf = (article) =>
    article ? (article.views_count || 0) + (counts[article.id] || 0) : 0;

  return { viewsOf, rawViews: views, counts };
}