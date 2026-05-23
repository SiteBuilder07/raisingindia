import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/Home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="font-display text-4xl font-black mb-2">Terms of Service</h1>
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-8">Last updated: May 2026</p>

      <div className="space-y-6 text-muted-foreground font-medium leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Use of the site</h2>
          <p>RaisingIndia is provided for personal, non-commercial use. By using the site you agree to these terms.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Content</h2>
          <p>Articles, podcasts, and editorial content are © RaisingIndia. Spotlight submissions remain the property of their creators; by submitting you grant us a license to display them on the site.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Comments & community</h2>
          <p>Be respectful. Spam, harassment, and abusive content will be removed. We reserve the right to moderate or remove any comment at our discretion.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Disclaimer</h2>
          <p>Content on RaisingIndia is for informational purposes only and is not a substitute for professional medical, psychological, or legal advice. Always consult a qualified professional.</p>
        </section>
      </div>
    </div>
  );
}