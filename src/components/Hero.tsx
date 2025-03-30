
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Hero: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const { user } = useAuth();
  
  return (
    <div className="py-16 md:py-24 text-center max-w-4xl mx-auto px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Your <span className="text-brand-purple">Personalized</span> Learning Journey
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-8">
        Create custom learning paths tailored to your goals, skill level, and available time
      </p>
      <Button size="lg" onClick={onGetStarted} className="gap-2">
        {user ? 'Create Your Path' : 'Sign Up to Get Your Path'} <ArrowRight className="h-4 w-4" />
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="p-6 rounded-lg bg-brand-light-purple">
          <h3 className="font-bold text-lg mb-2">Define Your Goals</h3>
          <p className="text-muted-foreground">Tell us what you want to learn and where you're starting from</p>
        </div>
        <div className="p-6 rounded-lg bg-brand-light-blue">
          <h3 className="font-bold text-lg mb-2">Get a Custom Path</h3>
          <p className="text-muted-foreground">Receive an AI-generated learning path with curated resources</p>
        </div>
        <div className="p-6 rounded-lg bg-secondary">
          <h3 className="font-bold text-lg mb-2">Track Your Progress</h3>
          <p className="text-muted-foreground">Mark modules as complete as you advance through your journey</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
