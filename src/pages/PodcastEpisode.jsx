import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Headphones, Clock, Calendar, Video } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import CustomAudioPlayer from '@/components/common/CustomAudioPlayer';

function formatDuration(seconds) {
  if (!seconds || !Number.isFinite(seconds)) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PodcastEpisode() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const navigate = useNavigate();

  const [actualDuration, setActualDuration] = useState(null);

  const { data: episode, isLoading } = useQuery({
    queryKey: ['podcast', id],
    queryFn: () => base44.entities.Podcast.filter({ id }),
    enabled: !!id,
    select: (data) => data[0],
  });

  const { data: allEpisodes = [] } = useQuery({
    queryKey: ['podcasts-all'],
    queryFn: () => base44.entities.Podcast.list('-published_date', 20),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🎙️</div>
        <h2 className="font-display text-2xl font-bold mb-2">Episode not found</h2>
        <Button onClick={() => navigate('/Podcasts')}>← Back to Podcasts</Button>
      </div>
    );
  }

  const otherEpisodes = allEpisodes.filter(e => e.id !== episode.id).slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/Podcasts">
        <Button variant="ghost" className="gap-2 mb-6 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back to Podcasts
        </Button>
      </Link>

      <div className="bg-white border-2 border-border rounded-3xl overflow-hidden shadow-lg mb-8">
        {/* Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
          {episode.cover_image ? (
            <img
              src={episode.cover_image}
              alt={episode.title}
              className="w-36 h-36 rounded-2xl object-cover flex-none shadow-md"
            />
          ) : (
            <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-100 flex items-center justify-center flex-none shadow-md">
              <Headphones className="w-14 h-14 text-accent" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {episode.is_latest && <Badge className="bg-accent text-white border-0">🎙️ Latest Episode</Badge>}
              {episode.episode_number && (
                <Badge variant="outline" className="font-bold">Episode {episode.episode_number}</Badge>
              )}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-black mb-2">{episode.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-semibold mb-3">
              {(actualDuration || episode.duration) && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {formatDuration(actualDuration) || episode.duration}
                </span>
              )}
              {episode.published_date && (
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {format(new Date(episode.published_date), 'MMM d, yyyy')}</span>
              )}
            </div>
            {episode.description && (
              <p className="text-muted-foreground leading-relaxed">{episode.description}</p>
            )}
          </div>
        </div>

        {/* Video Player */}
        {episode.video_url && (
          <div className="px-6 md:px-8 pb-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">🎬 Watch Now</p>
            <video
              controls
              className="w-full rounded-2xl bg-black"
              src={episode.video_url}
            >
              Your browser does not support the video element.
            </video>
          </div>
        )}

        {/* Audio Player — custom branded */}
        {episode.audio_url && (
          <div className="px-6 md:px-8 pb-8">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">🎧 Listen Now</p>
            <CustomAudioPlayer src={episode.audio_url} onDurationLoaded={setActualDuration} />
          </div>
        )}

        {!episode.video_url && !episode.audio_url && (
          <div className="px-6 md:px-8 pb-8">
            <div className="bg-muted rounded-2xl p-6 text-center text-muted-foreground">
              <Video className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-sm">Video coming soon</p>
            </div>
          </div>
        )}
      </div>

      {/* More Episodes */}
      {otherEpisodes.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-black mb-4">More Episodes</h2>
          <div className="space-y-3">
            {otherEpisodes.map(ep => (
              <Link key={ep.id} to={`/PodcastEpisode?id=${ep.id}`}>
                <div className="flex gap-4 items-center bg-white border-2 border-border rounded-2xl p-4 hover:border-accent/30 hover:shadow-md transition-all group">
                  {ep.cover_image ? (
                    <img src={ep.cover_image} alt={ep.title} className="w-14 h-14 rounded-xl object-cover flex-none" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-none">
                      <Headphones className="w-6 h-6 text-accent" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {ep.episode_number && <p className="text-xs font-bold text-muted-foreground">Ep. {ep.episode_number}</p>}
                    <p className="font-bold text-sm group-hover:text-accent transition-colors truncate">{ep.title}</p>
                    {ep.duration && <p className="text-xs text-muted-foreground">{ep.duration}</p>}
                  </div>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}