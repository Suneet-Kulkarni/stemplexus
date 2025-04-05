
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Clock, Award, Send, ArrowRight } from 'lucide-react';

const ChallengeView = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [submission, setSubmission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: challenge, isLoading } = useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!challengeId,
  });

  const { data: existingSubmission, refetch: refetchSubmission } = useQuery({
    queryKey: ['submission', challengeId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    },
    enabled: !!challengeId && !!user,
  });

  useEffect(() => {
    if (existingSubmission) {
      setSubmission(existingSubmission.content);
    }
  }, [existingSubmission]);

  const handleSubmit = async () => {
    if (!user || !challenge || !submission.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      if (existingSubmission) {
        // Update existing submission
        const { error } = await supabase
          .from('submissions')
          .update({
            content: submission,
            submitted_at: new Date().toISOString(),
          })
          .eq('id', existingSubmission.id);
          
        if (error) throw error;
        
        toast({
          title: "Submission updated",
          description: "Your solution has been updated successfully.",
        });
      } else {
        // Create new submission
        const { error } = await supabase
          .from('submissions')
          .insert({
            challenge_id: challengeId,
            user_id: user.id,
            content: submission,
          });
          
        if (error) throw error;
        
        toast({
          title: "Submission received",
          description: "Your solution has been submitted successfully.",
        });
      }
      
      // Refresh submission data
      refetchSubmission();
      
    } catch (error) {
      console.error('Error submitting challenge:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your solution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Challenge not found</h1>
          <p className="mt-4 text-gray-600">The challenge you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-6">
            <Link to="/challenges">Back to Challenges</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const hasDeadlinePassed = () => {
    if (!challenge.deadline) return false;
    return new Date(challenge.deadline) < new Date();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/challenges">Challenges</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{challenge.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link to="/challenges">
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to challenges
            </Link>
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                  <CardDescription className="mt-2 flex items-center">
                    <Badge className={`mr-2 ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </Badge>
                    <span className="flex items-center text-sm text-muted-foreground">
                      <Award className="mr-1 h-4 w-4" /> {challenge.points} points
                    </span>
                    {challenge.deadline && (
                      <span className="flex items-center ml-4 text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" /> Due: {formatDate(challenge.deadline)}
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium">Description</h3>
                <p>{challenge.description}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Solution</CardTitle>
              <CardDescription>
                {existingSubmission ? 'Update your submission below' : 'Submit your solution below'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your solution here..."
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                className="min-h-[200px]"
                disabled={hasDeadlinePassed()}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {existingSubmission && (
                  <span className="text-sm text-muted-foreground">
                    Last updated: {new Date(existingSubmission.submitted_at).toLocaleString()}
                  </span>
                )}
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={!submission.trim() || isSubmitting || hasDeadlinePassed()}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    {existingSubmission ? 'Update Submission' : 'Submit Solution'}
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Completion</span>
                  <span className="text-sm font-medium">
                    {existingSubmission ? '1/1' : '0/1'}
                  </span>
                </div>
                <Progress value={existingSubmission ? 100 : 0} className="h-2" />
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <Badge className={existingSubmission ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {existingSubmission ? 'Submitted' : 'Not Submitted'}
                </Badge>
              </div>
              
              {existingSubmission && existingSubmission.score !== null && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Your Score</h4>
                    <div className="text-2xl font-bold">
                      {existingSubmission.score} / {challenge.points}
                    </div>
                  </div>
                </>
              )}
              
              {existingSubmission && existingSubmission.feedback && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Feedback</h4>
                    <p className="text-sm text-muted-foreground">
                      {existingSubmission.feedback}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/challenges">
                  View More Challenges <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChallengeView;
