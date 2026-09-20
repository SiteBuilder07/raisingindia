import ArticleCard from '@/components/news/ArticleCard';

export default function BlogSection({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-5">
        <h2 className="font-display text-xl font-black">From the Blog</h2>
        <p className="text-xs text-muted-foreground font-semibold mt-0.5">
          Personal stories, reflections, and ideas from our community
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 3).map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}