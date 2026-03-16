import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function TrendingSidebar({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-4 h-4 text-accent" />
        <h3 className="font-display font-bold text-lg">Trending</h3>
      </div>
      <div className="space-y-5">
        {articles.map((article, i) => (
          <Link
            key={article.id}
            to={`/Article?id=${article.id}`}
            className="group flex gap-4 items-start"
          >
            <span className="text-2xl font-display font-bold text-muted-foreground/40 group-hover:text-accent transition-colors leading-none mt-0.5">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-snug group-hover:text-accent transition-colors line-clamp-2">
                {article.title}
              </h4>
              <span className="text-xs text-muted-foreground mt-1 block">
                {article.published_date && format(new Date(article.published_date), 'MMM d')}
                {article.reading_time_minutes ? ` · ${article.reading_time_minutes} min read` : ''}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}