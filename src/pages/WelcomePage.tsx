
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GradeSelector from '@/components/GradeSelector';
import SubjectSelector, { SubjectType } from '@/components/SubjectSelector';
import Quiz from '@/components/Quiz';

enum WelcomeStep {
  GradeSelection,
  SubjectSelection,
  Quiz,
}

const WelcomePage = () => {
  const [currentStep, setCurrentStep] = useState<WelcomeStep>(WelcomeStep.GradeSelection);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGradeSelect = async (grade: number) => {
    setSelectedGrade(grade);
    
    // Save grade to user profile in database
    if (user) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ grade })
          .eq('id', user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating user grade:', error);
        toast({
          title: 'Error',
          description: 'Failed to save your grade. Please try again.',
          variant: 'destructive',
        });
      }
    }
    
    // Move to subject selection
    setCurrentStep(WelcomeStep.SubjectSelection);
  };

  const handleSubjectSelect = (subject: SubjectType) => {
    setSelectedSubject(subject);
    setCurrentStep(WelcomeStep.Quiz);
  };

  const handleQuizComplete = async (score: number, total: number) => {
    if (!user || !selectedSubject) return;
    
    try {
      // Save quiz results to database
      // First, get or create a topic for this subject
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('id')
        .eq('name', selectedSubject)
        .eq('difficulty', 'beginner')
        .limit(1);
        
      if (topicsError) throw topicsError;
      
      let topicId: string;
      
      if (topicsData && topicsData.length > 0) {
        topicId = topicsData[0].id;
      } else {
        // Create a new topic for this subject
        const { data: newTopic, error: createError } = await supabase
          .from('topics')
          .insert({
            name: selectedSubject,
            description: `${selectedSubject} fundamentals`,
            difficulty: 'beginner',
            content: { sections: [] }
          })
          .select('id')
          .single();
          
        if (createError) throw createError;
        topicId = newTopic.id;
      }
      
      // Create assessment entry
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          title: `${selectedSubject} Initial Assessment`,
          difficulty: 'beginner',
          topic_id: topicId,
          questions: { total, score } // Simplified for this example
        })
        .select('id')
        .single();
        
      if (assessmentError) throw assessmentError;
      
      // Record user progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          topic_id: topicId,
          assessment_id: assessmentData.id,
          score: Math.round((score / total) * 100)
        });
        
      if (progressError) throw progressError;
      
      // Show success toast
      toast({
        title: 'Assessment Complete',
        description: 'Your results have been saved. Redirecting to dashboard...',
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving quiz results:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your quiz results. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    if (currentStep === WelcomeStep.SubjectSelection) {
      setCurrentStep(WelcomeStep.GradeSelection);
    } else if (currentStep === WelcomeStep.Quiz) {
      setCurrentStep(WelcomeStep.SubjectSelection);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {currentStep === WelcomeStep.GradeSelection && (
            <GradeSelector onGradeSelect={handleGradeSelect} />
          )}
          
          {currentStep === WelcomeStep.SubjectSelection && selectedGrade && (
            <SubjectSelector 
              onSubjectSelect={handleSubjectSelect} 
              onBack={handleBack}
              selectedGrade={selectedGrade}
            />
          )}
          
          {currentStep === WelcomeStep.Quiz && selectedGrade && selectedSubject && (
            <Quiz 
              subject={selectedSubject}
              grade={selectedGrade}
              onComplete={handleQuizComplete}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
