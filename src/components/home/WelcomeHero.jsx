/**
 * Homepage welcome hero — single warm photograph of an Indian parent and child
 * on the soft cream background. No geometric colour blocks.
 */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomeHero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Text */}
        <div>
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
            className="font-display text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4"
          >
            <span className="text-foreground">Raising</span>
            <span className="text-accent">India</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg font-medium max-w-md mb-6 leading-relaxed"
          >
            Expert parenting tips, child development insights &amp; education advice — written for Indian families. 🧡
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/Categories">
              <button className="inline-flex items-center gap-2 bg-accent text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg shadow-accent/30 hover:bg-accent/90 hover:gap-3 transition-all duration-200">
                Explore Topics <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-[4/5] sm:aspect-[5/4] md:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://media.base44.com/images/public/69b85e2627584283cc2dd222/212736bc2_happy-modern-indian-mother-lovingly-holding-and-smiling-at-her-baby-in-bright-cozy-home-setting-expressing-joy-parenting-and-family-bonding-photo.jpg"
              alt="Indian mother and child sharing a happy moment"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}