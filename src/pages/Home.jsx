import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import BreakingNewsBanner from '@/components/news/BreakingNewsBanner';
import FeaturedArticleSection from '@/components/home/FeaturedArticleSection';
import LatestArticlesScroll from '@/components/home/LatestArticlesScroll';
import SpotlightSection from '@/components/home/SpotlightSection';
import PodcastSection from '@/components/home/PodcastSection';
import WelcomeHero from '@/components/home/WelcomeHero';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles', 'home'],
    queryFn: () => base44.entities.Article.filter({ status: 'published' }, '-published_date', 50),
  });

  const breakingArticles = articles.filter(a => a.is_breaking);
  const featuredArticle = articles.find(a => a.is_featured);
  const sideArticles = articles.filter(a => a.id !== featuredArticle?.id).slice(0, 3);
  const latestArticles = articles.filter(a => a.id !== featuredArticle?.id).slice(0, 12);

  return (
    <div className="bg-background min-h-screen">
      <BreakingNewsBanner articles={breakingArticles} />

      {!isLoading && (
        <>
          <WelcomeHero />
          <FeaturedArticleSection article={featuredArticle} sideArticles={sideArticles} />
          <LatestArticlesScroll articles={latestArticles} totalCount={articles.length} />
          <SpotlightSection recentArticles={articles.slice(0, 2)} />
          <PodcastSection featuredArticle={featuredArticle} />
        </>
      )}

      {isLoading && (
        <div className="space-y-8">
          {/* Hero skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-40 rounded-full" />
              </div>
              <Skeleton className="aspect-[4/5] rounded-3xl" />
            </div>
          </div>
          {/* Articles skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border overflow-hidden">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}