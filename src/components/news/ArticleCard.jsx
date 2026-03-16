import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const CATEGORY_META = {
  newborn:   { emoji: '👶', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  toddler:   { emoji: '🧸', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  education: { emoji: '📚', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  health:    { emoji: '💊', color: 'bg-green-100 text-green-700 border-green-200' },
  activities:{ emoji: '🎨', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  nutrition: { emoji: '🥦', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  teen:      { emoji: '🎒', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  parenting: { emoji: '❤️', color: 'bg-rose-100 text-rose-700 border-rose-200' },
};

export default function ArticleCard({ article, variant = 'default' }) {
  const isFeatured = variant === 'featured';
  const meta = CATEGORY_META[article.category] || { emoji: '📝', color: 'bg-muted text-muted-foreground border-border' };

  return (
    <Link to={`/Article?id=${article.id}`} className={`group block ${isFeatured ? '' : 'h-full'}`}>
      <article className={`h-full overflow-hidden rounded-2xl border-2 border-border bg-white transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 hover:border-accent/30 ${isFeatured ? 'md:grid md:grid-cols-2' : 'flex flex-col'}`}>

        {/* Image */}
        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]'}`}>
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-secondary flex items-center justify-center">
              <span className="text-6xl">{meta.emoji}</span>
            </div>
          )}
          {article.is_breaking && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white border-0 text-xs font-bold animate-pulse rounded-full px-3">
                🔴 BREAKING
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-1 p-5 ${isFeatured ? 'md:p-8 md:justify-center' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className={`text-xs font-bold border rounded-full px-3 ${meta.color}`}>
              {meta.emoji} {article.category}
            </Badge>
            {article.published_date && (
              <span className="text-xs text-muted-foreground font-medium">
                {format(new Date(article.published_date), 'MMM d')}
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
                <span className="font-bold text-foreground">{article.author_name}</span>
              )}
              {article.reading_time_minutes && (
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3" />
                  {article.reading_time_minutes} min
                </span>
              )}
            </div>
            {article.views_count > 0 && (
              <span className="flex items-center gap-1 font-semibold">
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