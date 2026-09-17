import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import AuthorAvatar from '@/components/common/AuthorAvatar';

export default function CommentSection({ articleId }) {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetches approved comments via the backend function, which strips email
  // addresses from the response.
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: async () => {
      const res = await base44.functions.invoke('listComments', { articleId });
      return res.data.comments;
    },
    enabled: !!articleId,
  });

  const addComment = useMutation({
    mutationFn: async (data) => {
      const res = await base44.functions.invoke('postComment', data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      setContent('');
      setAuthorName('');
      setAuthorEmail('');
      if (data.is_approved) {
        toast.success('Comment posted!');
      } else {
        toast.success('Thanks! Your comment is awaiting moderation.');
      }
      base44.analytics.track({ eventName: 'comment_post', properties: { article_id: articleId } });
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || 'Could not post your comment. Please try again.';
      toast.error(msg);
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
      articleId,
      content: trimmed,
      authorName: user?.full_name || authorName.trim(),
      authorEmail: user?.email || authorEmail.trim(),
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
          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              type="text"
              placeholder="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={80}
              required
            />
            <Input
              type="email"
              placeholder="Your email (not published)"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              maxLength={120}
              required
            />
          </div>
        )}
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
            {user ? 'Your comment will appear instantly.' : 'Your comment will be reviewed before it appears.'}
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