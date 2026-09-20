import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminSuggestedReadsTab() {
  const queryClient = useQueryClient();

  const { data: articles = [] } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list('-created_date', 100),
  });

  const published = articles.filter(a => a.status === 'published');

  const toggleSuggested = async (article) => {
    try {
      await base44.entities.Article.update(article.id, { is_suggested_read: !article.is_suggested_read });
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['suggested-reads'] });
      toast.success(article.is_suggested_read ? 'Removed from suggested reads' : 'Added to suggested reads');
    } catch {
      toast.error('Failed to update suggested read status');
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-2">
        Toggle articles to feature in the "Suggested Read" popup on the homepage. One is picked at random per visit.
      </p>
      {published.map(article => (
        <div key={article.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">{article.category.replace(/_/g, ' ')}</Badge>
              {article.is_suggested_read && <Badge className="bg-accent text-accent-foreground text-xs border-0">Suggested</Badge>}
            </div>
            <h3 className="font-semibold truncate">{article.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {article.published_date && format(new Date(article.published_date), 'MMM d, yyyy')}
            </p>
          </div>
          <Switch checked={!!article.is_suggested_read} onCheckedChange={() => toggleSuggested(article)} />
        </div>
      ))}
      {published.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No published articles yet.
        </div>
      )}
    </div>
  );
}