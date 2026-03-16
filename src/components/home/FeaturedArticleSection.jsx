import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORY_META = {
  newborn:    { emoji: '👶', label: 'Newborn' },
  toddler:    { emoji: '🧸', label: 'Toddler' },
  education:  { emoji: '📚', label: 'Education' },
  health:     { emoji: '💊', label: 'Health' },
  activities: { emoji: '🎨', label: 'Activities' },
  nutrition:  { emoji: '🥦', label: 'Nutrition' },
  teen:       { emoji: '🎒', label: 'Teen' },
  parenting:  { emoji: '❤️', label: 'Parenting' },
};

export default function FeaturedArticleSection({ article, sideArticles = [] }) {
  if (!article) return null;
  const meta = CATEGORY_META[article.category] || { emoji: '📝', label: article.category };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured */}
        <div className="lg:col-span-2 relative bg-white rounded-3xl overflow-hidden border-2 border-border shadow-sm group">
          {article.cover_image && (
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-6 md:p-8">
            <Badge className="mb-3 bg-accent/10 text-accent border-accent/20 rounded-full font-bold text-xs">
              {meta.emoji} FEATURED {meta.label.toUpperCase()}
            </Badge>
            <h2 className="font-display text-2xl md:text-3xl font-black leading-tight mb-3 group-hover:text-accent transition-colors">
              {article.title}
            </h2>
            {article.summary && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                {article.summary}
              </p>
            )}
            <Link
              to={`/Article?id=${article.id}`}
              className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:gap-3 transition-all"
            >
              Read full story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Side Stories */}
        <div className="bg-yellow-400 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-black uppercase tracking-widest text-yellow-900 bg-yellow-300 px-3 py-1 rounded-full">
                📰 News You Can Use
              </span>
            </div>
            <div className="space-y-4">
              {sideArticles.slice(0, 3).map((a) => (
                <Link key={a.id} to={`/Article?id=${a.id}`} className="block group">
                  <h4 className="font-display font-black text-base leading-snug group-hover:underline text-yellow-950">
                    {a.title}
                  </h4>
                  {a.summary && (
                    <p className="text-yellow-800 text-xs mt-1 line-clamp-2 font-medium leading-relaxed">
                      {a.summary}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/Categories">
            <button className="mt-6 w-full bg-yellow-950 text-white font-bold text-sm py-3 rounded-2xl hover:bg-yellow-800 transition-colors">
              Explore More Issues →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}