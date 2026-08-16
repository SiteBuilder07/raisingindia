import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { isValidEmail, normalizeEmail, cleanText } from '../../shared/validation.ts';

const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_MAX = 3;

// Public endpoint: the ONLY way comments are created. Approval is decided here,
// never by the browser, and posting is rate limited per email address.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const articleId = body?.articleId;
    const content = cleanText(body?.content, 2000);

    if (!articleId || typeof articleId !== 'string') {
      return Response.json({ error: 'articleId is required' }, { status: 400 });
    }
    if (content.length < 3) {
      return Response.json({ error: 'Please write at least a few words.' }, { status: 400 });
    }

    let user = null;
    try {
      user = await base44.auth.me();
    } catch (_e) {
      user = null;
    }

    const authorName = cleanText(user?.full_name || body?.authorName, 80);
    const authorEmail = normalizeEmail(user?.email || body?.authorEmail);

    if (!authorName) {
      return Response.json({ error: 'Please enter your name.' }, { status: 400 });
    }
    if (!isValidEmail(authorEmail)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Rate limit: at most RATE_MAX comments per email in the last few minutes.
    const recent = await base44.asServiceRole.entities.Comment.filter(
      { author_email: authorEmail },
      '-created_date',
      RATE_MAX
    );
    const cutoff = Date.now() - RATE_WINDOW_MS;
    const withinWindow = recent.filter((c) => new Date(c.created_date).getTime() > cutoff);
    if (withinWindow.length >= RATE_MAX) {
      return Response.json(
        { error: 'You are posting too quickly. Please wait a few minutes.' },
        { status: 429 }
      );
    }

    const isApproved = !!user;
    await base44.asServiceRole.entities.Comment.create({
      article_id: articleId,
      content,
      author_name: authorName,
      author_email: authorEmail,
      is_approved: isApproved,
    });

    return Response.json({ ok: true, is_approved: isApproved });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}