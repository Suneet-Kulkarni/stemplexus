
import React from 'react';
import { BrainCircuit, Users, LineChart, Lightbulb, ArrowBigRight, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  iconClass?: string;
  link?: string;
}

const FeatureCard = ({ icon, title, description, className, iconClass, link }: FeatureCardProps) => (
  <Card className={cn("h-full transition-all hover:shadow-md", className)}>
    <CardHeader>
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", iconClass)}>
        {icon}
      </div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      
    </CardContent>
    {link && (
      <CardFooter>
        <Link to={link}>
          <Button variant="link" className="p-0 text-foreground/70 hover:text-primary">
            Learn more <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    )}
  </Card>
);

const FeaturesSection = () => {
  return (
    <section className="py-12 md:py-24 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Features for Effective Learning</h2>
          <p className="text-foreground/70">
            Our AI-powered platform adapts to your learning style and helps you master STEM subjects at your own pace.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<BrainCircuit className="w-6 h-6 text-white" />}
            iconClass="bg-primary"
            title="Adaptive Learning Paths"
            description="Our AI analyzes your strengths and weaknesses to create personalized learning experiences that adapt in real-time."
            link="/features/adaptive-learning"
          />
          
          <FeatureCard 
            icon={<Lightbulb className="w-6 h-6 text-white" />}
            iconClass="bg-stem-teal"
            title="Intelligent Assessments"
            description="Identify knowledge gaps with smart diagnostic tests that provide immediate, actionable feedback."
            link="/features/assessments"
          />
          
          <FeatureCard 
            icon={<LineChart className="w-6 h-6 text-white" />}
            iconClass="bg-stem-blue"
            title="Progress Visualization"
            description="Track your learning journey with intuitive dashboards and data visualizations that highlight your growth."
            link="/features/progress"
          />
          
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-white" />}
            iconClass="bg-stem-pink"
            title="Collaborative Challenges"
            description="Solve problems with peers in collaborative challenges that make learning social and fun."
            link="/features/collaboration"
          />
          
          <FeatureCard 
            icon={<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22l-3-3m3 3l3-3m-3 3V10m-9-8l3 3m-3-3l3 3M3 2v12m18-12l-3 3m3-3l-3 3m3-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>}
            iconClass="bg-stem-purple"
            title="Math Mastery"
            description="Interactive problem-solving with step-by-step guidance in algebra, geometry, calculus, and more."
            link="/subjects/math"
          />
          
          <FeatureCard 
            icon={<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 3.5v8.5h8.5m-8.5 0l8.5-8.5M21 21l-5.5-5.5M15.5 21h5.5v-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.5 7.5v9h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>}
            iconClass="bg-yellow-500"
            title="Science Exploration"
            description="Engage with interactive experiments and simulations in physics, chemistry, biology, and beyond."
            link="/subjects/science"
          />
        </div>
        
        <div className="text-center mt-12">
          <Link to="/register">
            <Button size="lg" className="group">
              Get Started Today
              <ArrowBigRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
