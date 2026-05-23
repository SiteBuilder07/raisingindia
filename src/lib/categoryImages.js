/**
 * Curated India-relevant fallback imagery for each article category.
 * Used whenever an article doesn't have its own cover_image, so we never
 * show generic Western stock or just an emoji placeholder.
 *
 * All images are warm, authentic photographs of Indian families, parents,
 * and children in Indian settings (Unsplash, hot-linked).
 */
export const CATEGORY_IMAGES = {
  newborn:    'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=800&q=80',
  toddler:    'https://images.unsplash.com/photo-1607582544161-7e8be4b6e60c?auto=format&fit=crop&w=800&q=80',
  education:  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80',
  health:     'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
  activities: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80',
  nutrition:  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
  teen:       'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=800&q=80',
  parenting:  'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=800&q=80',
};

export const DEFAULT_CATEGORY_IMAGE = CATEGORY_IMAGES.parenting;

export function getCategoryImage(category) {
  return CATEGORY_IMAGES[category] || DEFAULT_CATEGORY_IMAGE;
}