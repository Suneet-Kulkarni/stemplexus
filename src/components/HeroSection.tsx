
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, AtomIcon, BookOpenCheck, BrainCircuit, FlaskConical, LineChart, Rocket, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-12 md:py-32 relative overflow-hidden tech-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background"></div>
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
              <BrainCircuit className="w-4 h-4 mr-2" />
              <span>AI-Powered Learning</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-stem-purple to-stem-blue">
              Personalized STEM Education for Every Student
            </h1>
            <p className="text-lg text-foreground/80 mb-8">
              STEMplexus uses AI to identify your learning gaps, create personalized learning paths, 
              and help you master math, science, and technology at your own pace.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="group">
                  Start Learning
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg">
                  See Demo
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 text-foreground/70">
                <BookOpenCheck className="w-5 h-5 text-stem-blue" />
                <span>Adaptive Learning</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <LineChart className="w-5 h-5 text-stem-teal" />
                <span>Progress Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <Users className="w-5 h-5 text-stem-pink" />
                <span>Collaborative Challenges</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {/* Central brain icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary to-stem-blue flex items-center justify-center animate-pulse-soft">
                  <BrainCircuit className="w-20 h-20 text-white" />
                </div>
              </div>
              
              {/* Orbiting subject icons */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4">
                  <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center animate-float">
                    <FlaskConical className="w-8 h-8 text-stem-teal" />
                  </div>
                </div>
                <div className="absolute top-1/4 right-0 translate-x-1/4">
                  <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                    <AtomIcon className="w-8 h-8 text-stem-pink" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4">
                  <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
                    <svg className="w-8 h-8 text-stem-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22l-3-3m3 3l3-3m-3 3V10m-9-8l3 3m-3-3l3 3M3 2v12m18-12l-3 3m3-3l-3 3m3-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute top-1/4 left-0 -translate-x-1/4">
                  <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                    <Rocket className="w-8 h-8 text-stem-blue" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
