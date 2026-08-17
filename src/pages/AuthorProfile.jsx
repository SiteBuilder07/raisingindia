import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AuthorAvatar from '@/components/common/AuthorAvatar';
import ArticleCard from '@/components/news/ArticleCard';
import { setPageMeta, resetPageMeta } from '@/lib/seo';
import { ArrowLeft, BadgeCheck, Globe, Twitter, Linkedin, Instagram, BookOpen, Award, GraduationCap } from 'lucide-react';

export default function AuthorProfile() {
  const { slug } = useParams();

  const { data: author, isLoading } = useQuery({
    queryKey: ['author', slug],
    queryFn: async () => {
      const matches = await base44.entities.Author.filter({ slug }, '-created_date', 1);
      return matches[0] || null;
    },
    enabled: !!slug,
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['articles', 'author', author?.name],
    queryFn: () => base44.entities.Article.filter({ status: 'published' }, '-published_date', 500),
    enabled: !!author?.name,
  });

  useEffect(() => {
    if (author?.name) {
      setPageMeta({
        title: author.name,
        description: author.title || author.bio || `Articles by ${author.name} on RaisingIndia.`,
        image: author.avatar,
      });
    }
    return resetPageMeta;
  }, [author]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-5">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-muted-foreground">Author profile not found.</p>
        <Link to="/Home"><Button variant="outline" className="mt-4">Go Home</Button></Link>
      </div>
    );
  }

  const authorArticles = articles.filter(a => a.author_name === author.name);

  const socials = [
    { url: author.website_url, icon: Globe, label: 'Website' },
    { url: author.twitter_url, icon: Twitter, label: 'Twitter' },
    { url: author.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { url: author.instagram_url, icon: Instagram, label: 'Instagram' },
  ].filter(s => s.url);

  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-accent to-accent/70">
        <div className="absolute inset-0 opacity-10 text-[16rem] flex items-center justify-center leading-none select-none pointer-events-none">👩‍🏫</div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <Link to="/Home" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6 transition-colors font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <AuthorAvatar
              name={author.name}
              src={author.avatar}
              size="xl"
              className="ring-4 ring-white/40 shadow-lg"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="font-display text-3xl md:text-4xl font-black text-white">{author.name}</h1>
                <BadgeCheck className="w-6 h-6 text-white" />
              </div>
              {author.title && (
                <p className="text-white/90 font-semibold text-lg mb-3">{author.title}</p>
              )}
              {author.expertise && author.expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {author.expertise.map(tag => (
                    <span key={tag} className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {socials.length > 0 && (
                <div className="flex gap-2 mt-4 justify-center sm:justify-start">
                  {socials.map(({ url, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Bio */}
        {author.bio && (
          <section>
            <h2 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              About {author.name.split(' ')[0]}
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{author.bio}</p>
          </section>
        )}

        {/* Credentials */}
        {author.credentials && author.credentials.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Credentials & Qualifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {author.credentials.map((cred, i) => (
                <div key={i} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug pt-1">{cred}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Articles */}
        <section>
          <h2 className="font-display text-xl font-bold mb-5 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Articles by {author.name}
            {authorArticles.length > 0 && (
              <Badge variant="secondary" className="text-xs">{authorArticles.length}</Badge>
            )}
          </h2>
          {authorArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No articles published yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}