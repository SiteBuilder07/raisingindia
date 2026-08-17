import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Star, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import AuthorEditor from './AuthorEditor';
import AuthorAvatar from '@/components/common/AuthorAvatar';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

export default function AdminAuthorsTab() {
  const queryClient = useQueryClient();
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: authors = [] } = useQuery({
    queryKey: ['admin-authors'],
    queryFn: () => base44.entities.Author.list('-created_date', 100),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-authors'] });
    queryClient.invalidateQueries({ queryKey: ['authors'] });
  };

  const deleteAuthor = async (id) => {
    await base44.entities.Author.delete(id);
    invalidate();
    toast.success('Author deleted');
  };

  const authorToDelete = authors.find(a => a.id === deleteId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-muted-foreground">Author profiles — highlight credentials to build trust</p>
        <Button size="sm" className="gap-2" onClick={() => { setEditingAuthor(null); setShowEditor(true); }}>
          <Plus className="w-4 h-4" /> New Author
        </Button>
      </div>

      {showEditor && (
        <div className="mb-4">
          <AuthorEditor
            author={editingAuthor}
            onSave={() => { setShowEditor(false); setEditingAuthor(null); invalidate(); }}
            onCancel={() => { setShowEditor(false); setEditingAuthor(null); }}
          />
        </div>
      )}

      <div className="space-y-3">
        {authors.map(author => (
          <div key={author.id} className="flex gap-4 items-center bg-card border border-border rounded-xl p-4">
            <AuthorAvatar name={author.name} src={author.avatar} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm truncate">{author.name}</p>
                {author.is_featured && <Badge className="bg-accent text-white text-xs border-0"><Star className="w-3 h-3 mr-1 fill-current" />Featured</Badge>}
              </div>
              {author.title && <p className="text-xs text-muted-foreground truncate">{author.title}</p>}
              {author.credentials && author.credentials.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">{author.credentials.length} credential{author.credentials.length === 1 ? '' : 's'}</p>
              )}
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" asChild title="View profile">
                <Link to={`/author/${author.slug}`} target="_blank"><ExternalLink className="w-4 h-4" /></Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { setEditingAuthor(author); setShowEditor(true); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteId(author.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {authors.length === 0 && !showEditor && (
          <div className="text-center py-12 text-muted-foreground">No author profiles yet. Create one to highlight credentials.</div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => { deleteAuthor(deleteId); setDeleteId(null); }}
        title="Delete this author?"
        description={authorToDelete ? `"${authorToDelete.name}"'s profile will be removed. Their articles will remain.` : 'This action cannot be undone.'}
      />
    </div>
  );
}