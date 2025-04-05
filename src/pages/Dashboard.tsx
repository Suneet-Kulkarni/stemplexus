import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {user ? (
        <>
          <p className="mb-4">
            Welcome, {user.email}! You are now logged in.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Subjects</CardTitle>
                <CardDescription>Explore available subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse a wide range of subjects and start learning.
                </p>
              </CardContent>
              <Button variant="default" className="w-full" onClick={() => navigate('/subjects')}>
                View Subjects
              </Button>
            </Card>

            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Challenges</CardTitle>
                <CardDescription>Test your knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Take on challenges and improve your skills.
                </p>
              </CardContent>
              <Button variant="default" className="w-full" onClick={() => navigate('/challenges')}>
                View Challenges
              </Button>
            </Card>

            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Assessments</CardTitle>
                <CardDescription>Evaluate your understanding</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Take assessments to check your knowledge.
                </p>
              </CardContent>
              <Button variant="default" className="w-full" onClick={() => navigate('/assessments/some-assessment-id')}>
                View Assessments
              </Button>
            </Card>
          </div>

          <Button variant="destructive" className="mt-8" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <p>Please login to access the dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
