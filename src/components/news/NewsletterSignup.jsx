import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await base44.entities.NewsletterSubscriber.create({ email, is_active: true });
    setLoading(false);
    setSubmitted(true);
    toast.success('Subscribed successfully!');
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 md:p-12">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
      <div className="relative z-10 max-w-xl">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-accent" />
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Newsletter</span>
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Stay informed, stay ahead
        </h3>
        <p className="text-primary-foreground/70 mb-6 text-sm leading-relaxed">
          Get the most important stories delivered to your inbox every morning. No spam, unsubscribe anytime.
        </p>
        {submitted ? (
          <div className="flex items-center gap-3 text-accent">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">You're subscribed! Check your inbox.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 flex-1"
              required
            />
            <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              Subscribe <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}