
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, BookOpen, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tables } from '@/integrations/supabase/types';

interface ContentSection {
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'quiz';
  media_url?: string;
  quiz_questions?: any[];
}

const TopicView = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [topic, setTopic] = useState<Tables<'topics'> | null>(null);
  const [subject, setSubject] = useState<Tables<'subjects'> | null>(null);
  const [assessments, setAssessments] = useState<Tables<'assessments'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);

  useEffect(() => {
    async function fetchTopicData() {
      try {
        setLoading(true);
        
        // Fetch topic
        const { data: topicData, error: topicError } = await supabase
          .from('topics')
          .select('*')
          .eq('id', topicId)
          .single();

        if (topicError) throw topicError;
        setTopic(topicData);
        
        // Parse content sections from JSON
        if (topicData.content) {
          const parsedContent = typeof topicData.content === 'string' 
            ? JSON.parse(topicData.content) 
            : topicData.content;
          
          setContentSections(parsedContent.sections || []);
        }
        
        // Fetch subject
        if (topicData.subject_id) {
          const { data: subjectData, error: subjectError } = await supabase
            .from('subjects')
            .select('*')
            .eq('id', topicData.subject_id)
            .single();
  
          if (!subjectError) {
            setSubject(subjectData);
          }
        }
        
        // Fetch assessments
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessments')
          .select('*')
          .eq('topic_id', topicId);

        if (assessmentError) throw assessmentError;
        setAssessments(assessmentData);
      } catch (error: any) {
        toast({
          title: "Error fetching topic data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (topicId) {
      fetchTopicData();
    }
  }, [topicId, toast]);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startAssessment = (assessmentId: string) => {
    navigate(`/assessments/${assessmentId}`);
  };

  const renderContentSection = (section: ContentSection, index: number) => {
    switch (section.type) {
      case 'text':
        return (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
            <div className="prose max-w-none">
              {section.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        );
      case 'image':
        return (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
            {section.media_url && (
              <div className="my-4">
                <img 
                  src={section.media_url} 
                  alt={section.title} 
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            )}
            <div className="prose max-w-none mt-2">
              {section.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
            <p className="mb-4">{section.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-1" 
        onClick={() => navigate(`/subjects/${subject?.id}/topics`)}
      >
        <ArrowLeft className="h-4 w-4" /> 
        Back to {subject?.name} Topics
      </Button>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{topic?.name}</h1>
                <Badge className={getDifficultyColor(topic?.difficulty || 'beginner')}>
                  {topic?.difficulty.charAt(0).toUpperCase() + topic?.difficulty.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground">{topic?.description}</p>
            </div>
          </div>
          
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Learning Content
              </TabsTrigger>
              <TabsTrigger value="assessments" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" /> Assessments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="mt-0">
              {contentSections.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  {contentSections.map((section, index) => 
                    renderContentSection(section, index)
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No content available yet</h3>
                  <p className="text-muted-foreground">Check back later for new content</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="assessments" className="mt-0">
              {assessments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {assessments.map((assessment) => (
                    <Card key={assessment.id}>
                      <CardHeader>
                        <CardTitle>{assessment.title}</CardTitle>
                        <CardDescription>
                          {assessment.difficulty.charAt(0).toUpperCase() + assessment.difficulty.slice(1)} level assessment
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Test your knowledge and understanding of this topic with interactive questions and challenges.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => startAssessment(assessment.id)}
                        >
                          Start Assessment
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No assessments available yet</h3>
                  <p className="text-muted-foreground">Check back later for assessments on this topic</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default TopicView;
