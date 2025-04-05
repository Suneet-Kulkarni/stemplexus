
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Subjects from "./pages/Subjects";
import Topics from "./pages/Topics";
import TopicView from "./pages/TopicView";
import Assessment from "./pages/Assessment";
import Challenges from "./pages/Challenges";
import ChallengeView from "./pages/ChallengeView";
import { TooltipProvider } from "./components/ui/tooltip";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subjects" 
              element={
                <ProtectedRoute>
                  <Subjects />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subjects/:subjectId/topics" 
              element={
                <ProtectedRoute>
                  <Topics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/topics/:topicId" 
              element={
                <ProtectedRoute>
                  <TopicView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assessments/:assessmentId" 
              element={
                <ProtectedRoute>
                  <Assessment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/challenges" 
              element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/challenges/:challengeId" 
              element={
                <ProtectedRoute>
                  <ChallengeView />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
