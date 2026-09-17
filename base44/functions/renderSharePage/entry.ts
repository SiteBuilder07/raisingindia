import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public endpoint: serves a standalone HTML page with the correct social media
// meta tags for any published article. Social crawlers read the meta tags and
// render a preview card; human visitors are redirected to the real article.
const SITE_ORIGIN = 'https://raisingindia.net';

const escapeHtml = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);

    // Social crawlers send GET requests with the slug as a query param.
    // SDK invocations pass it in the body.
    let slug = url.searchParams.get('slug');
    if (!slug) {
      const body = await req.json().catch(() => ({}));
      slug = body?.slug;
    }

    if (!slug || typeof slug !== 'string') {
      return new Response('Missing slug parameter', { status: 400 });
    }

    const matches = await base44.asServiceRole.entities.Article.filter({ slug }, '-published_date', 1);
    const article = matches[0];

    if (!article || article.status !== 'published') {
      return new Response('Article not found', { status: 404 });
    }

    const title = escapeHtml(article.title || 'RaisingIndia');
    const description = escapeHtml((article.summary || '').slice(0, 300));
    const image = escapeHtml(article.cover_image || '');
    const articleUrl = `${SITE_ORIGIN}/article/${encodeURIComponent(slug)}`;
    const shareUrl = `${SITE_ORIGIN}/functions/renderSharePage?slug=${encodeURIComponent(slug)}`;

    const imageTags = image
      ? `<meta property="og:image" content="${image}">\n  <meta name="twitter:image" content="${image}">`
      : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${shareUrl}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  ${imageTags}
  <meta property="og:url" content="${shareUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta http-equiv="refresh" content="0;url=${articleUrl}">
</head>
<body>
  <noscript>
    <p>This article has moved. <a href="${articleUrl}">Continue reading on RaisingIndia</a>.</p>
  </noscript>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('renderSharePage failed:', error);
    return Response.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}