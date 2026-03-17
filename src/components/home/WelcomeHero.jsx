import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomeHero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-background via-secondary to-orange-50 border-2 border-border px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-300/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-3"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-black uppercase tracking-widest text-accent">Welcome to</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-black leading-tight mb-3"
          >
            <span className="text-foreground">Raising</span>
            <span className="text-accent">India</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-base font-medium max-w-sm"
          >
            Expert parenting tips, child development insights &amp; education advice — all in one place. 🧡
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative z-10 shrink-0"
        >
          <Link to="/Categories">
            <button className="flex items-center gap-2 bg-accent text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg shadow-accent/30 hover:bg-accent/90 hover:shadow-accent/40 hover:gap-3 transition-all duration-200">
              Explore Topics <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}