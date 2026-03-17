import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Play, Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function PodcastSection({ featuredArticle }) {
  const [playing, setPlaying] = useState(false);

  const { data: podcasts = [] } = useQuery({
    queryKey: ['podcasts-latest'],
    queryFn: () => base44.entities.Podcast.list('-published_date', 1),
  });

  const podcast = podcasts[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Podcast Player */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white flex flex-col min-h-[280px]">
          {/* Video preview or cover */}
          {podcast?.video_url ? (
            <video
              src={podcast.video_url}
              className="w-full aspect-video object-cover"
              muted
              preload="metadata"
            />
          ) : podcast?.cover_image ? (
            <div className="relative aspect-video overflow-hidden">
              <img src={podcast.cover_image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Video className="w-12 h-12 text-white/60" />
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center">
              <Video className="w-16 h-16 text-gray-600" />
            </div>
          )}

          <div className="p-6 flex flex-col flex-1 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-4 h-4 text-accent" />
                <span className="text-xs font-black uppercase tracking-widest text-accent">Latest Video Episode</span>
              </div>
              <h3 className="font-display font-black text-xl leading-tight mb-1">
                {podcast?.title || 'The Kids Voice Podcast'}
              </h3>
              {podcast?.episode_number && (
                <p className="text-gray-400 text-xs font-bold">
                  Episode {podcast.episode_number}{podcast.duration ? ` · ${podcast.duration}` : ''}
                </p>
              )}
            </div>
            {podcast && (
              <Link to={`/PodcastEpisode?id=${podcast.id}`} className="mt-4 inline-flex items-center gap-2 bg-accent text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-accent/90 transition-colors w-fit shadow-lg shadow-accent/30">
                <Play className="w-4 h-4 fill-white" /> Watch Episode
              </Link>
            )}
          </div>
        </div>

        {/* Featured Interview / Quote */}
        {featuredArticle ? (
          <div className="bg-white border-2 border-border rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
                  🎙️ THE INTERVIEW
                </span>
              </div>
              <blockquote className="font-display text-2xl font-black leading-tight text-foreground mb-4">
                "{featuredArticle.summary?.slice(0, 80) || featuredArticle.title}"
              </blockquote>
              {featuredArticle.author_name && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                    {featuredArticle.author_name[0]}
                  </div>
                  <p className="text-sm text-muted-foreground font-semibold">{featuredArticle.author_name}</p>
                </div>
              )}
            </div>
            <Link to={`/Article?id=${featuredArticle.id}`}>
              <Button className="bg-accent/10 text-accent hover:bg-accent hover:text-white font-bold rounded-full gap-2 transition-all">
                Read the Interview <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-accent/5 border-2 border-accent/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <Video className="w-12 h-12 text-accent/30 mb-4" />
            <p className="text-muted-foreground font-semibold">More video episodes coming soon!</p>
            <Link to="/Categories" className="mt-4">
              <Button variant="outline" className="rounded-full font-bold gap-2">
                Browse Articles <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {podcasts.length > 0 && (
        <div className="flex justify-center mt-6">
          <Link to="/Podcasts">
            <Button variant="outline" className="rounded-full font-bold gap-2 border-2">
              See More Episodes <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}