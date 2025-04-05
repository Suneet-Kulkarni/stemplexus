
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tables } from '@/integrations/supabase/types';

const Subjects = () => {
  const [subjects, setSubjects] = useState<Tables<'subjects'>[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubjects() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('subjects')
          .select('*')
          .order('name');

        if (error) throw error;
        
        if (data) setSubjects(data);
      } catch (error: any) {
        toast({
          title: "Error fetching subjects",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, [toast]);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'math': return 'bg-blue-100 text-blue-800';
      case 'science': return 'bg-green-100 text-green-800';
      case 'technology': return 'bg-purple-100 text-purple-800';
      case 'engineering': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Subjects</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <Card key={subject.id} className="overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{subject.name}</CardTitle>
                    <Badge className={getCategoryColor(subject.category)}>
                      {subject.category.charAt(0).toUpperCase() + subject.category.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>
                    {subject.description || "Explore topics in this subject"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-24 overflow-hidden">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {subject.description || `Dive into ${subject.name} and discover fundamental concepts, practical applications, and exciting challenges.`}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => navigate(`/subjects/${subject.id}/topics`)}
                  >
                    Explore Topics
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium mb-2">No subjects available yet</h3>
              <p className="text-muted-foreground">Check back later for new content</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subjects;
