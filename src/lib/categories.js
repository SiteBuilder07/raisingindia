/**
 * Central category definitions — single source of truth for all 8 parenting topics.
 * Import from here instead of redefining locally.
 */

export const CATEGORIES = [
  { value: 'newborn',    label: 'Newborn',    emoji: '👶', color: 'bg-pink-100 text-pink-700 border-pink-200',     textColor: 'text-pink-600' },
  { value: 'toddler',    label: 'Toddler',    emoji: '🧸', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', textColor: 'text-yellow-600' },
  { value: 'education',  label: 'Education',  emoji: '📚', color: 'bg-blue-100 text-blue-700 border-blue-200',     textColor: 'text-blue-600' },
  { value: 'health',     label: 'Health',     emoji: '💊', color: 'bg-green-100 text-green-700 border-green-200',   textColor: 'text-green-600' },
  { value: 'activities', label: 'Activities', emoji: '🎨', color: 'bg-purple-100 text-purple-700 border-purple-200', textColor: 'text-purple-600' },
  { value: 'nutrition',  label: 'Nutrition',  emoji: '🥦', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', textColor: 'text-emerald-600' },
  { value: 'teen',       label: 'Teen',       emoji: '🎒', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', textColor: 'text-indigo-600' },
  { value: 'parenting',  label: 'Parenting',  emoji: '❤️', color: 'bg-rose-100 text-rose-700 border-rose-200',     textColor: 'text-rose-600' },
];

export const CATEGORY_VALUES = CATEGORIES.map(c => c.value);

export const CATEGORY_MAP = CATEGORIES.reduce((acc, c) => {
  acc[c.value] = c;
  return acc;
}, {});

export function getCategoryMeta(value) {
  return CATEGORY_MAP[value] || { value, label: value, emoji: '📝', color: 'bg-muted text-muted-foreground border-border', textColor: 'text-muted-foreground' };
}