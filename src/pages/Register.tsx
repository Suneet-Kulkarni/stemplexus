
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Braces, ChevronLeft, FlaskConical, GraduationCap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const [activeTab, setActiveTab] = useState("student");
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Student form state
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentLastName, setStudentLastName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [gradeLevel, setGradeLevel] = useState('7');
  const [interests, setInterests] = useState<string[]>([]);
  
  // Parent form state
  const [parentFirstName, setParentFirstName] = useState('');
  const [parentLastName, setParentLastName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [childrenCount, setChildrenCount] = useState('1');
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };
  
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentFirstName || !studentLastName || !studentEmail || !studentPassword) {
      toast({
        title: "Registration error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const userData = {
        full_name: `${studentFirstName} ${studentLastName}`,
        first_name: studentFirstName,
        last_name: studentLastName,
        grade: parseInt(gradeLevel, 10),
        role: 'student',
        interests: interests,
      };
      
      await signUp(studentEmail, studentPassword, userData);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!parentFirstName || !parentLastName || !parentEmail || !parentPassword) {
      toast({
        title: "Registration error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const userData = {
        full_name: `${parentFirstName} ${parentLastName}`,
        first_name: parentFirstName,
        last_name: parentLastName,
        role: 'parent',
        children_count: parseInt(childrenCount, 10),
      };
      
      await signUp(parentEmail, parentPassword, userData);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Link to="/" className="inline-flex items-center text-foreground/70 hover:text-primary mb-6">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to home
            </Link>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                  Get started with STEMplexus and begin your personalized learning journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="student" className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Student
                    </TabsTrigger>
                    <TabsTrigger value="parent" className="flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21V19C9 17.9391 9.42143 16.9217 10.1716 16.1716C10.9217 15.4214 11.9391 15 13 15H19C20.0609 15 21.0783 15.4214 21.8284 16.1716C22.5786 16.9217 23 17.9391 23 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 11C18.2091 11 20 9.20914 20 7C20 4.79086 18.2091 3 16 3C13.7909 3 12 4.79086 12 7C12 9.20914 13.7909 11 16 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 21V19C4 17.9391 4.42143 16.9217 5.17157 16.1716C5.92172 15.4214 6.93913 15 8 15H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 7C9 9.20914 7.20914 11 5 11C2.79086 11 1 9.20914 1 7C1 4.79086 2.79086 3 5 3C7.20914 3 9 4.79086 9 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Parent
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="student">
                    <form onSubmit={handleStudentSubmit} className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First name</Label>
                          <Input 
                            id="firstName" 
                            value={studentFirstName}
                            onChange={(e) => setStudentFirstName(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input 
                            id="lastName" 
                            value={studentLastName}
                            onChange={(e) => setStudentLastName(e.target.value)}
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade Level</Label>
                        <Select 
                          value={gradeLevel} 
                          onValueChange={setGradeLevel}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6th Grade</SelectItem>
                            <SelectItem value="7">7th Grade</SelectItem>
                            <SelectItem value="8">8th Grade</SelectItem>
                            <SelectItem value="9">9th Grade</SelectItem>
                            <SelectItem value="10">10th Grade</SelectItem>
                            <SelectItem value="11">11th Grade</SelectItem>
                            <SelectItem value="12">12th Grade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Subjects of Interest</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            type="button" 
                            variant={interests.includes('math') ? "default" : "outline"} 
                            className="flex items-center gap-2 justify-start h-auto py-2"
                            onClick={() => toggleInterest('math')}
                          >
                            <svg className={`w-4 h-4 ${interests.includes('math') ? "text-white" : "text-stem-purple"}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 22l-3-3m3 3l3-3m-3 3V10m-9-8l3 3m-3-3l3 3M3 2v12m18-12l-3 3m3-3l-3 3m3-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Math
                          </Button>
                          <Button 
                            type="button" 
                            variant={interests.includes('science') ? "default" : "outline"} 
                            className="flex items-center gap-2 justify-start h-auto py-2"
                            onClick={() => toggleInterest('science')}
                          >
                            <FlaskConical className={`w-4 h-4 ${interests.includes('science') ? "text-white" : "text-stem-teal"}`} />
                            Science
                          </Button>
                          <Button 
                            type="button" 
                            variant={interests.includes('coding') ? "default" : "outline"} 
                            className="flex items-center gap-2 justify-start h-auto py-2"
                            onClick={() => toggleInterest('coding')}
                          >
                            <Braces className={`w-4 h-4 ${interests.includes('coding') ? "text-white" : "text-stem-blue"}`} />
                            Coding
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full mt-6"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="parent">
                    <form onSubmit={handleParentSubmit} className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parentFirstName">First name</Label>
                          <Input 
                            id="parentFirstName" 
                            value={parentFirstName}
                            onChange={(e) => setParentFirstName(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentLastName">Last name</Label>
                          <Input 
                            id="parentLastName" 
                            value={parentLastName}
                            onChange={(e) => setParentLastName(e.target.value)}
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="parentEmail">Email</Label>
                        <Input 
                          id="parentEmail" 
                          type="email" 
                          value={parentEmail}
                          onChange={(e) => setParentEmail(e.target.value)}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="parentPassword">Password</Label>
                        <Input 
                          id="parentPassword" 
                          type="password" 
                          value={parentPassword}
                          onChange={(e) => setParentPassword(e.target.value)}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="childrenCount">Number of Children</Label>
                        <Select 
                          value={childrenCount} 
                          onValueChange={setChildrenCount}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select number" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full mt-6"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Parent Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-6">
                <p className="text-sm text-foreground/70">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
