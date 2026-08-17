import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import AuthorAvatar from '@/components/common/AuthorAvatar';

export default function CommentSection({ articleId }) {
  const [content, setContent] = useState('');
  const { user, navigateToLogin } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => base44.entities.Comment.filter({ article_id: articleId, is_approved: true }, '-created_date', 200),
    enabled: !!articleId,
  });

  const addComment = useMutation({
    mutationFn: (data) => base44.entities.Comment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      setContent('');
      toast.success('Thanks! Your comment is awaiting moderation.');
      base44.analytics.track({ eventName: 'comment_post', properties: { article_id: articleId } });
    },
    onError: () => {
      toast.error('Could not post your comment. Please try again.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (trimmed.length < 3) {
      toast.error('Please write at least a few words.');
      return;
    }
    if (trimmed.length > 2000) {
      toast.error('Comments must be under 2000 characters.');
      return;
    }
    addComment.mutate({
      article_id: articleId,
      content: trimmed,
      author_name: user?.full_name || 'Reader',
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

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 bg-secondary/40 border border-border rounded-2xl p-5 space-y-3">
          <div>
            <Textarea
              placeholder="Share your thoughts…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
              maxLength={2000}
              required
            />
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-muted-foreground font-medium">
              Your comment will be reviewed before it appears.
            </p>
            <Button
              type="submit"
              disabled={addComment.isPending || !content.trim()}
              className="gap-2 rounded-full font-bold"
            >
              <Send className="w-4 h-4" />
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 bg-secondary/40 border border-border rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to join the conversation and share your thoughts.
          </p>
          <Button onClick={navigateToLogin} className="gap-2 rounded-full font-bold">
            <LogIn className="w-4 h-4" />
            Sign in to comment
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <AuthorAvatar name={comment.author_name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight">{comment.author_name || 'Reader'}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(comment.created_date), 'MMM d, yyyy · h:mm a')}
                </p>
              </div>
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