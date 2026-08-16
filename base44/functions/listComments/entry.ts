import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public endpoint: returns approved comments for an article WITHOUT the
// commenter email addresses, which stay admin-only.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const articleId = body?.articleId;

    if (!articleId || typeof articleId !== 'string') {
      return Response.json({ error: 'articleId is required' }, { status: 400 });
    }

    const comments = await base44.asServiceRole.entities.Comment.filter(
      { article_id: articleId, is_approved: true },
      '-created_date',
      200
    );

    return Response.json({
      comments: comments.map((c) => ({
        id: c.id,
        author_name: c.author_name,
        content: c.content,
        created_date: c.created_date,
      })),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}