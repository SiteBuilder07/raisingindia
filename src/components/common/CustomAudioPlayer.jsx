/**
 * Branded audio player that matches the RaisingIndia card design:
 * - Orange circular play/pause button
 * - Branded progress bar (orange fill on cream track)
 * - Live current-time / total-duration display read from the actual file
 *
 * The displayed duration always comes from the loaded audio so it can never
 * disagree with the file's true length.
 */
import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

function formatTime(seconds) {
  if (!seconds || !Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function CustomAudioPlayer({ src, onDurationLoaded }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrent(audio.currentTime);
    const onLoaded = () => {
      setDuration(audio.duration);
      if (onDurationLoaded && Number.isFinite(audio.duration)) {
        onDurationLoaded(audio.duration);
      }
    };
    const onEnd = () => setPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnd);
    };
  }, [onDurationLoaded]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const onSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = (e.target.value / 100) * duration;
    setCurrent(audio.currentTime);
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-4 bg-secondary rounded-2xl p-4">
      <button
        type="button"
        onClick={toggle}
        className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-md shadow-accent/30 hover:bg-accent/90 transition-colors shrink-0"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={onSeek}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border focus:outline-none"
          style={{
            background: `linear-gradient(to right, hsl(var(--accent)) 0%, hsl(var(--accent)) ${progress}%, hsl(var(--border)) ${progress}%, hsl(var(--border)) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs font-bold text-muted-foreground mt-1.5 tabular-nums">
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}