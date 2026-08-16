import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { isValidEmail, normalizeEmail, cleanText } from '../../shared/validation.ts';

// Public endpoint: the ONLY way subscribers are created. The subscriber list
// itself is admin-only, so de-duplication happens here.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const email = normalizeEmail(body?.email);
    const name = cleanText(body?.name, 80);

    if (!isValidEmail(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
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

    await base44.asServiceRole.entities.NewsletterSubscriber.create({ email, name, is_active: true });
    return Response.json({ ok: true, already_subscribed: false });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}