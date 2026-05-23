import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { CheckCircle2, Mail, Star, Heart, BookOpen, Mic } from 'lucide-react';
import NewsletterInlineForm from '@/components/common/NewsletterInlineForm';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await base44.entities.NewsletterSubscriber.create({ email, name, is_active: true });
    setLoading(false);
    setSubmitted(true);
    toast.success('Welcome to the RaisingIndia family! 🎉');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 100%)' }}>
        <div className="absolute inset-0 opacity-10 text-[20rem] flex items-center justify-center leading-none select-none">💌</div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="text-6xl mb-4">💌</div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Join the RaisingIndia Family!
          </h1>
          <p className="text-white/85 text-lg font-semibold leading-relaxed max-w-xl mx-auto mb-7">
            Get weekly parenting tips, expert advice, fun activity ideas, and the latest from our community delivered straight to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterInlineForm variant="on-orange" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Perks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BookOpen, label: 'Weekly Articles', color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: Star, label: 'Expert Tips', color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { icon: Mic, label: 'Podcast Updates', color: 'text-purple-500', bg: 'bg-purple-50' },
            { icon: Heart, label: 'Community Love', color: 'text-rose-500', bg: 'bg-rose-50' },
          ].map(({ icon: Icon, label, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 flex flex-col items-center gap-2 text-center`}>
              <Icon className={`w-6 h-6 ${color}`} />
              <span className="font-bold text-sm text-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white border-2 border-border rounded-3xl p-8 shadow-lg">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-black mb-2">You're in! 🎉</h2>
              <p className="text-muted-foreground font-semibold">
                Thanks for joining! Check your inbox for a welcome message from us.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-black mb-1 text-center">Subscribe Now</h2>
              <p className="text-muted-foreground text-sm text-center mb-6 font-semibold">It's free! Unsubscribe anytime.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Your Name</label>
                  <Input
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-black gap-2"
                  style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #f7a35c 100%)' }}
                >
                  <Mail className="w-5 h-5" />
                  {loading ? 'Subscribing...' : 'Subscribe for Free 🎉'}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-semibold">
          🔒 No spam, ever. We respect your privacy.
        </p>
      </div>
    </div>
  );
}