import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminSubscribersTab() {
  const { data: subscribers = [] } = useQuery({
    queryKey: ['subscribers'],
    queryFn: () => base44.entities.NewsletterSubscriber.list('-created_date'),
  });

  return (
    <div className="space-y-2">
      {subscribers.map(sub => (
        <div key={sub.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
          <div>
            <p className="font-medium text-sm">{sub.email}</p>
            <p className="text-xs text-muted-foreground">
              Joined {format(new Date(sub.created_date), 'MMM d, yyyy')}
            </p>
          </div>
          <Badge variant={sub.is_active ? 'default' : 'secondary'} className="text-xs">
            {sub.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      ))}
      {subscribers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No subscribers yet.</div>
      )}
    </div>
  );
}