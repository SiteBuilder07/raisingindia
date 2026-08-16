/**
 * Canonical link for an article — readable slug URL when available,
 * falling back to the id-based URL for older records.
 */
export function articleUrl(article) {
  if (!article) return '/Home';
  return article.slug ? `/article/${article.slug}` : `/Article?id=${article.id}`;
}