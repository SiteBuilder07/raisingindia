import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ArticleCard from '@/components/news/ArticleCard';
import CategoryPills from '@/components/news/CategoryPills';
import NewsletterSignup from '@/components/news/NewsletterSignup';
import TrendingSidebar from '@/components/news/TrendingSidebar';
import BreakingNewsBanner from '@/components/news/BreakingNewsBanner';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [category, setCategory] = useState('all');

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ status: 'published' }, '-published_date', 50),
  });

  const breakingArticles = articles.filter(a => a.is_breaking);
  const featuredArticle = articles.find(a => a.is_featured);
  const trendingArticles = [...articles].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5);

  const filtered = category === 'all' ? articles : articles.filter(a => a.category === category);
  const regularArticles = filtered.filter(a => a.id !== featuredArticle?.id);

  return (
    <div>
      <BreakingNewsBanner articles={breakingArticles} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-accent/10 via-yellow-50 to-pink-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🌟</span>
              <span className="text-sm font-bold text-accent uppercase tracking-widest">Welcome to</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black leading-tight mb-3">
              <span className="text-foreground">Raising</span>
              <span className="text-accent">India</span>
            </h1>
            <p className="text-muted-foreground font-semibold text-lg max-w-md leading-relaxed">
              Expert parenting tips, child development insights & education advice — all in one place. 💛
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/Categories">
              <Button size="lg" className="bg-accent text-white hover:bg-accent/90 font-bold rounded-full gap-2 shadow-lg shadow-accent/30">
                Explore Topics <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Featured Article */}
        {featuredArticle && !isLoading && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">⭐</span>
              <h2 className="font-display font-black text-lg uppercase tracking-wide text-accent">Featured</h2>
            </div>
            <ArticleCard article={featuredArticle} variant="featured" />
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <CategoryPills active={category} onChange={setCategory} />
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border-2 border-border bg-white">
                    <Skeleton className="aspect-[16/10] w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-4 w-20 rounded-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {regularArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
            {!isLoading && regularArticles.length === 0 && (
              <div className="text-center py-16">
                <span className="text-5xl">🔍</span>
                <p className="text-muted-foreground mt-3 font-semibold">No articles in this topic yet.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <TrendingSidebar articles={trendingArticles} />
            <NewsletterSignup />
          </aside>
        </div>
      </div>
    </div>
  );
}