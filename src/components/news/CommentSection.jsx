import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import AuthorAvatar from '@/components/common/AuthorAvatar';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CommentSection({ articleId }) {
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => base44.entities.Comment.filter({ article_id: articleId, is_approved: true }, '-created_date'),
  });

  const addComment = useMutation({
    mutationFn: (data) => base44.entities.Comment.create(data),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      setContent('');
      if (!user) { setName(''); setEmail(''); }
      toast.success(vars.is_approved ? 'Comment posted!' : 'Thanks! Your comment is awaiting moderation.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    if (trimmedContent.length < 3) {
      toast.error('Please write at least a few words.');
      return;
    }
    if (trimmedContent.length > 2000) {
      toast.error('Comments must be under 2000 characters.');
      return;
    }

    // Logged-in users: name/email come from their account, auto-approved.
    // Anonymous users: require a name + valid email, queue for moderation.
    const authorName = user?.full_name || name.trim();
    const authorEmail = user?.email || email.trim();

    if (!user) {
      if (!authorName) {
        toast.error('Please enter your name.');
        return;
      }
      if (!EMAIL_RE.test(authorEmail)) {
        toast.error('Please enter a valid email address.');
        return;
      }
    }

    addComment.mutate({
      article_id: articleId,
      content: trimmedContent,
      author_name: authorName,
      author_email: authorEmail,
      is_approved: !!user, // moderate anonymous comments; auto-approve signed-in
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

      <form onSubmit={handleSubmit} className="mb-8 bg-secondary/40 border border-border rounded-2xl p-5 space-y-3">
        {!user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-muted-foreground">Name *</label>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-muted-foreground">Email *</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        )}
        <div>
          {!user && (
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-muted-foreground">Comment</label>
          )}
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
            {user
              ? 'Comments from registered readers are posted instantly.'
              : 'Your comment will be reviewed before it appears. Email is never shown publicly.'}
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

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <AuthorAvatar name={comment.author_name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight">{comment.author_name || 'Anonymous'}</p>
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