import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/Home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="font-display text-4xl font-black mb-4">Get in Touch</h1>
      <p className="text-muted-foreground font-medium leading-relaxed mb-8">
        We'd love to hear from you — whether it's feedback, a story tip, a partnership idea,
        or just to say hello.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href="mailto:hello@raisingindia.com"
          className="bg-white border-2 border-border rounded-2xl p-6 hover:border-accent/40 hover:shadow-md transition-all flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold mb-1">Email us</h3>
            <p className="text-sm text-muted-foreground font-medium">hello@raisingindia.com</p>
          </div>
        </a>
        <a
          href="mailto:editorial@raisingindia.com"
          className="bg-white border-2 border-border rounded-2xl p-6 hover:border-accent/40 hover:shadow-md transition-all flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold mb-1">Editorial & stories</h3>
            <p className="text-sm text-muted-foreground font-medium">editorial@raisingindia.com</p>
          </div>
        </a>
      </div>
    </div>
  );
}