import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { articleUrl } from '@/lib/articleUrl';

const SESSION_KEY = 'suggested-read-dismissed';
const DELAY_MS = 4000;

export default function SuggestedReadPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { data: suggested = [] } = useQuery({
    queryKey: ['suggested-reads'],
    queryFn: () => base44.entities.Article.filter({ status: 'published', is_suggested_read: true }, '-published_date', 20),
  });

  // Pick a random suggested article once on mount
  const [picked, setPicked] = useState(null);
  useEffect(() => {
    if (suggested.length > 0 && !picked) {
      setPicked(suggested[Math.floor(Math.random() * suggested.length)]);
    }
  }, [suggested, picked]);

  // Show after delay, unless already dismissed this session
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setDismissed(true);
      return;
    }
    if (!picked) return;
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [picked]);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem(SESSION_KEY, '1');
  };

  if (dismissed || !picked) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, x: 8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 24, x: 8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-5 right-5 z-50 max-w-xs"
        >
          <div className="relative bg-white border-2 border-border rounded-2xl shadow-xl overflow-hidden">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <Link to={articleUrl(picked)} onClick={handleClose} className="flex gap-3 p-3 pr-8">
              {picked.cover_image && (
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-none">
                  <img src={picked.cover_image} alt={picked.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-[10px] font-black text-accent uppercase tracking-wide">Suggested Read</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{picked.category.replace(/_/g, ' ')}</span>
                <h4 className="font-display font-bold text-sm leading-snug mt-0.5 line-clamp-2">
                  {picked.title}
                </h4>
                <span className="text-xs font-bold text-accent mt-1">Read now →</span>
              </div>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}