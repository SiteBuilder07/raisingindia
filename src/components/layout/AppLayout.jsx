import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, Bookmark, Grid3X3, PenSquare, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

const NAV_ITEMS = [
  { path: '/Home', label: 'Home', icon: Home },
  { path: '/Categories', label: 'Categories', icon: Grid3X3 },
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
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/Home" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm font-display">N</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight hidden sm:block">
                NewsWire
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path}>
                  <Button
                    variant={pathname === path ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
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
                    className="gap-2"
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
          <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={pathname === path ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-3"
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
                  className="w-full justify-start gap-3"
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
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link to="/Home" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm font-display">N</span>
                </div>
                <span className="font-display text-xl font-bold">NewsWire</span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your trusted source for breaking news, in-depth analysis, and stories that matter.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                {['World', 'Technology', 'Business', 'Sports', 'Health', 'Science'].map(cat => (
                  <Link
                    key={cat}
                    to={`/Categories?cat=${cat.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/Search" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Search</Link>
                <Link to="/Bookmarks" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Saved Articles</Link>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} NewsWire. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}