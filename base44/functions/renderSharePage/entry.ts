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

// Category-based fallback images (mirrors src/lib/categoryImages.js) so every
// article gets a social preview image even without its own cover_image.
const CATEGORY_IMAGES: Record<string, string> = {
  newborn:        'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=800&q=80',
  toddler:        'https://images.unsplash.com/photo-1607582544161-7e8be4b6e60c?auto=format&fit=crop&w=800&q=80',
  education:      'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80',
  health:         'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
  activities:     'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80',
  nutrition:      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
  teen:           'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=800&q=80',
  parenting:      'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=800&q=80',
  motherhood:     'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
  mental_health:  'https://images.unsplash.com/photo-1474418397763-88e81ad5e2c4?auto=format&fit=crop&w=800&q=80',
};
const DEFAULT_CATEGORY_IMAGE = CATEGORY_IMAGES.parenting;

// Strips HTML tags and collapses whitespace to derive a text summary.
const stripHtml = (html: string): string =>
  html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

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
    const description = escapeHtml(
      (article.summary || stripHtml(article.content || '')).slice(0, 300)
    );
    const image = escapeHtml(
      article.cover_image || CATEGORY_IMAGES[article.category] || DEFAULT_CATEGORY_IMAGE
    );
    const articleUrl = `${SITE_ORIGIN}/article/${encodeURIComponent(slug)}`;
    const shareUrl = `${SITE_ORIGIN}/functions/renderSharePage?slug=${encodeURIComponent(slug)}`;

    const imageTags = `<meta property="og:image" content="${image}">\n  <meta name="twitter:image" content="${image}">`;

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