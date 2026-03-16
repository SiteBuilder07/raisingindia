import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Play, Headphones, ArrowRight } from 'lucide-react';
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
        {/* Podcast Player */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white p-8 flex flex-col justify-between min-h-[280px]">
          {podcast?.cover_image && (
            <div className="absolute inset-0">
              <img src={podcast.cover_image} alt="" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
            </div>
          )}
          {!podcast?.cover_image && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
          )}

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Headphones className="w-4 h-4 text-accent" />
              <span className="text-xs font-black uppercase tracking-widest text-accent">New Episode</span>
            </div>
            <h3 className="font-display font-black text-2xl leading-tight mb-2">
              {podcast?.title || 'The Kids Voice Podcast'}
            </h3>
            {podcast?.episode_number && (
              <p className="text-gray-400 text-xs font-bold mb-2">
                Episode {podcast.episode_number}
                {podcast.duration ? ` · ${podcast.duration}` : ''}
              </p>
            )}
            {podcast?.description && (
              <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                {podcast.description}
              </p>
            )}
          </div>

          <div className="relative z-10 mt-6 flex items-center justify-between">
            <button
              onClick={() => setPlaying(!playing)}
              className="w-14 h-14 rounded-full bg-accent flex items-center justify-center hover:bg-accent/90 transition-colors shadow-lg shadow-accent/30"
            >
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </button>

            {podcast?.audio_url && (
              <div className="flex-1 ml-4">
                <audio
                  controls
                  src={podcast.audio_url}
                  className="w-full h-8 opacity-70 hover:opacity-100 transition-opacity"
                  style={{ filter: 'invert(1)' }}
                />
              </div>
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
            <Headphones className="w-12 h-12 text-accent/30 mb-4" />
            <p className="text-muted-foreground font-semibold">More podcast episodes coming soon!</p>
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