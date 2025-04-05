
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy,
  BookOpen,
  LineChart,
  Clock,
  ArrowUpRight,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tables } from "@/integrations/supabase/types";

interface UserProgress extends Tables<'user_progress'> {
  topics: {
    name: string;
    difficulty: string;
    subject_id: string;
  };
  assessments: {
    title: string;
    difficulty: string;
  };
}

interface SubjectProgress {
  id: string;
  name: string;
  completed: number;
  total: number;
  averageScore: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [subjects, setSubjects] = useState<Tables<'subjects'>[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [recentActivity, setRecentActivity] = useState<UserProgress[]>([]);
  const [totalTopics, setTotalTopics] = useState(0);
  const [completedTopics, setCompletedTopics] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [learningStreak, setLearningStreak] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch user progress with related data
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select(`
            *,
            topics:topic_id (name, difficulty, subject_id),
            assessments:assessment_id (title, difficulty)
          `)
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });
        
        if (progressError) throw progressError;
        
        setUserProgress(progressData);
        setRecentActivity(progressData.slice(0, 5));
        
        // Calculate overall statistics
        if (progressData.length > 0) {
          const scores = progressData.map(p => p.score).filter(s => s !== null) as number[];
          const avgScore = scores.length > 0 
            ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
            : 0;
          setAverageScore(Math.round(avgScore));
          
          // Get unique completed topics
          const uniqueTopics = new Set(progressData.map(p => p.topic_id));
          setCompletedTopics(uniqueTopics.size);
          
          // Calculate learning streak (simplified)
          setLearningStreak(Math.min(7, Math.floor(progressData.length / 2))); // Simplified calculation
        }
        
        // Fetch all subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*');
        
        if (subjectsError) throw subjectsError;
        setSubjects(subjectsData);
        
        // Fetch total number of topics
        const { count: topicsCount, error: topicsError } = await supabase
          .from('topics')
          .select('*', { count: 'exact', head: true });
        
        if (topicsError) throw topicsError;
        setTotalTopics(topicsCount || 0);
        
        // Calculate subject progress
        if (subjectsData.length > 0 && progressData.length > 0) {
          const subjectStats: Record<string, {
            id: string,
            name: string, 
            completed: Set<string>, 
            scores: number[]
          }> = {};
          
          // Initialize subjects
          subjectsData.forEach(subject => {
            subjectStats[subject.id] = {
              id: subject.id,
              name: subject.name,
              completed: new Set(),
              scores: []
            };
          });
          
          // Collect progress data by subject
          progressData.forEach(progress => {
            if (progress.topics?.subject_id && progress.topic_id) {
              const subjectId = progress.topics.subject_id;
              if (subjectStats[subjectId]) {
                subjectStats[subjectId].completed.add(progress.topic_id);
                if (progress.score !== null) {
                  subjectStats[subjectId].scores.push(progress.score);
                }
              }
            }
          });
          
          // Calculate subject-specific progress stats
          const subjectProgressData = await Promise.all(
            Object.values(subjectStats).map(async (stat) => {
              // Get total topics for this subject
              const { count, error } = await supabase
                .from('topics')
                .select('*', { count: 'exact', head: true })
                .eq('subject_id', stat.id);
              
              if (error) throw error;
              
              const total = count || 0;
              const avgScore = stat.scores.length > 0
                ? stat.scores.reduce((sum, score) => sum + score, 0) / stat.scores.length
                : 0;
              
              return {
                id: stat.id,
                name: stat.name,
                completed: stat.completed.size,
                total,
                averageScore: Math.round(avgScore)
              };
            })
          );
          
          setSubjectProgress(subjectProgressData);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast]);

  const getPerformanceColor = (score: number | null) => {
    if (score === null) return "text-gray-500";
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Prepare chart data
  const scoreDistributionData = [
    { range: "0-20", count: userProgress.filter(p => p.score !== null && p.score <= 20).length },
    { range: "21-40", count: userProgress.filter(p => p.score !== null && p.score > 20 && p.score <= 40).length },
    { range: "41-60", count: userProgress.filter(p => p.score !== null && p.score > 40 && p.score <= 60).length },
    { range: "61-80", count: userProgress.filter(p => p.score !== null && p.score > 60 && p.score <= 80).length },
    { range: "81-100", count: userProgress.filter(p => p.score !== null && p.score > 80).length },
  ];

  const subjectPerformanceData = subjectProgress.map(subject => ({
    name: subject.name,
    score: subject.averageScore,
    progress: (subject.completed / Math.max(1, subject.total)) * 100
  }));

  // Mock data for timeline (we'd need more sophisticated tracking for real data)
  const timelineData = Array.from({ length: 7 }, (_, i) => ({
    day: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
    value: Math.floor(Math.random() * 3) + (i === 6 ? 2 : 0)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Learning Dashboard</h1>
          <Button onClick={() => navigate('/subjects')}>
            Browse Subjects
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Completed Topics</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {completedTopics} <span className="text-sm font-normal text-muted-foreground">/ {totalTopics}</span>
                  </div>
                  <Progress 
                    value={(completedTopics / Math.max(1, totalTopics)) * 100} 
                    className="h-2 mt-2" 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {averageScore}%
                  </div>
                  <Progress 
                    value={averageScore} 
                    className="h-2 mt-2" 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {learningStreak} days
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 w-full rounded-full ${i < learningStreak ? 'bg-primary' : 'bg-muted'}`}
                      ></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {recentActivity.length > 0 ? formatDate(recentActivity[0]?.completed_at).split(',')[0] : "No activity"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {recentActivity.length > 0 
                      ? `${recentActivity[0]?.assessments?.title || recentActivity[0]?.topics?.name || "Assessment"}`
                      : "Start learning to track your progress"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Learning Progress</CardTitle>
                      <CardDescription>Your progress across all subjects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={subjectPerformanceData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="progress" name="Progress %" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="score" name="Avg. Score" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Score Distribution</CardTitle>
                      <CardDescription>How your assessment scores are distributed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={scoreDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="count"
                              label={({range}) => range}
                            >
                              {scoreDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest learning activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentActivity.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-start gap-4">
                              <div className="rounded-full bg-primary/10 p-2">
                                {activity.assessment_id ? (
                                  <FileCheck className="h-4 w-4 text-primary" />
                                ) : (
                                  <BookOpen className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{activity.assessments?.title || activity.topics?.name || "Completed assessment"}</p>
                                <p className="text-sm text-muted-foreground">{formatDate(activity.completed_at)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {activity.score !== null ? (
                                <>
                                  {activity.score >= 70 ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-amber-500" />}
                                  <span className={`font-medium ${getPerformanceColor(activity.score)}`}>
                                    {activity.score}%
                                  </span>
                                </>
                              ) : (
                                <span className="text-muted-foreground">Completed</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No recent activity found</p>
                        <Button className="mt-4" onClick={() => navigate('/subjects')}>Start Learning</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Subjects Tab */}
              <TabsContent value="subjects" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Progress</CardTitle>
                    <CardDescription>Your learning journey by subject</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {subjectProgress.map((subject) => (
                        <div key={subject.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{subject.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {subject.completed} of {subject.total} topics completed
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              className="gap-1"
                              onClick={() => navigate(`/subjects/${subject.id}/topics`)}
                            >
                              View Topics <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <Progress 
                            value={(subject.completed / Math.max(1, subject.total)) * 100} 
                            className="h-2" 
                          />
                        </div>
                      ))}
                      
                      {subjectProgress.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No subject progress found</p>
                          <Button className="mt-4" onClick={() => navigate('/subjects')}>Browse Subjects</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {subjects.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => {
                      const progress = subjectProgress.find(sp => sp.id === subject.id);
                      return (
                        <Card key={subject.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle>{subject.name}</CardTitle>
                            <CardDescription>{subject.description || `Explore ${subject.name} topics and assessments`}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>
                                  {progress ? `${progress.completed}/${progress.total} topics` : '0/0 topics'}
                                </span>
                              </div>
                              <Progress 
                                value={progress ? (progress.completed / Math.max(1, progress.total)) * 100 : 0} 
                                className="h-2" 
                              />
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="default" 
                              className="w-full"
                              onClick={() => navigate(`/subjects/${subject.id}/topics`)}
                            >
                              Continue Learning
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
              
              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Score Distribution</CardTitle>
                      <CardDescription>How your assessment scores are distributed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={scoreDistributionData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" name="Number of Assessments" fill="#8884d8" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Subject Performance</CardTitle>
                      <CardDescription>Your average scores by subject</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={subjectPerformanceData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis type="category" dataKey="name" width={100} />
                            <Tooltip />
                            <Bar dataKey="score" name="Average Score" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment History</CardTitle>
                    <CardDescription>Your past assessment results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userProgress.filter(p => p.assessment_id !== null).length > 0 ? (
                      <div className="space-y-4">
                        {userProgress
                          .filter(p => p.assessment_id !== null)
                          .map((progress, index) => (
                            <div key={index} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                              <div>
                                <p className="font-medium">{progress.assessments?.title || "Assessment"}</p>
                                <p className="text-sm text-muted-foreground">{formatDate(progress.completed_at)}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {progress.score !== null ? (
                                  <>
                                    {progress.score >= 70 ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-amber-500" />}
                                    <span className={`font-medium ${getPerformanceColor(progress.score)}`}>
                                      {progress.score}%
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">Completed</span>
                                )}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No assessment history found</p>
                        <Button className="mt-4" onClick={() => navigate('/subjects')}>Take an Assessment</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Timeline</CardTitle>
                    <CardDescription>Your activity over the past week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={timelineData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" name="Activities" stroke="#8884d8" strokeWidth={2} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                    <CardDescription>All your learning activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userProgress.length > 0 ? (
                      <div className="space-y-4">
                        {userProgress.map((activity, index) => (
                          <div key={index} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-start gap-4">
                              <div className="rounded-full bg-primary/10 p-2">
                                {activity.assessment_id ? (
                                  <FileCheck className="h-4 w-4 text-primary" />
                                ) : (
                                  <BookOpen className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{activity.assessments?.title || activity.topics?.name || "Completed assessment"}</p>
                                <p className="text-sm text-muted-foreground">{formatDate(activity.completed_at)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {activity.score !== null ? (
                                <>
                                  {activity.score >= 70 ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-amber-500" />}
                                  <span className={`font-medium ${getPerformanceColor(activity.score)}`}>
                                    {activity.score}%
                                  </span>
                                </>
                              ) : (
                                <span className="text-muted-foreground">Completed</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No activity history found</p>
                        <Button className="mt-4" onClick={() => navigate('/subjects')}>Start Learning</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
