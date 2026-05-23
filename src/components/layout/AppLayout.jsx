import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, Bookmark, Grid3X3, PenSquare, Menu, X, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import NewsletterInlineForm from '@/components/common/NewsletterInlineForm';

const NAV_ITEMS = [
  { path: '/Home', label: 'Home', icon: Home },
  { path: '/Categories', label: 'Topics', icon: Grid3X3 },
  { path: '/Search', label: 'Search', icon: Search },
  { path: '/Bookmarks', label: 'Saved', icon: Bookmark },
];

const FOOTER_TOPICS = [
  { label: 'Newborn',    slug: 'newborn' },
  { label: 'Toddler',    slug: 'toddler' },
  { label: 'Education',  slug: 'education' },
  { label: 'Health',     slug: 'health' },
  { label: 'Activities', slug: 'activities' },
  { label: 'Nutrition',  slug: 'nutrition' },
  { label: 'Teen',       slug: 'teen' },
  { label: 'Parenting',  slug: 'parenting' },
];

const LOGO_URL = 'https://media.base44.com/images/public/69b85e2627584283cc2dd222/43b92ad83_RaisingIndia-icon.svg';

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
              <img src={LOGO_URL} alt="" className="w-9 h-9 rounded-xl shadow-md" />
              <div className="hidden sm:block">
                <span className="font-display text-xl font-black text-foreground">Raising</span>
                <span className="font-display text-xl font-black text-accent">India</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/Newsletter">
                <Button
                  size="sm"
                  className={`gap-2 rounded-full font-bold border-2 ${pathname === '/Newsletter' ? 'bg-accent text-white border-accent' : 'bg-accent/10 text-accent border-accent/30 hover:bg-accent hover:text-white'}`}
                >
                  <Mail className="w-4 h-4" />
                  Newsletter
                </Button>
              </Link>
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
            <Link to="/Newsletter" onClick={() => setMobileOpen(false)}>
              <Button
                className={`w-full justify-start gap-3 rounded-full font-bold ${pathname === '/Newsletter' ? 'bg-accent text-white' : 'bg-accent/10 text-accent hover:bg-accent hover:text-white'}`}
              >
                <Mail className="w-4 h-4" />
                Newsletter
              </Button>
            </Link>
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
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-4">
              <Link to="/Home" className="flex items-center gap-2 mb-4">
                <img src={LOGO_URL} alt="" className="w-9 h-9 rounded-xl shadow-md" />
                <div>
                  <span className="font-display text-xl font-black text-foreground">Raising</span>
                  <span className="font-display text-xl font-black text-accent">India</span>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Parenting tips, child development insights, and education advice — written for Indian families.
              </p>
              <div className="flex items-center gap-2">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-secondary hover:bg-accent hover:text-white text-foreground flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-secondary hover:bg-accent hover:text-white text-foreground flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-secondary hover:bg-accent hover:text-white text-foreground flex items-center justify-center transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Topics */}
            <div className="col-span-1 md:col-span-3">
              <h4 className="font-display font-bold mb-3 text-sm uppercase tracking-wider">Topics</h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                {FOOTER_TOPICS.map(({ label, slug }) => (
                  <Link
                    key={slug}
                    to={`/Categories?cat=${slug}`}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Company */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="font-display font-bold mb-3 text-sm uppercase tracking-wider">Company</h4>
              <div className="space-y-2">
                <Link to="/About"   className="block text-sm text-muted-foreground hover:text-accent transition-colors font-medium">About</Link>
                <Link to="/Contact" className="block text-sm text-muted-foreground hover:text-accent transition-colors font-medium">Contact</Link>
                <Link to="/Privacy" className="block text-sm text-muted-foreground hover:text-accent transition-colors font-medium">Privacy Policy</Link>
                <Link to="/Terms"   className="block text-sm text-muted-foreground hover:text-accent transition-colors font-medium">Terms of Service</Link>
              </div>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 md:col-span-3">
              <h4 className="font-display font-bold mb-3 text-sm uppercase tracking-wider">Newsletter</h4>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-3">
                Weekly tips, expert advice and the best of RaisingIndia in your inbox.
              </p>
              <NewsletterInlineForm variant="plain" />
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