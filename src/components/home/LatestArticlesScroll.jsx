import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCategoryImage } from '@/lib/categoryImages';
import { getCategoryMeta } from '@/lib/categories';
import { articleUrl } from '@/lib/articleUrl';

export default function LatestArticlesScroll({ articles, totalCount }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  if (!articles.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-display text-xl font-black">Daily Discoveries</h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            New articles and insights for curious parents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 border-2"
            onClick={() => scroll(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 border-2"
            onClick={() => scroll(1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Link
            to="/Categories"
            className="text-xs font-bold text-accent hover:underline ml-2 whitespace-nowrap"
          >
            See all {totalCount ?? articles.length} {(totalCount ?? articles.length) === 1 ? 'article' : 'articles'} →
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {articles.map((article) => {
          const meta = getCategoryMeta(article.category);
          return (
            <Link
              key={article.id}
              to={articleUrl(article)}
              className="group flex-none w-52"
            >
              <div className="rounded-2xl overflow-hidden border-2 border-border bg-white hover:shadow-lg hover:border-accent/30 transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={article.cover_image || getCategoryImage(article.category)}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <span className={`text-xs font-black uppercase tracking-wide ${meta.textColor}`}>
                    {meta.emoji} {article.category}
                  </span>
                  <h4 className="font-display font-bold text-sm leading-snug mt-1 line-clamp-2 group-hover:text-accent transition-colors">
                    {article.title}
                  </h4>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}