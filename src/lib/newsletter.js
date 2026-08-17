/**
 * Newsletter subscription helper.
 * Performs a client-side duplicate check (the Subscriber entity is admin-read
 * only, so non-admins can't query it) and records confirmed emails locally
 * so re-submits from the same browser are detected and reported.
 */
import { base44 } from '@/api/base44Client';

const STORAGE_KEY = 'subscribed_emails';

const getSubscribedEmails = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

/**
 * Subscribe an email. Returns { alreadySubscribed } when the email was
 * already recorded from this browser, so callers can show the right message
 * instead of a duplicate "welcome" success.
 */
export async function subscribeNewsletter(email, name) {
  const normalized = (email || '').trim().toLowerCase();
  if (!normalized) return { alreadySubscribed: false };

  if (getSubscribedEmails().includes(normalized)) {
    return { alreadySubscribed: true };
  }

  await base44.entities.NewsletterSubscriber.create({
    email,
    name: name || undefined,
  });

  const subscribed = getSubscribedEmails();
  subscribed.push(normalized);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribed));
  return { alreadySubscribed: false };
}