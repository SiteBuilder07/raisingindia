import { Button } from '@/components/ui/button';

const CATEGORIES = [
  { value: 'all', label: '✨ All' },
  { value: 'newborn', label: '👶 Newborn' },
  { value: 'toddler', label: '🧸 Toddler' },
  { value: 'education', label: '📚 Education' },
  { value: 'health', label: '💊 Health' },
  { value: 'activities', label: '🎨 Activities' },
  { value: 'nutrition', label: '🥦 Nutrition' },
  { value: 'teen', label: '🎒 Teen' },
  { value: 'parenting', label: '❤️ Parenting' },
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
          className={`rounded-full whitespace-nowrap text-xs font-bold ${
            active === value
              ? 'bg-accent text-white border-accent hover:bg-accent/90'
              : 'border-border hover:border-accent hover:text-accent'
          }`}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}