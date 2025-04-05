
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Calendar, Clock, Users, Search, Filter } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

const Challenges = () => {
  const [challenges, setChallenges] = useState<Tables<'challenges'>[]>([]);
  const [submissions, setSubmissions] = useState<Tables<'submissions'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChallenges() {
      try {
        setLoading(true);
        
        // Fetch all challenges
        const { data: challengesData, error: challengesError } = await supabase
          .from('challenges')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (challengesError) throw challengesError;
        setChallenges(challengesData);
        
        // Fetch user's submissions if logged in
        if (user) {
          const { data: submissionsData, error: submissionsError } = await supabase
            .from('submissions')
            .select('*')
            .eq('user_id', user.id);
          
          if (submissionsError) throw submissionsError;
          setSubmissions(submissionsData);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching challenges",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, [user, toast]);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const hasSubmitted = (challengeId: string) => {
    return submissions.some(submission => submission.challenge_id === challengeId);
  };

  const filteredChallenges = challenges.filter(challenge => 
    challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (challenge.description && challenge.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeChallenges = filteredChallenges.filter(challenge => {
    if (!challenge.deadline) return true;
    return new Date(challenge.deadline) > new Date();
  });

  const completedChallenges = filteredChallenges.filter(challenge => 
    hasSubmitted(challenge.id)
  );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">STEM Challenges</h1>
        <p className="text-muted-foreground">
          Solve real-world problems, compete with peers, and enhance your STEM skills
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search challenges..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active Challenges</TabsTrigger>
            <TabsTrigger value="completed">Your Submissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeChallenges.map((challenge) => (
                  <Card key={challenge.id} className="overflow-hidden transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{challenge.title}</CardTitle>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>
                        {challenge.points && `${challenge.points} points`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="line-clamp-3 text-sm">
                        {challenge.description || "Solve this challenge to earn points and test your skills."}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {challenge.deadline && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className={new Date(challenge.deadline) < new Date() ? 'text-red-500' : ''}>
                              {getTimeRemaining(challenge.deadline)}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {formatDate(challenge.deadline)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>All Participants</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        disabled={hasSubmitted(challenge.id)}
                        onClick={() => navigate(`/challenges/${challenge.id}`)}
                      >
                        {hasSubmitted(challenge.id) ? 'Submitted' : 'View Challenge'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No active challenges found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedChallenges.map((challenge) => {
                  const submission = submissions.find(s => s.challenge_id === challenge.id);
                  return (
                    <Card key={challenge.id} className="overflow-hidden transition-all hover:shadow-lg">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{challenge.title}</CardTitle>
                          {submission?.score !== null && (
                            <Badge className="bg-blue-100 text-blue-800">
                              Score: {submission?.score}%
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {submission?.submitted_at && (
                            <>Submitted on {formatDate(submission.submitted_at)}</>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="line-clamp-3 text-sm">
                          {challenge.description || "You've completed this challenge."}
                        </p>
                        
                        {submission?.feedback && (
                          <div className="p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium mb-1">Feedback:</p>
                            <p className="text-sm">{submission.feedback}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => navigate(`/challenges/${challenge.id}`)}
                        >
                          View Submission
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                <p className="text-muted-foreground mb-6">Complete challenges to see your submissions here</p>
                <Button onClick={() => navigate('/challenges')}>
                  Browse Challenges
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Challenges;
