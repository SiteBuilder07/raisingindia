/**
 * Compact inline email signup used inside the orange hero and in the footer.
 */
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function NewsletterInlineForm({ variant = 'on-orange' }) {
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

  const onOrange = variant === 'on-orange';

  if (submitted) {
    return (
      <div className={`flex items-center gap-2 font-bold ${onOrange ? 'text-white' : 'text-accent'}`}>
        <CheckCircle2 className="w-5 h-5" />
        <span>You're in! 🎉</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={
          onOrange
            ? 'bg-white/20 border-white/40 text-white placeholder:text-white/70 flex-1 font-semibold h-11 rounded-full px-4'
            : 'flex-1 h-11 rounded-full px-4'
        }
        required
      />
      <Button
        type="submit"
        disabled={loading}
        className={
          onOrange
            ? 'bg-white text-accent font-bold hover:bg-white/90 gap-2 shrink-0 rounded-full h-11 px-5'
            : 'bg-accent text-white font-bold hover:bg-accent/90 gap-2 shrink-0 rounded-full h-11 px-5'
        }
      >
        Subscribe <ArrowRight className="w-4 h-4" />
      </Button>
    </form>
  );
}