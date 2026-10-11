import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { isValidEmail, normalizeEmail, cleanText } from '../../shared/validation.ts';
import { isAllowedOrigin } from '../../shared/originCheck.ts';
import { getClientIp } from '../../shared/clientIp.ts';

// Public endpoint: the ONLY way subscribers are created. The subscriber list
// itself is admin-only, so de-duplication happens here.
export default async function (req: Request): Promise<Response> {
  try {
    if (!isAllowedOrigin(req)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const email = normalizeEmail(body?.email);
    const name = cleanText(body?.name, 80);

    if (!isValidEmail(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Per-IP rate limit to prevent scripted mass-subscription of third-party
    // addresses. Mirrors the throttling pattern used in postComment.
    const clientIp = getClientIp(req);
    const SUB_RATE_WINDOW_MS = 60 * 60 * 1000;
    const SUB_RATE_MAX = 5;
    const recentSubs = await base44.asServiceRole.entities.NewsletterSubscriber.filter(
      { client_ip: clientIp },
      '-created_date',
      SUB_RATE_MAX
    );
    const subCutoff = Date.now() - SUB_RATE_WINDOW_MS;
    const withinSubWindow = recentSubs.filter((s) => new Date(s.created_date).getTime() > subCutoff);
    if (withinSubWindow.length >= SUB_RATE_MAX) {
      return Response.json(
        { error: 'Too many subscriptions from this network. Please try again later.' },
        { status: 429 }
      );
    }

    const existing = await base44.asServiceRole.entities.NewsletterSubscriber.filter({ email }, '-created_date', 1);

    if (existing.length > 0) {
      const current = existing[0];
      if (!current.is_active || (name && !current.name)) {
        await base44.asServiceRole.entities.NewsletterSubscriber.update(current.id, {
          is_active: true,
          name: name || current.name,
        });
      }
      return Response.json({ ok: true, already_subscribed: true });
    }

    await base44.asServiceRole.entities.NewsletterSubscriber.create({ email, name, is_active: true, client_ip: clientIp });
    return Response.json({ ok: true, already_subscribed: false });
  } catch (error) {
    // Log internals server-side only; callers get a generic message.
    console.error('subscribeNewsletter failed:', error);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}