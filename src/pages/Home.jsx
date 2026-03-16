import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import BreakingNewsBanner from '@/components/news/BreakingNewsBanner';
import FeaturedArticleSection from '@/components/home/FeaturedArticleSection';
import LatestArticlesScroll from '@/components/home/LatestArticlesScroll';
import SpotlightSection from '@/components/home/SpotlightSection';
import PodcastSection from '@/components/home/PodcastSection';

export default function Home() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
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
          <FeaturedArticleSection article={featuredArticle} sideArticles={sideArticles} />
          <LatestArticlesScroll articles={latestArticles} />
          <SpotlightSection recentArticles={articles.slice(0, 4)} />
          <PodcastSection featuredArticle={featuredArticle} />
        </>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}