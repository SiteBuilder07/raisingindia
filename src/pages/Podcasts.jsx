import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Headphones, Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

export default function Podcasts() {
  const { data: podcasts = [], isLoading } = useQuery({
    queryKey: ['podcasts'],
    queryFn: () => base44.entities.Podcast.list('-published_date', 50),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center">
          <Headphones className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-black">The Kids Voice Podcast</h1>
          <p className="text-muted-foreground text-sm font-semibold">All Episodes</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {podcasts.map((ep) => (
            <Link key={ep.id} to={`/PodcastEpisode?id=${ep.id}`} className="block">
            <div className="bg-white border-2 border-border rounded-2xl p-5 flex gap-5 items-start hover:border-accent/30 hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-none bg-accent/10 flex items-center justify-center">
                {ep.cover_image ? (
                  <img src={ep.cover_image} alt={ep.title} className="w-full h-full object-cover" />
                ) : (
                  <Play className="w-6 h-6 text-accent fill-accent" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {ep.is_latest && (
                    <span className="text-xs font-black bg-accent text-white px-2 py-0.5 rounded-full">NEW</span>
                  )}
                  {ep.episode_number && (
                    <span className="text-xs text-muted-foreground font-bold">Ep. {ep.episode_number}</span>
                  )}
                  {ep.duration && (
                    <span className="text-xs text-muted-foreground font-bold">· {ep.duration}</span>
                  )}
                </div>
                <h3 className="font-display font-bold text-base leading-snug mb-1 group-hover:text-accent transition-colors">{ep.title}</h3>
                {ep.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{ep.description}</p>
                )}
                <span className="text-xs font-bold text-accent mt-2 block group-hover:underline">Listen now →</span>
              </div>
            </div>
            </Link>
          ))}
          {podcasts.length === 0 && (
            <div className="text-center py-16">
              <Headphones className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-semibold">No episodes yet. Check back soon!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}