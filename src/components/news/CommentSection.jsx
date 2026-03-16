import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function CommentSection({ articleId }) {
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => base44.entities.Comment.filter({ article_id: articleId, is_approved: true }, '-created_date'),
  });

  const addComment = useMutation({
    mutationFn: (data) => base44.entities.Comment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      setContent('');
      toast.success('Comment posted!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    addComment.mutate({
      article_id: articleId,
      content: content.trim(),
      author_name: user?.full_name || 'Anonymous',
      author_email: user?.email || '',
      is_approved: true,
    });
  };

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5" />
        <h3 className="font-display text-xl font-bold">
          Comments ({comments.length})
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-3 min-h-[100px]"
        />
        <Button type="submit" disabled={addComment.isPending || !content.trim()} className="gap-2">
          <Send className="w-4 h-4" />
          Post Comment
        </Button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-muted/50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">{comment.author_name || 'Anonymous'}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(comment.created_date), 'MMM d, yyyy · h:mm a')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            No comments yet. Be the first to share your thoughts.
          </p>
        )}
      </div>
    </div>
  );
}