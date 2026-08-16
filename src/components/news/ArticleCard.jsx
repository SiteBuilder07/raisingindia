import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import AuthorAvatar from '@/components/common/AuthorAvatar';
import { getCategoryImage } from '@/lib/categoryImages';
import { getCategoryMeta } from '@/lib/categories';
import { articleUrl } from '@/lib/articleUrl';

export default function ArticleCard({ article, variant = 'default' }) {
  const isFeatured = variant === 'featured';
  const meta = getCategoryMeta(article.category);

  return (
    <Link to={articleUrl(article)} className={`group block ${isFeatured ? '' : 'h-full'}`}>
      <article className={`h-full overflow-hidden rounded-2xl border-2 border-border bg-white transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 hover:border-accent/30 ${isFeatured ? 'md:grid md:grid-cols-2' : 'flex flex-col'}`}>

        {/* Image */}
        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]'}`}>
          <img
            src={article.cover_image || getCategoryImage(article.category)}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
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
            <div className="flex items-center gap-2 min-w-0">
              {article.author_name && (
                <>
                  <AuthorAvatar name={article.author_name} src={article.author_avatar} size="xs" />
                  <span className="font-bold text-foreground truncate">{article.author_name}</span>
                </>
              )}
              {article.reading_time_minutes && (
                <span className="flex items-center gap-1 font-semibold whitespace-nowrap">
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