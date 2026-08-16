import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public endpoint: serves sitemap.xml for all published articles.
// Pass the public site origin as ?baseUrl=https://yoursite.com (or a
// { baseUrl } payload); falls back to the request origin.
const xmlEscape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// Only accept a well-formed http(s) URL, and use its origin only — anything
// else (paths, injected markup, other schemes) is discarded.
const safeOrigin = (candidate: unknown, fallback: string) => {
  if (typeof candidate !== 'string' || !candidate.trim()) return fallback;
  try {
    const parsed = new URL(candidate.trim());
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return fallback;
    return parsed.origin;
  } catch (_e) {
    return fallback;
  }
};

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const baseUrl = safeOrigin(body?.baseUrl || url.searchParams.get('baseUrl'), url.origin);

    const articles = await base44.asServiceRole.entities.Article.filter(
      { status: 'published' },
      '-published_date',
      1000
    );

    const staticPaths = ['/Home', '/Categories', '/Podcasts', '/Newsletter', '/About', '/Contact', '/Privacy', '/Terms'];

    const urls = [
      ...staticPaths.map((p) => `  <url><loc>${xmlEscape(`${baseUrl}${p}`)}</loc></url>`),
      ...articles.map((a) => {
        const loc = a.slug ? `${baseUrl}/article/${a.slug}` : `${baseUrl}/Article?id=${a.id}`;
        const lastmod = a.published_date || a.updated_date;
        return `  <url><loc>${xmlEscape(loc)}</loc>${lastmod ? `<lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : ''}</url>`;
      }),
    ].join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  } catch (error) {
    // Log internals server-side only; callers get a generic message.
    console.error('sitemap failed:', error);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}