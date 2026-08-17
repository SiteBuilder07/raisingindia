import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminCommentsTab() {
  const queryClient = useQueryClient();

  const { data: comments = [] } = useQuery({
    queryKey: ['all-comments'],
    queryFn: () => base44.entities.Comment.list('-created_date', 100),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['all-comments'] });

  const approve = useMutation({
    mutationFn: (id) => base44.entities.Comment.update(id, { is_approved: true }),
    onSuccess: () => { refresh(); toast.success('Comment approved'); },
  });

  const remove = useMutation({
    mutationFn: (id) => base44.entities.Comment.delete(id),
    onSuccess: () => { refresh(); toast.success('Comment deleted'); },
  });

  const pendingCount = comments.filter(c => !c.is_approved).length;

  return (
    <div className="space-y-3">
      {pendingCount > 0 && (
        <p className="text-sm font-semibold text-muted-foreground">
          {pendingCount} comment{pendingCount === 1 ? '' : 's'} awaiting review
        </p>
      )}

      {comments.map(comment => (
        <div key={comment.id} className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-sm truncate">{comment.author_name || 'Anonymous'}</span>
              <Badge variant={comment.is_approved ? 'secondary' : 'outline'} className="text-xs shrink-0">
                {comment.is_approved ? 'Live' : 'Pending'}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(comment.created_date), 'MMM d, yyyy')}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-3">{comment.content}</p>

          <div className="flex gap-2">
            {!comment.is_approved && (
              <Button size="sm" className="gap-1" onClick={() => approve.mutate(comment.id)}>
                <Check className="w-3 h-3" /> Approve
              </Button>
            )}
            <Button size="sm" variant="outline" className="gap-1 text-destructive" onClick={() => remove.mutate(comment.id)}>
              <Trash2 className="w-3 h-3" /> Delete
            </Button>
          </div>
        </div>
      ))}

      {comments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No comments yet.</div>
      )}
    </div>
  );
}