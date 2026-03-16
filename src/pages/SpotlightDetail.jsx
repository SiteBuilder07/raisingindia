import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, User, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SpotlightDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const navigate = useNavigate();

  const { data: item, isLoading } = useQuery({
    queryKey: ['spotlight', id],
    queryFn: () => base44.entities.SpotlightItem.filter({ id }),
    enabled: !!id,
    select: (data) => data[0],
  });

  const { data: others = [] } = useQuery({
    queryKey: ['spotlight-featured'],
    queryFn: () => base44.entities.SpotlightItem.filter({ is_featured: true, status: 'approved' }, '-created_date', 10),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🌟</div>
        <h2 className="font-display text-2xl font-bold mb-2">Item not found</h2>
        <Button onClick={() => navigate('/Home')}>← Back to Home</Button>
      </div>
    );
  }

  const otherItems = others.filter(o => o.id !== item.id).slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 mb-6 -ml-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <div className="bg-white border-2 border-border rounded-3xl overflow-hidden shadow-lg mb-8">
        {item.image_url && (
          <div className="w-full max-h-96 overflow-hidden">
            <img src={item.image_url} alt={item.title} className="w-full h-full object-contain bg-sky-50" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
            <Badge className="bg-sky-100 text-sky-700 border-sky-200 font-bold">Spotlight</Badge>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-black mb-4">"{item.title}"</h1>

          <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground font-semibold">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" /> {item.author_name}
              {item.author_age ? `, Age ${item.author_age}` : ''}
            </span>
            {item.author_city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {item.author_city}
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-muted-foreground leading-relaxed text-base bg-sky-50 rounded-2xl p-4">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* More Spotlight */}
      {otherItems.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-black mb-4">More from the Spotlight 🌟</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherItems.map(o => (
              <Link key={o.id} to={`/SpotlightDetail?id=${o.id}`}>
                <div className="bg-white border-2 border-border rounded-2xl overflow-hidden hover:border-sky-300 hover:shadow-md transition-all group">
                  {o.image_url ? (
                    <div className="aspect-square overflow-hidden bg-sky-50">
                      <img src={o.image_url} alt={o.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="aspect-square bg-sky-50 flex items-center justify-center text-4xl">🌟</div>
                  )}
                  <div className="p-3">
                    <p className="font-bold text-xs truncate">"{o.title}"</p>
                    <p className="text-xs text-muted-foreground truncate">by {o.author_name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}