import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { articleUrl } from '@/lib/articleUrl';

export default function BlogColumn({ fallbackArticles = [] }) {
  const { data: blogPicks = [] } = useQuery({
    queryKey: ['blog-picks'],
    queryFn: () => base44.entities.Article.filter({ status: 'published', is_blog: true }, '-published_date', 4),
  });

  const blogArticles = blogPicks.length > 0 ? blogPicks : fallbackArticles.slice(0, 2);

  if (blogArticles.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-accent font-black text-sm">—</span>
        <h3 className="font-display font-black text-lg">From the Blog</h3>
      </div>
      {blogArticles.map((article) => (
        <Link key={article.id} to={articleUrl(article)} className="group flex gap-4 bg-white border-2 border-border rounded-2xl p-4 hover:border-accent/30 hover:shadow-md transition-all">
          {article.cover_image && (
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-none">
              <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          )}
          <div className="flex flex-col justify-between min-w-0">
            <div>
              <span className="text-xs font-black text-accent uppercase tracking-wide">{article.category}</span>
              <h4 className="font-display font-bold text-sm leading-snug mt-0.5 group-hover:text-accent transition-colors">
                {article.title}
              </h4>
              {article.summary && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              )}
            </div>
            <span className="text-xs font-bold text-accent mt-2 group-hover:underline">Read Post →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}