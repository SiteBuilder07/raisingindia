import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Star } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useArticleViews } from '@/hooks/useArticleViews';

export default function AdminArticlesTab({ onEdit }) {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const { viewsOf } = useArticleViews();

  const { data: articles = [] } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list('-created_date', 100),
  });

  const deleteArticle = useMutation({
    mutationFn: (id) => base44.entities.Article.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article deleted');
    },
  });

  const toggleFeatured = async (article) => {
    try {
      // Only unfeature others when featuring this one (not when unfeaturing)
      if (!article.is_featured) {
        const currently = articles.filter(a => a.is_featured && a.id !== article.id);
        await Promise.all(currently.map(a => base44.entities.Article.update(a.id, { is_featured: false })));
      }
      await base44.entities.Article.update(article.id, { is_featured: !article.is_featured });
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success(article.is_featured ? 'Removed from featured' : 'Set as featured article');
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  const articleToDelete = articles.find(a => a.id === deleteId);

  return (
    <div className="space-y-3">
      {articles.map(article => (
        <div key={article.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                {article.status}
              </Badge>
              <Badge variant="outline" className="text-xs">{article.category}</Badge>
              {article.is_featured && <Badge className="bg-accent text-accent-foreground text-xs border-0">Featured</Badge>}
            </div>
            <h3 className="font-semibold truncate">{article.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {viewsOf(article)} views · {article.created_date && format(new Date(article.created_date), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => toggleFeatured(article)} title="Set as featured">
              <Star className={`w-4 h-4 ${article.is_featured ? 'fill-accent text-accent' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(article)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(article.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
      {articles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No articles yet. Create your first one!
        </div>
      )}

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => { deleteArticle.mutate(deleteId); setDeleteId(null); }}
        title="Delete this article?"
        description={articleToDelete ? `"${articleToDelete.title}" will be permanently removed.` : 'This action cannot be undone.'}
      />
    </div>
  );
}