import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function BreakingNewsBanner({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Zap className="w-4 h-4 fill-current" />
          <span className="text-xs font-bold uppercase tracking-wider">Breaking</span>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {articles.map((a) => (
              <Link key={a.id} to={`/Article?id=${a.id}`} className="text-sm hover:underline">
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}