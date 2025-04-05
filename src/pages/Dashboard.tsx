
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AtomIcon, Award, BookOpen, BrainCircuit, ChevronRight, Clock, FlaskConical, GraduationCap, LineChart, Rocket, Trophy, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

// Mock data for progress charts
const weeklyProgress = [
  { name: 'Mon', progress: 20 },
  { name: 'Tue', progress: 35 },
  { name: 'Wed', progress: 45 },
  { name: 'Thu', progress: 60 },
  { name: 'Fri', progress: 75 },
  { name: 'Sat', progress: 85 },
  { name: 'Sun', progress: 90 },
];

const subjectProgress = [
  { subject: 'Algebra', completed: 65, total: 100 },
  { subject: 'Geometry', completed: 42, total: 100 },
  { subject: 'Biology', completed: 78, total: 100 },
  { subject: 'Chemistry', completed: 30, total: 100 },
  { subject: 'Physics', completed: 55, total: 100 },
];

const recentActivities = [
  {
    id: 1,
    title: 'Completed Algebra Quiz',
    description: 'Scored 85% on Linear Equations',
    time: '2 hours ago',
    icon: <svg className="w-5 h-5 text-stem-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22l-3-3m3 3l3-3m-3 3V10m-9-8l3 3m-3-3l3 3M3 2v12m18-12l-3 3m3-3l-3 3m3-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
  },
  {
    id: 2,
    title: 'Joined Biology Study Group',
    description: 'Cellular Respiration Discussion',
    time: '1 day ago',
    icon: <FlaskConical className="w-5 h-5 text-stem-teal" />,
  },
  {
    id: 3,
    title: 'Earned Achievement',
    description: 'Problem Solver: 50 Math Problems Solved',
    time: '2 days ago',
    icon: <Trophy className="w-5 h-5 text-yellow-500" />,
  },
];

const recommendedCourses = [
  {
    id: 1,
    title: 'Advanced Algebra Concepts',
    description: 'Building on your recent quiz results',
    progress: 0,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    icon: <svg className="w-5 h-5 text-stem-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22l-3-3m3 3l3-3m-3 3V10m-9-8l3 3m-3-3l3 3M3 2v12m18-12l-3 3m3-3l-3 3m3-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
  },
  {
    id: 2,
    title: 'Chemistry Fundamentals',
    description: 'Recommended based on your interests',
    progress: 0,
    image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    icon: <FlaskConical className="w-5 h-5 text-stem-teal" />,
  },
  {
    id: 3,
    title: 'Physics in Everyday Life',
    description: 'Engaging introduction to basic physics',
    progress: 0,
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    icon: <Rocket className="w-5 h-5 text-stem-blue" />,
  },
];

const upcomingChallenges = [
  {
    id: 1,
    title: 'Math Olympics',
    date: 'Starts in 2 days',
    participants: 128,
    difficulty: 'Intermediate',
  },
  {
    id: 2,
    title: 'Science Experiment Challenge',
    date: 'Starts in 5 days',
    participants: 87,
    difficulty: 'Beginner',
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userLoggedIn={true} />
      <main className="flex-grow py-6 md:py-12 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-foreground/70">Welcome back, Taylor! Here's your learning progress.</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button variant="outline" className="flex items-center gap-2">
                <LineChart className="w-4 h-4" />
                View Reports
              </Button>
              <Button className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Resume Learning
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <Award className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-foreground/70">Grade 9 curriculum</p>
                <Progress value={68} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                <Clock className="w-4 h-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 Days</div>
                <p className="text-xs text-foreground/70">Current streak</p>
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 w-full rounded-full ${i < 5 ? 'bg-yellow-500' : 'bg-muted'}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Trophy className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15 / 48</div>
                <p className="text-xs text-foreground/70">Badges earned</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                      <BrainCircuit className="w-3 h-3" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-stem-blue/20 flex items-center justify-center text-stem-blue text-xs">
                      <FlaskConical className="w-3 h-3" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-stem-purple/20 flex items-center justify-center text-stem-purple text-xs">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22l-3-3m3 3l3-3m-3 3V10m-9-8l3 3m-3-3l3 3M3 2v12m18-12l-3 3m3-3l-3 3m3-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/70 text-xs">
                      <span>+12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your activity over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="week">
                  <TabsList className="mb-4">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                  <TabsContent value="week">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyProgress}>
                          <defs>
                            <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => `${value}%`} />
                          <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                          <Area 
                            type="monotone" 
                            dataKey="progress" 
                            stroke="hsl(var(--primary))" 
                            fillOpacity={1} 
                            fill="url(#progressGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="month">
                    <div className="flex items-center justify-center h-80 text-muted-foreground">
                      Monthly data visualization will appear here
                    </div>
                  </TabsContent>
                  <TabsContent value="year">
                    <div className="flex items-center justify-center h-80 text-muted-foreground">
                      Yearly data visualization will appear here
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
                <CardDescription>Completion rate by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={subjectProgress}
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                      <YAxis type="category" dataKey="subject" width={80} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Completed']} />
                      <Bar 
                        dataKey="completed" 
                        radius={[0, 4, 4, 0]}
                        fill="hsl(var(--primary))" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-4">
                  <Link to="/subjects">
                    <Button variant="outline" size="sm" className="flex items-center">
                      View all subjects
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest learning interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-foreground/70">{activity.description}</p>
                        <p className="text-xs text-foreground/50 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="ghost" size="sm" className="w-full flex items-center justify-center">
                    View all activity
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your learning pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedCourses.map((course) => (
                    <div key={course.id} className="flex items-start gap-3">
                      <div className="w-12 h-12 relative rounded-md overflow-hidden flex-shrink-0 bg-primary/10">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {course.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-foreground/70">{course.description}</p>
                        <div className="mt-2">
                          <Link to={`/courses/${course.id}`}>
                            <Button variant="link" size="sm" className="px-0 h-auto text-primary">
                              Start learning
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Challenges</CardTitle>
                <CardDescription>Collaborative competitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingChallenges.map((challenge) => (
                    <div key={challenge.id} className="border rounded-lg p-4">
                      <h3 className="font-medium">{challenge.title}</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-sm text-foreground/70">
                          <Clock className="w-4 h-4 mr-2" />
                          {challenge.date}
                        </div>
                        <div className="flex items-center text-sm text-foreground/70">
                          <Users className="w-4 h-4 mr-2" />
                          {challenge.participants} participants
                        </div>
                        <div className="flex items-center text-sm text-foreground/70">
                          <Award className="w-4 h-4 mr-2" />
                          {challenge.difficulty} difficulty
                        </div>
                      </div>
                      <div className="mt-3">
                        <Link to={`/challenges/${challenge.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Join Challenge
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/challenges">
                    <Button variant="ghost" size="sm" className="w-full flex items-center justify-center">
                      View all challenges
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
