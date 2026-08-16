import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

export default function AdminCommentsTab() {
  const { data: comments = [] } = useQuery({
    queryKey: ['all-comments'],
    queryFn: () => base44.entities.Comment.list('-created_date', 50),
  });

  return (
    <div className="space-y-3">
      {comments.map(comment => (
        <div key={comment.id} className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">{comment.author_name || 'Anonymous'}</span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(comment.created_date), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{comment.content}</p>
        </div>
      ))}
      {comments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No comments yet.</div>
      )}
    </div>
  );
}