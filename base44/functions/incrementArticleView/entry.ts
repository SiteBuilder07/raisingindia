import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public endpoint: bumps an article's view counter. Readers cannot write to
// articles directly (admin-only RLS), so the increment happens server-side.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const articleId = body?.articleId;

    if (!articleId || typeof articleId !== 'string') {
      return Response.json({ error: 'articleId is required' }, { status: 400 });
    }

    const article = await base44.asServiceRole.entities.Article.get(articleId);
    if (!article || article.status !== 'published') {
      return Response.json({ error: 'Article not available' }, { status: 404 });
    }

    await base44.asServiceRole.entities.Article.update(articleId, {
      views_count: (article.views_count || 0) + 1,
    });

    return Response.json({ ok: true });
  } catch (error) {
    // Log internals server-side only; callers get a generic message.
    console.error('incrementArticleView failed:', error);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}