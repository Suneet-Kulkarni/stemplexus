
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ChevronRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tables } from '@/integrations/supabase/types';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

const Assessment = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [assessment, setAssessment] = useState<Tables<'assessments'> | null>(null);
  const [topic, setTopic] = useState<Tables<'topics'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    async function fetchAssessmentData() {
      try {
        setLoading(true);
        
        // Fetch assessment
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', assessmentId)
          .single();

        if (assessmentError) throw assessmentError;
        setAssessment(assessmentData);
        
        // Parse questions from JSON
        if (assessmentData.questions) {
          const parsedQuestions = typeof assessmentData.questions === 'string' 
            ? JSON.parse(assessmentData.questions) 
            : assessmentData.questions;
          
          setQuestions(parsedQuestions);
          setAnswers(new Array(parsedQuestions.length).fill(null));
        }
        
        // Fetch topic
        if (assessmentData.topic_id) {
          const { data: topicData, error: topicError } = await supabase
            .from('topics')
            .select('*')
            .eq('id', assessmentData.topic_id)
            .single();
  
          if (!topicError) {
            setTopic(topicData);
          }
        }
      } catch (error: any) {
        toast({
          title: "Error fetching assessment",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (assessmentId) {
      fetchAssessmentData();
      setStartTime(Date.now());
    }
    
    // Timer for tracking time spent
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [assessmentId, toast, startTime]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    // Save current answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Calculate score and finish assessment
      const correct = newAnswers.filter((answer, index) => 
        answer === questions[index].answer
      ).length;
      
      const finalScore = Math.round((correct / questions.length) * 100);
      setScore(finalScore);
      setShowResult(true);
      
      // Save results to database
      saveAssessmentResults(finalScore);
    }
  };

  const saveAssessmentResults = async (finalScore: number) => {
    if (!user || !assessment || !assessment.topic_id) return;
    
    try {
      // Save to user_progress
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          topic_id: assessment.topic_id,
          assessment_id: assessment.id,
          score: finalScore,
          completed_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Assessment completed",
        description: "Your results have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving results",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container py-8">
      {!showResult && (
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center gap-1" 
          onClick={() => navigate(`/topics/${topic?.id}`)}
        >
          <ArrowLeft className="h-4 w-4" /> 
          Return to Topic
        </Button>
      )}
      
      {loading ? (
        <div className="flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : showResult ? (
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Assessment Results</h2>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>Time: {formatTime(timeSpent)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {score >= 70 ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : (
                    <AlertCircle className="h-16 w-16 text-amber-500" />
                  )}
                </div>
                <h3 className="text-3xl font-bold mb-2">{score}%</h3>
                <p className="text-muted-foreground">
                  {score >= 90 ? "Excellent! You've mastered this topic." :
                   score >= 70 ? "Good job! You're on the right track." :
                   score >= 50 ? "Not bad, but there's room for improvement." :
                   "You might need to review this topic more carefully."}
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Performance Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-muted-foreground mb-1">Correct Answers</p>
                    <p className="text-xl font-semibold">
                      {answers.filter((answer, index) => answer === questions[index].answer).length} / {questions.length}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-muted-foreground mb-1">Time Taken</p>
                    <p className="text-xl font-semibold">{formatTime(timeSpent)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Topic Mastery</h4>
                <Progress value={score} className="h-4" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-6 pt-0">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/topics/${topic?.id}`)}
              >
                Return to Topic
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{assessment?.title}</h1>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
            <Progress 
              value={((currentQuestionIndex + 1) / questions.length) * 100} 
              className="h-2 mt-2" 
            />
          </div>
          
          {currentQuestion && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
                
                <RadioGroup 
                  value={selectedOption?.toString()} 
                  onValueChange={(value) => handleOptionSelect(parseInt(value))}
                  className="space-y-4"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem id={`option-${index}`} value={index.toString()} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 cursor-pointer py-2"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button 
                  className="w-full flex items-center justify-center gap-1" 
                  onClick={handleNextQuestion}
                  disabled={selectedOption === null}
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>Next Question <ChevronRight className="h-4 w-4" /></>
                  ) : (
                    'Complete Assessment'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Assessment;
