
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

const Topics = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subject, setSubject] = useState<Tables<'subjects'> | null>(null);
  const [topics, setTopics] = useState<Tables<'topics'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopicsAndSubject() {
      try {
        setLoading(true);
        
        // Fetch subject
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .select('*')
          .eq('id', subjectId)
          .single();

        if (subjectError) throw subjectError;
        setSubject(subjectData);
        
        // Fetch topics
        const { data: topicsData, error: topicsError } = await supabase
          .from('topics')
          .select('*')
          .eq('subject_id', subjectId)
          .order('name');

        if (topicsError) throw topicsError;
        setTopics(topicsData);
      } catch (error: any) {
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (subjectId) {
      fetchTopicsAndSubject();
    }
  }, [subjectId, toast]);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-1" 
        onClick={() => navigate('/subjects')}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Subjects
      </Button>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{subject?.name}</h1>
            <p className="text-muted-foreground mt-2">{subject?.description}</p>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">Available Topics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.length > 0 ? (
              topics.map((topic) => (
                <Card key={topic.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{topic.name}</CardTitle>
                      <Badge className={getDifficultyColor(topic.difficulty)}>
                        {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {topic.description || "Learn and master this topic"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-24 overflow-hidden">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {topic.description || `This topic covers important concepts in ${subject?.name}. Begin your learning journey here.`}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => navigate(`/topics/${topic.id}`)}
                    >
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium mb-2">No topics available yet</h3>
                <p className="text-muted-foreground">Check back later for new content</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Topics;
