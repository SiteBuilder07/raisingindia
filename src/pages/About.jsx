import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/Home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="font-display text-4xl font-black mb-4">About RaisingIndia</h1>
      <p className="text-muted-foreground font-medium leading-relaxed mb-6">
        RaisingIndia is a parenting platform built for Indian families. We bring together expert
        advice, real stories from parents across India, and practical guidance covering every
        stage — from newborn care to navigating the teenage years.
      </p>

      <h2 className="font-display text-2xl font-bold mt-10 mb-3">Our Mission</h2>
      <p className="text-muted-foreground font-medium leading-relaxed mb-6">
        To support parents in raising happy, healthy, and confident children, with culturally
        relevant content rooted in Indian family life.
      </p>

      <h2 className="font-display text-2xl font-bold mt-10 mb-3">What You'll Find Here</h2>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground font-medium leading-relaxed mb-6">
        <li>Expert-reviewed articles across eight parenting topics</li>
        <li>The Kids Voice Podcast — conversations with educators, doctors, and parents</li>
        <li>Spotlight — a stage for your child's creative work</li>
        <li>A weekly newsletter with the best of what we publish</li>
      </ul>

      <div className="mt-10">
        <Link to="/Newsletter">
          <Button className="rounded-full font-bold">Join the Newsletter →</Button>
        </Link>
      </div>
    </div>
  );
}