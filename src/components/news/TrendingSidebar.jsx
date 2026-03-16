import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function TrendingSidebar({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-white border-2 border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">🔥</span>
        <h3 className="font-display font-black text-lg">Trending Now</h3>
      </div>
      <div className="space-y-5">
        {articles.map((article, i) => (
          <Link
            key={article.id}
            to={`/Article?id=${article.id}`}
            className="group flex gap-4 items-start"
          >
            <span className="text-2xl font-display font-black text-accent/30 group-hover:text-accent transition-colors leading-none mt-0.5">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm leading-snug group-hover:text-accent transition-colors line-clamp-2">
                {article.title}
              </h4>
              <span className="text-xs text-muted-foreground mt-1 block font-semibold">
                {article.published_date && format(new Date(article.published_date), 'MMM d')}
                {article.reading_time_minutes ? ` · ${article.reading_time_minutes} min` : ''}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}