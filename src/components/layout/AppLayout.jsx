import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, Bookmark, Grid3X3, PenSquare, Menu, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

const NAV_ITEMS = [
  { path: '/Home', label: 'Home', icon: Home },
  { path: '/Categories', label: 'Topics', icon: Grid3X3 },
  { path: '/Search', label: 'Search', icon: Search },
  { path: '/Bookmarks', label: 'Saved', icon: Bookmark },
];

export default function AppLayout() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/Home" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-display font-black text-base">R</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-xl font-black text-foreground">Raising</span>
                <span className="font-display text-xl font-black text-accent">India</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path}>
                  <Button
                    variant={pathname === path ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2 rounded-full font-semibold"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              ))}
              {isAdmin && (
                <Link to="/Admin">
                  <Button
                    variant={pathname.startsWith('/Admin') ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2 rounded-full font-semibold"
                  >
                    <PenSquare className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
              )}
            </nav>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={pathname === path ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-3 rounded-full font-semibold"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            ))}
            {isAdmin && (
              <Link to="/Admin" onClick={() => setMobileOpen(false)}>
                <Button
                  variant={pathname.startsWith('/Admin') ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-3 rounded-full font-semibold"
                >
                  <PenSquare className="w-4 h-4" />
                  Admin
                </Button>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link to="/Home" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-display font-black text-base">R</span>
                </div>
                <div>
                  <span className="font-display text-xl font-black text-foreground">Raising</span>
                  <span className="font-display text-xl font-black text-accent">India</span>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your go-to resource for parenting tips, child development insights, and education advice — raising happy, healthy kids together. 🌟
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold mb-3 text-sm uppercase tracking-wider">Topics</h4>
              <div className="grid grid-cols-2 gap-2">
                {['Newborn', 'Toddler', 'Education', 'Health', 'Activities', 'Nutrition'].map(cat => (
                  <Link
                    key={cat}
                    to={`/Categories?cat=${cat.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/Search" className="block text-sm text-muted-foreground hover:text-accent transition-colors font-medium">Search Articles</Link>
                <Link to="/Bookmarks" className="block text-sm text-muted-foreground hover:text-accent transition-colors font-medium">Saved Articles</Link>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} RaisingIndia. Made with ❤️ for parents everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
}