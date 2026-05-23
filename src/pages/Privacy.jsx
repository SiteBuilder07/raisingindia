import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/Home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="font-display text-4xl font-black mb-2">Privacy Policy</h1>
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-8">Last updated: May 2026</p>

      <div className="space-y-6 text-muted-foreground font-medium leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">What we collect</h2>
          <p>When you subscribe, comment, or submit work to Spotlight, we collect the information you provide directly — your name, email, and any content you choose to share.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">How we use it</h2>
          <p>We use your information to send the newsletter, moderate comments, display Spotlight submissions, and improve the site. We never sell your data.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Cookies</h2>
          <p>RaisingIndia uses essential cookies for authentication and to remember your saved articles. We do not use third-party advertising cookies.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Your rights</h2>
          <p>You can unsubscribe from the newsletter at any time and request deletion of your data by emailing hello@raisingindia.com.</p>
        </section>
      </div>
    </div>
  );
}