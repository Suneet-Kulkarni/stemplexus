
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, Calendar, Trophy, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tables } from '@/integrations/supabase/types';

const ChallengeView = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [challenge, setChallenge] = useState<Tables<'challenges'> | null>(null);
  const [submission, setSubmission] = useState<Tables<'submissions'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [topSubmissions, setTopSubmissions] = useState<Tables<'submissions'>[]>([]);

  useEffect(() => {
    async function fetchChallengeData() {
      if (!challengeId) return;
      
      try {
        setLoading(true);
        
        // Fetch challenge
        const { data: challengeData, error: challengeError } = await supabase
          .from('challenges')
          .select('*')
          .eq('id', challengeId)
          .single();
        
        if (challengeError) throw challengeError;
        setChallenge(challengeData);
        
        // Fetch user's submission if logged in
        if (user) {
          const { data: submissionData, error: submissionError } = await supabase
            .from('submissions')
            .select('*')
            .eq('challenge_id', challengeId)
            .eq('user_id', user.id)
            .single();
          
          if (!submissionError) {
            setSubmission(submissionData);
            setSubmissionContent(submissionData.content);
          }
        }
        
        // Fetch top submissions
        const { data: topSubData, error: topSubError } = await supabase
          .from('submissions')
          .select('*')
          .eq('challenge_id', challengeId)
          .order('score', { ascending: false })
          .limit(5);
        
        if (!topSubError && topSubData) {
          setTopSubmissions(topSubData);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching challenge",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchChallengeData();
  }, [challengeId, user, toast]);

  const handleSubmit = async () => {
    if (!user || !challengeId || !submissionContent.trim()) {
      toast({
        title: "Submission error",
        description: "Please write your solution before submitting",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (submission) {
        // Update existing submission
        const { error } = await supabase
          .from('submissions')
          .update({
            content: submissionContent,
            submitted_at: new Date().toISOString(),
            score: null, // Reset score on update
            feedback: null // Reset feedback on update
          })
          .eq('id', submission.id);
        
        if (error) throw error;
        
        toast({
          title: "Submission updated",
          description: "Your solution has been updated successfully",
        });
      } else {
        // Create new submission
        const { data, error } = await supabase
          .from('submissions')
          .insert({
            user_id: user.id,
            challenge_id: challengeId,
            content: submissionContent,
            submitted_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setSubmission(data);
        
        toast({
          title: "Submission successful",
          description: "Your solution has been submitted for evaluation",
        });
      }
      
      // Refresh top submissions
      const { data: topSubData } = await supabase
        .from('submissions')
        .select('*')
        .eq('challenge_id', challengeId)
        .order('score', { ascending: false })
        .limit(5);
      
      if (topSubData) {
        setTopSubmissions(topSubData);
      }
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getTimeRemaining = (deadline: string | null) => {
    if (!deadline) return 'No deadline';
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    
    if (deadlineDate < now) return 'Expired';
    
    const diffMs = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    }
    
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
  };

  const isDeadlinePassed = () => {
    if (!challenge || !challenge.deadline) return false;
    return new Date(challenge.deadline) < new Date();
  };

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-1" 
        onClick={() => navigate('/challenges')}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Challenges
      </Button>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-bold">{challenge?.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <Badge className={getDifficultyColor(challenge?.difficulty || 'beginner')}>
                    {challenge?.difficulty.charAt(0).toUpperCase() + challenge?.difficulty.slice(1)}
                  </Badge>
                  
                  {challenge?.points && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" /> {challenge.points} points
                    </Badge>
                  )}
                  
                  {challenge?.deadline && (
                    <Badge 
                      variant="outline" 
                      className={`flex items-center gap-1 ${isDeadlinePassed() ? 'text-red-500' : ''}`}
                    >
                      <Clock className="h-3 w-3" /> {getTimeRemaining(challenge.deadline)}
                    </Badge>
                  )}
                </div>
              </div>
              
              {challenge?.deadline && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {formatDate(challenge.deadline)}</span>
                </div>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="challenge" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="challenge">Challenge</TabsTrigger>
              <TabsTrigger value="submit">Your Submission</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="challenge">
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <p>{challenge?.description || "No description provided."}</p>
                  </div>
                  
                  {/* Sample challenge requirements - in a real app, these would come from the database */}
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-semibold">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Demonstrate understanding of the core concepts related to this challenge</li>
                      <li>Show your work and explain your reasoning clearly</li>
                      <li>Use diagrams, charts, or other visual aids if helpful</li>
                      <li>Submit your solution before the deadline</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold mt-4">Evaluation Criteria</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Correctness of solution (50%)</li>
                      <li>Clarity of explanation (30%)</li>
                      <li>Creativity and innovation (20%)</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold mt-4">Submission Guidelines</h3>
                    <p>
                      Type your solution in the "Your Submission" tab. You can edit and resubmit your 
                      solution until the deadline. After submission, you'll receive feedback and a score 
                      based on the evaluation criteria.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="submit">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {submission ? "Edit Your Submission" : "Submit Your Solution"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isDeadlinePassed() && !submission ? (
                    <div className="text-center py-6">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Deadline has passed</h3>
                      <p className="text-muted-foreground">You can no longer submit a solution for this challenge</p>
                    </div>
                  ) : (
                    <>
                      <Textarea
                        placeholder="Type your solution here..."
                        className="min-h-[300px]"
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                        disabled={submitting}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          className="flex items-center gap-2" 
                          onClick={handleSubmit}
                          disabled={submitting || !submissionContent.trim()}
                        >
                          {submitting ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                              {submission ? "Updating..." : "Submitting..."}
                            </>
                          ) : (
                            <>
                              {submission ? (
                                <>
                                  <CheckCircle className="h-4 w-4" /> Update Submission
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4" /> Submit Solution
                                </>
                              )}
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {submission?.feedback && (
                        <div className="mt-6 p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Feedback on your submission:</h4>
                          <p className="text-sm">{submission.feedback}</p>
                          
                          {submission.score !== null && (
                            <div className="mt-4 flex items-center gap-2">
                              <span className="font-medium">Score:</span>
                              <Badge className={`${submission.score >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {submission.score}%
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="leaderboard">
              <Card>
                <CardHeader>
                  <CardTitle>Top Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  {topSubmissions.length > 0 ? (
                    <div className="space-y-4">
                      {topSubmissions.map((sub, index) => (
                        <div 
                          key={sub.id} 
                          className="flex items-center justify-between p-4 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">Participant #{sub.user_id?.substring(0, 6)}</p>
                              <p className="text-sm text-muted-foreground">
                                Submitted on {formatDate(sub.submitted_at)}
                              </p>
                            </div>
                          </div>
                          
                          {sub.score !== null && (
                            <Badge className={`${sub.score >= 80 ? 'bg-green-100 text-green-800' : sub.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {sub.score}%
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                      <p className="text-muted-foreground">Be the first to submit a solution!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ChallengeView;
