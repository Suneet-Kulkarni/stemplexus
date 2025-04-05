
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Award, BookOpen, CheckCircle, ChevronRight, Clock3, Trophy } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get user progress data
  const { data: progressData } = useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          topics(name, difficulty),
          assessments(title)
        `)
        .eq('user_id', user?.id);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Get recent topics
  const { data: recentTopics } = useQuery({
    queryKey: ['recent-topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (error) throw error;
      return data || [];
    },
  });

  // Get upcoming challenges
  const { data: upcomingChallenges } = useQuery({
    queryKey: ['upcoming-challenges'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .gt('deadline', now)
        .order('deadline', { ascending: true })
        .limit(3);
        
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!progressData || progressData.length === 0) return 0;
    
    const totalScore = progressData.reduce((sum, item) => sum + (item.score || 0), 0);
    const maxPossibleScore = progressData.length * 100; // Assuming max score is 100 for each assessment
    
    return Math.round((totalScore / maxPossibleScore) * 100);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{getWelcomeMessage()}, {user?.user_metadata?.full_name || 'Student'}</h1>
          <p className="text-muted-foreground mt-1">Track your progress and continue your learning journey</p>
        </div>
        <Button asChild>
          <Link to="/subjects">Browse Subjects</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completion</span>
                <span className="text-sm font-medium">{calculateOverallProgress()}%</span>
              </div>
              <Progress value={calculateOverallProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed Assessments</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-primary/10 mr-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <span className="text-3xl font-bold">{progressData?.length || 0}</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/subjects">View All <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-amber-100 mr-3">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-3xl font-bold">
                {/* Calculate score based on completed assessments */}
                {progressData?.reduce((total, item) => total + (item.score || 0), 0) || 0}
              </span>
            </div>
            <Button variant="ghost" size="sm" disabled>
              View Details <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList className="mb-6">
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Topics</CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTopics && recentTopics.length > 0 ? (
                  <div className="space-y-4">
                    {recentTopics.map(topic => (
                      <div key={topic.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                        <div className="p-2 rounded-full bg-blue-100 mr-3">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{topic.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {topic.description || 'No description available'}
                          </p>
                          <div className="mt-2 flex items-center">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                              {topic.difficulty}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/topics/${topic.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No recent topics found</p>
                    <Button variant="outline" className="mt-2" asChild>
                      <Link to="/subjects">Browse Subjects</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/subjects">View All Topics</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Recent assessments and scores</CardDescription>
              </CardHeader>
              <CardContent>
                {progressData && progressData.length > 0 ? (
                  <div className="space-y-4">
                    {progressData.slice(0, 5).map(progress => (
                      <div key={progress.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                        <div className="p-2 rounded-full bg-green-100 mr-3">
                          <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{progress.assessments?.title || 'Assessment'}</h4>
                          <p className="text-sm text-muted-foreground">
                            {progress.topics?.name || 'Unknown topic'}
                          </p>
                          <div className="mt-2">
                            <Progress value={progress.score || 0} className="h-1.5" />
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-muted-foreground">Score</span>
                              <span className="text-xs font-medium">{progress.score || 0}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No assessments completed yet</p>
                    <Button variant="outline" className="mt-2" asChild>
                      <Link to="/subjects">Take an Assessment</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recommended">
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>Based on your progress and interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Recommendations are being generated based on your learning patterns</p>
                <p className="mt-1">Check back soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Challenges</CardTitle>
              <CardDescription>Test your skills with these challenges</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingChallenges && upcomingChallenges.length > 0 ? (
                <div className="space-y-4">
                  {upcomingChallenges.map(challenge => (
                    <div key={challenge.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                      <div className="p-2 rounded-full bg-purple-100 mr-3">
                        <Trophy className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {challenge.description || 'No description available'}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                          {challenge.deadline && (
                            <span className="text-xs flex items-center text-muted-foreground">
                              <Clock3 className="inline h-3 w-3 mr-1" /> 
                              Due: {formatDate(challenge.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/challenges/${challenge.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No upcoming challenges found</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/challenges">View All Challenges</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
