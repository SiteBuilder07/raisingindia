/**
 * Branded circular author avatar.
 * Falls back to a clean orange-on-cream silhouette when no photo is available
 * — never just a bare letter.
 */
import { User } from 'lucide-react';

const SIZE_CLASSES = {
  xs: 'w-7 h-7',
  sm: 'w-9 h-9',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

const ICON_SIZE = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-9 h-9',
};

export default function AuthorAvatar({ name, src, size = 'md', className = '' }) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const iconClass = ICON_SIZE[size] || ICON_SIZE.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Author'}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-accent/20 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center bg-gradient-to-br from-accent/15 to-accent/5 ring-2 ring-accent/20 text-accent ${className}`}
      aria-label={name || 'Author'}
    >
      <User className={iconClass} />
    </div>
  );
}