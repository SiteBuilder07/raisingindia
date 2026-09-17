import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Admin-only: aggregates ArticleView records server-side and returns a compact
// { articleId: count } map, so admin pages don't download thousands of
// individual view records client-side.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const views = await base44.asServiceRole.entities.ArticleView.list('-created_date', 10000);
    const counts: Record<string, number> = {};
    for (let i = 0; i < views.length; i++) {
      const id = views[i].article_id;
      counts[id] = (counts[id] || 0) + 1;
    }

    return Response.json({ counts });
  } catch (error) {
    console.error('getArticleViewCounts failed:', error);
    return Response.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}