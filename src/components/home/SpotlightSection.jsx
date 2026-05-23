import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sun } from 'lucide-react';
import SpotlightSubmitModal from './SpotlightSubmitModal';
import { Link } from 'react-router-dom';

export default function SpotlightSection({ recentArticles = [] }) {
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);

  const { data: spotlightItems = [] } = useQuery({
    queryKey: ['spotlight-featured'],
    queryFn: () => base44.entities.SpotlightItem.filter({ is_featured: true, status: 'approved' }, '-created_date', 10),
  });

  const current = spotlightItems[spotlightIndex];

  const prev = () => setSpotlightIndex((i) => (i - 1 + spotlightItems.length) % spotlightItems.length);
  const next = () => setSpotlightIndex((i) => (i + 1) % spotlightItems.length);

  const blogArticles = recentArticles.slice(0, 2);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spotlight Card */}
        <div className="bg-secondary border-2 border-border rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-accent" />
              <h3 className="font-display font-black text-lg">Spotlight</h3>
            </div>
            {spotlightItems.length > 1 && (
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={prev}>
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={next}>
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-4">
            {current ? (
              <Link to={`/SpotlightDetail?id=${current.id}`} className="flex flex-col items-center group w-full">
                {current.image_url && (
                  <div className="w-48 h-48 rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-shadow">
                    <img src={current.image_url} alt={current.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <p className="font-display font-black text-center text-base group-hover:text-accent transition-colors">"{current.title}"</p>
                <p className="text-sm text-muted-foreground mt-1 font-semibold text-center">
                  By {current.author_name}
                  {current.author_age && current.author_age > 0 ? `, Age ${current.author_age}` : ''}
                  {current.author_city ? `, ${current.author_city}` : ''}
                </p>
                <span className="text-xs font-bold text-accent mt-2 group-hover:underline">View Details →</span>
              </Link>
            ) : (
              <div className="text-center py-8 px-2">
                <div className="text-5xl mb-3">🌟</div>
                <p className="font-display font-bold text-sm">No submissions yet</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">
                  Be the first to share your child's work — drawings, stories, poems, projects.
                </p>
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowSubmit(true)}
            className="mt-4 w-full bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl"
          >
            ✏️ Submit Your Work
          </Button>
        </div>

        {/* From the Blog */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-accent font-black text-sm">—</span>
            <h3 className="font-display font-black text-lg">From the Blog</h3>
          </div>
          {blogArticles.map((article) => (
            <Link key={article.id} to={`/Article?id=${article.id}`} className="group flex gap-4 bg-white border-2 border-border rounded-2xl p-4 hover:border-accent/30 hover:shadow-md transition-all">
              {article.cover_image && (
                <div className="w-24 h-20 rounded-xl overflow-hidden flex-none">
                  <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="flex flex-col justify-between min-w-0">
                <div>
                  <span className="text-xs font-black text-accent uppercase tracking-wide">{article.category}</span>
                  <h4 className="font-display font-bold text-sm leading-snug mt-0.5 line-clamp-2 group-hover:text-accent transition-colors">
                    {article.title}
                  </h4>
                  {article.summary && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  )}
                </div>
                <span className="text-xs font-bold text-accent mt-2 group-hover:underline">Read Post →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showSubmit && <SpotlightSubmitModal onClose={() => setShowSubmit(false)} />}
    </section>
  );
}