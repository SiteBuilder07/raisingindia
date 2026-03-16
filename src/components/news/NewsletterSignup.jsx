import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
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
    toast.success('Welcome to the RaisingIndia family! 🎉');
  };

  return (
    <section className="relative overflow-hidden rounded-3xl p-8 md:p-10"
      style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)' }}>
      <div className="absolute top-0 right-0 text-9xl opacity-10 select-none leading-none">🌟</div>
      <div className="relative z-10">
        <div className="text-3xl mb-3">💌</div>
        <h3 className="font-display text-2xl font-black text-white mb-2">
          Join the RaisingIndia family!
        </h3>
        <p className="text-white/80 mb-6 text-sm font-semibold leading-relaxed">
          Get weekly parenting tips, expert advice & fun activity ideas delivered to your inbox.
        </p>
        {submitted ? (
          <div className="flex items-center gap-3 text-white font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <span>You're in! Check your inbox 🎉</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 flex-1 font-semibold"
              required
            />
            <Button type="submit" disabled={loading} className="bg-white text-accent font-bold hover:bg-white/90 gap-2 shrink-0">
              Subscribe <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}