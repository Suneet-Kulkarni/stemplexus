
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-12 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-stem-blue/10 tech-pattern"></div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-lg border">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Learning Experience?</h2>
            <p className="text-lg text-foreground/70">
              Join thousands of students mastering STEM subjects with personalized, AI-powered learning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">For Students</h3>
              <ul className="space-y-3">
                {[
                  "Personalized learning paths based on your style",
                  "Identify and fill knowledge gaps quickly",
                  "Track your progress with intuitive visualizations",
                  "Collaborate with peers on engaging challenges",
                  "Learn at your own pace, anytime, anywhere"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">For Parents</h3>
              <ul className="space-y-3">
                {[
                  "Monitor your child's progress and achievements",
                  "Receive regular reports on strengths and areas for growth",
                  "Ensure focused learning on relevant topics",
                  "Watch confidence and skills grow over time",
                  "Support your child's STEM education journey"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-stem-teal mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/register">
              <Button size="lg" className="group">
                Start Your Learning Journey
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-foreground/60">
              Free 14-day trial. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
