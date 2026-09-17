/**
 * Newsletter subscription helper.
 * Delegates to the subscribeNewsletter backend function, which performs
 * server-side duplicate checking (the subscriber list is admin-read-only, so
 * the client cannot query it) and reactivates inactive subscribers.
 */
import { base44 } from '@/api/base44Client';

export async function subscribeNewsletter(email, name) {
  const res = await base44.functions.invoke('subscribeNewsletter', { email, name });
  return { alreadySubscribed: !!res.data.already_subscribed };
}