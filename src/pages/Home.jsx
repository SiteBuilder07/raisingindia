import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ArticleCard from '@/components/news/ArticleCard';
import CategoryPills from '@/components/news/CategoryPills';
import NewsletterSignup from '@/components/news/NewsletterSignup';
import TrendingSidebar from '@/components/news/TrendingSidebar';
import BreakingNewsBanner from '@/components/news/BreakingNewsBanner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [category, setCategory] = useState('all');

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ status: 'published' }, '-published_date', 50),
  });

  const breakingArticles = articles.filter(a => a.is_breaking);
  const featuredArticle = articles.find(a => a.is_featured);
  const trendingArticles = [...articles].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5);

  const filtered = category === 'all'
    ? articles
    : articles.filter(a => a.category === category);

  const regularArticles = filtered.filter(a => a.id !== featuredArticle?.id);

  return (
    <div>
      <BreakingNewsBanner articles={breakingArticles} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Featured Article */}
        {featuredArticle && !isLoading && (
          <section className="mb-10">
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
                  <div key={i} className="rounded-2xl overflow-hidden border border-border">
                    <Skeleton className="aspect-[16/10] w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-4 w-20" />
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
                <p className="text-muted-foreground">No articles found in this category.</p>
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