import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { isAllowedOrigin } from '../../shared/originCheck.ts';
import { getClientIp } from '../../shared/clientIp.ts';

// Public endpoint: bumps an article's view counter. Readers cannot write to
// articles directly (admin-only RLS), so the increment happens server-side.
// A server-side per-IP-per-article-per-day dedupe record prevents scripted
// view-count inflation — the browser's localStorage dedupe is bypassable by
// any script that sends a direct HTTP request.
export default async function (req: Request): Promise<Response> {
  try {
    if (!isAllowedOrigin(req)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
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

    // Per-IP-per-article-per-day dedupe: each IP can increment a given article
    // at most once per day. An attacker can no longer loop requests to inflate
    // a single article's counter to arbitrary values.
    const ip = getClientIp(req);
    const today = new Date().toISOString().slice(0, 10);
    const dedupeKey = `view:${ip}:${articleId}:${today}`;

    const existing = await base44.asServiceRole.entities.ArticleView.filter(
      { article_id: articleId, description: dedupeKey },
      '-created_date',
      1
    );
    if (existing.length > 0) {
      return Response.json({ ok: true });
    }

    await base44.asServiceRole.entities.ArticleView.create({
      article_id: articleId,
      description: dedupeKey,
    });
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