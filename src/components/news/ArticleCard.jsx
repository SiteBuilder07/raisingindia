import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const CATEGORY_COLORS = {
  world: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  technology: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  business: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  sports: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  health: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  science: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  entertainment: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  politics: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

export default function ArticleCard({ article, variant = 'default' }) {
  const isFeatured = variant === 'featured';

  return (
    <Link
      to={`/Article?id=${article.id}`}
      className={`group block ${isFeatured ? '' : 'h-full'}`}
    >
      <article className={`h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 ${isFeatured ? 'md:grid md:grid-cols-2' : 'flex flex-col'}`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]'}`}>
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
              <span className="font-display text-4xl text-muted-foreground/30">{article.title?.[0]}</span>
            </div>
          )}
          {article.is_breaking && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-600 text-white border-0 text-xs font-semibold animate-pulse">
                BREAKING
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-1 p-5 ${isFeatured ? 'md:p-8 md:justify-center' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className={`text-xs border ${CATEGORY_COLORS[article.category] || 'bg-muted text-muted-foreground'}`}>
              {article.category}
            </Badge>
            {article.published_date && (
              <span className="text-xs text-muted-foreground">
                {format(new Date(article.published_date), 'MMM d, yyyy')}
              </span>
            )}
          </div>

          <h3 className={`font-display font-bold leading-tight group-hover:text-accent transition-colors ${isFeatured ? 'text-2xl md:text-3xl mb-4' : 'text-lg mb-2'}`}>
            {article.title}
          </h3>

          {article.summary && (
            <p className={`text-muted-foreground leading-relaxed ${isFeatured ? 'text-base mb-6 line-clamp-3' : 'text-sm mb-4 line-clamp-2'}`}>
              {article.summary}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {article.author_name && (
                <span className="font-medium text-foreground">{article.author_name}</span>
              )}
              {article.reading_time_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.reading_time_minutes} min
                </span>
              )}
            </div>
            {article.views_count > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.views_count}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}