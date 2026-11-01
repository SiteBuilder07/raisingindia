import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Returns the HTML stored in a private file for articles too large to keep in
// the Article record. Access mirrors the Article read rules: published
// articles are public, everything else is admin only.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const articleId = body?.article_id;

    if (!articleId || typeof articleId !== 'string') {
      return Response.json({ error: 'article_id is required' }, { status: 400 });
    }

    const article = await base44.asServiceRole.entities.Article.get(articleId)
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!article || !article.content_file_uri) {
      return Response.json({ error: 'This article has no stored content.' }, { status: 404 });
    }

    if (article.status !== 'published') {
      const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
      if (user?.role !== 'admin') {
        return Response.json({ error: 'Not found' }, { status: 404 });
      }
    }

    // The file URI is read from the record, never from the caller, so this
    // endpoint cannot be used to read arbitrary private files.
    const { signed_url } = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
      file_uri: article.content_file_uri,
      expires_in: 300,
    });
    const fileRes = await fetch(signed_url, { signal: AbortSignal.timeout(15000) });
    if (!fileRes.ok) {
      throw new Error(`Stored content could not be read (${fileRes.status})`);
    }

    return Response.json({ content: await fileRes.text() });
  } catch (error) {
    console.error('getArticleContent failed:', error);
    return Response.json({ error: 'This article could not be loaded. Please try again.' }, { status: 500 });
  }
}