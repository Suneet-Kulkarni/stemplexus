
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  rating: number;
}

const Testimonial = ({ quote, author, role, avatar, rating }: TestimonialProps) => (
  <Card className="h-full flex flex-col">
    <CardContent className="flex-grow pt-6">
      <div className="flex space-x-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      <p className="text-foreground/80 mb-4">"{quote}"</p>
    </CardContent>
    <CardFooter className="border-t pt-4 flex items-center gap-3">
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback className="bg-primary/10 text-primary">{author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="font-medium">{author}</h4>
        <p className="text-sm text-foreground/60">{role}</p>
      </div>
    </CardFooter>
  </Card>
);

const TestimonialsSection = () => {
  const testimonials: TestimonialProps[] = [
    {
      quote: "STEMplexus helped me understand algebra in a way my textbooks never could. The adaptive learning path felt like it was made just for me!",
      author: "Maya Johnson",
      role: "8th Grade Student",
      rating: 5
    },
    {
      quote: "As a parent, I love seeing my son's progress visualized clearly. The gamification elements keep him engaged and actually excited about science.",
      author: "David Chen",
      role: "Parent",
      rating: 5
    },
    {
      quote: "The collaborative challenges helped me connect with other students who love physics as much as I do. We solve problems together and learn from each other.",
      author: "Jackson Lee",
      role: "11th Grade Student",
      rating: 4
    },
    {
      quote: "I was struggling with calculus until I started using STEMplexus. The AI identified exactly what concepts I was missing and helped me fill those gaps.",
      author: "Sophia Rodriguez",
      role: "12th Grade Student",
      rating: 5
    },
  ];

  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Are Saying</h2>
          <p className="text-foreground/70">
            Join thousands of students who are transforming their STEM education journey with STEMplexus.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
