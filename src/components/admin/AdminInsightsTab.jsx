import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Eye, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { articleUrl } from '@/lib/articleUrl';

export default function AdminInsightsTab() {
  const { data: articles = [] } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list('-created_date', 100),
  });

  const published = articles.filter(a => a.status === 'published');
  const top = [...published].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 10);

  const byCategory = published.reduce((acc, a) => {
    const key = a.category || 'other';
    acc[key] = (acc[key] || 0) + (a.views_count || 0);
    return acc;
  }, {});
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxCategoryViews = categories.length ? categories[0][1] || 1 : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <h3 className="font-display font-bold flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Top performing articles
        </h3>
        {top.map((a, i) => (
          <Link
            key={a.id}
            to={articleUrl(a)}
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-accent/40 transition-colors"
          >
            <span className="w-6 text-center font-bold text-muted-foreground">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground">
                {a.category}
                {a.published_date ? ` · ${format(new Date(a.published_date), 'MMM d, yyyy')}` : ''}
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm font-bold shrink-0">
              <Eye className="w-3 h-3" /> {a.views_count || 0}
            </span>
          </Link>
        ))}
        {top.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No published articles yet.</div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-display font-bold">Views by topic</h3>
        {categories.map(([cat, views]) => (
          <div key={cat} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <Badge variant="outline" className="text-xs">{cat}</Badge>
              <span>{views}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${Math.max(4, (views / maxCategoryViews) * 100)}%` }}
              />
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">No view data yet.</p>
        )}
      </div>
    </div>
  );
}