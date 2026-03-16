import { Button } from '@/components/ui/button';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'world', label: 'World' },
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'sports', label: 'Sports' },
  { value: 'health', label: 'Health' },
  { value: 'science', label: 'Science' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'politics', label: 'Politics' },
];

export default function CategoryPills({ active = 'all', onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map(({ value, label }) => (
        <Button
          key={value}
          variant={active === value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(value)}
          className={`rounded-full whitespace-nowrap text-xs ${active === value ? 'bg-primary text-primary-foreground' : ''}`}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}