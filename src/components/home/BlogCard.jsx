import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { getCategoryImage } from '@/lib/categoryImages';
import { getCategoryMeta } from '@/lib/categories';
import { articleUrl } from '@/lib/articleUrl';

export default function BlogCard({ article }) {
  const meta = getCategoryMeta(article.category);
  return (
    <Link to={articleUrl(article)} className="group block">
      <article className="flex gap-4 items-start bg-white border-2 border-border rounded-2xl p-3 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-0.5 hover:border-accent/30">
        <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden">
          <img
            src={article.cover_image || getCategoryImage(article.category)}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <Badge variant="outline" className={`text-xs font-bold border rounded-full px-2.5 py-0.5 w-fit mb-1.5 ${meta.color}`}>
            {meta.emoji} {article.category}
          </Badge>
          <h3 className="font-display font-bold text-sm leading-snug group-hover:text-accent transition-colors line-clamp-2">
            {article.title}
          </h3>
        </div>
      </article>
    </Link>
  );
}