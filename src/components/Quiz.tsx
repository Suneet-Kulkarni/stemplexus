
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SubjectType } from "./SubjectSelector";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  subject: SubjectType;
  grade: number;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ subject, grade, onComplete, onBack }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  // Load questions based on subject and grade
  useEffect(() => {
    // In a real app, these would come from an API
    const getQuestions = () => {
      setLoading(true);
      
      // Simulated questions for Mathematics, grade 6
      let quizQuestions: QuizQuestion[];
      
      if (subject === "mathematics" && grade >= 6 && grade <= 8) {
        quizQuestions = [
          {
            id: 1,
            question: "What is the result of 3/4 + 1/6?",
            options: ["5/6", "11/12", "7/10", "4/5"],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Solve for x: 2x + 5 = 15",
            options: ["x = 5", "x = 10", "x = 7.5", "x = 5.5"],
            correctAnswer: 0
          },
          {
            id: 3,
            question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
            options: ["13 cm²", "26 cm²", "40 cm²", "64 cm²"],
            correctAnswer: 2
          },
          {
            id: 4,
            question: "If a = 3 and b = 4, what is the value of a² + b²?",
            options: ["7", "25", "49", "12"],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "What is the greatest common factor (GCF) of 24 and 36?",
            options: ["6", "12", "18", "9"],
            correctAnswer: 1
          }
        ];
      } else if (subject === "mathematics" && grade >= 9 && grade <= 12) {
        quizQuestions = [
          {
            id: 1,
            question: "Solve for x: 2x² - 5x - 3 = 0",
            options: ["x = 3 or x = -1/2", "x = -3 or x = 1/2", "x = 3/2 or x = -1", "x = -3/2 or x = 1"],
            correctAnswer: 0
          },
          {
            id: 2,
            question: "What is the derivative of f(x) = x³ - 4x² + 7x - 2?",
            options: ["f'(x) = 3x² - 8x + 7", "f'(x) = 3x² - 4x + 7", "f'(x) = x² - 8x + 7", "f'(x) = 3x² - 8x - 2"],
            correctAnswer: 0
          },
          {
            id: 3,
            question: "In a right-angled triangle, if one angle is 30°, what is the other acute angle?",
            options: ["30°", "45°", "60°", "90°"],
            correctAnswer: 2
          },
          {
            id: 4,
            question: "What is the limit of (sin x)/x as x approaches 0?",
            options: ["0", "1", "∞", "Does not exist"],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "If log₁₀(x) = 2, what is the value of x?",
            options: ["20", "100", "200", "1000"],
            correctAnswer: 1
          }
        ];
      } else if (subject === "science" && grade >= 6 && grade <= 8) {
        quizQuestions = [
          {
            id: 1,
            question: "Which of the following is NOT a state of matter?",
            options: ["Solid", "Liquid", "Gas", "Energy"],
            correctAnswer: 3
          },
          {
            id: 2,
            question: "What is the main function of the mitochondria in a cell?",
            options: ["Protein synthesis", "Cell division", "Energy production", "Waste removal"],
            correctAnswer: 2
          },
          {
            id: 3,
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1
          },
          {
            id: 4,
            question: "What is the chemical symbol for water?",
            options: ["H₂O", "CO₂", "O₂", "NaCl"],
            correctAnswer: 0
          },
          {
            id: 5,
            question: "Which of these is a renewable energy source?",
            options: ["Coal", "Natural gas", "Solar power", "Petroleum"],
            correctAnswer: 2
          }
        ];
      } else if (subject === "science" && grade >= 9 && grade <= 12) {
        quizQuestions = [
          {
            id: 1,
            question: "What is the SI unit of electric current?",
            options: ["Volt", "Ampere", "Ohm", "Watt"],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Which of the following is the strongest type of chemical bond?",
            options: ["Ionic bond", "Covalent bond", "Hydrogen bond", "Van der Waals forces"],
            correctAnswer: 0
          },
          {
            id: 3,
            question: "What is the formula for calculating acceleration?",
            options: ["a = v/t", "a = d/t", "a = (v-u)/t", "a = F/m"],
            correctAnswer: 2
          },
          {
            id: 4,
            question: "Which organelle is responsible for protein synthesis in a cell?",
            options: ["Nucleus", "Mitochondria", "Golgi apparatus", "Ribosome"],
            correctAnswer: 3
          },
          {
            id: 5,
            question: "What does DNA stand for?",
            options: ["Deoxyribonucleic Acid", "Diribonucleic Acid", "Deoxyribose Nucleic Acid", "Dioxyribonucleic Acid"],
            correctAnswer: 0
          }
        ];
      } else if (subject === "technology" && grade >= 6 && grade <= 12) {
        quizQuestions = [
          {
            id: 1,
            question: "What does CPU stand for?",
            options: ["Central Processing Unit", "Computer Personal Unit", "Central Processor Utility", "Core Processing Unit"],
            correctAnswer: 0
          },
          {
            id: 2,
            question: "Which of these is NOT a programming language?",
            options: ["Java", "Python", "Excel", "JavaScript"],
            correctAnswer: 2
          },
          {
            id: 3,
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Mode Link", "Hyper Text Modern Link"],
            correctAnswer: 0
          },
          {
            id: 4,
            question: "Which technology is used to record cryptocurrency transactions?",
            options: ["Digital wallet", "Mining", "Blockchain", "Encryption"],
            correctAnswer: 2
          },
          {
            id: 5,
            question: "What is the main function of an operating system?",
            options: ["Run applications", "Manage hardware resources", "Connect to the internet", "Create documents"],
            correctAnswer: 1
          }
        ];
      } else if (subject === "engineering" && grade >= 6 && grade <= 12) {
        quizQuestions = [
          {
            id: 1,
            question: "Which type of engineer designs bridges and dams?",
            options: ["Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Chemical Engineer"],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "What does CAD stand for in engineering?",
            options: ["Computer Aided Design", "Computer Automated Drawing", "Creative Art Design", "Complex Analytical Design"],
            correctAnswer: 0
          },
          {
            id: 3,
            question: "Which material has the highest tensile strength?",
            options: ["Wood", "Concrete", "Steel", "Plastic"],
            correctAnswer: 2
          },
          {
            id: 4,
            question: "What is the purpose of a resistor in an electrical circuit?",
            options: ["Store energy", "Control current flow", "Increase voltage", "Convert AC to DC"],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "Which of these is NOT a renewable energy technology?",
            options: ["Solar panels", "Wind turbines", "Coal power plants", "Hydroelectric dams"],
            correctAnswer: 2
          }
        ];
      } else {
        // Default questions if specific subject/grade combination not found
        quizQuestions = [
          {
            id: 1,
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: 2
          },
          {
            id: 2,
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "Which planet is closest to the sun?",
            options: ["Venus", "Earth", "Mars", "Mercury"],
            correctAnswer: 3
          },
          {
            id: 4,
            question: "What is the largest mammal?",
            options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "How many continents are there?",
            options: ["5", "6", "7", "8"],
            correctAnswer: 2
          }
        ];
      }
      
      setQuestions(quizQuestions);
      setLoading(false);
    };

    getQuestions();
  }, [subject, grade]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Quiz completed
      setShowResult(true);
      
      // Calculate score
      const score = newAnswers.reduce((count, answer, index) => {
        return answer === questions[index].correctAnswer ? count + 1 : count;
      }, 0);
      
      onComplete(score, questions.length);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const newAnswers = [...answers];
      setSelectedOption(newAnswers.pop() || null);
      setAnswers(newAnswers);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (showResult) {
    const correctAnswers = answers.reduce((count, answer, index) => {
      return answer === questions[index].correctAnswer ? count + 1 : count;
    }, 0);
    
    const score = (correctAnswers / questions.length) * 100;
    
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
          <CardDescription>
            You scored {correctAnswers} out of {questions.length} questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="font-medium">{score.toFixed(0)}%</span>
            </div>
            <Progress value={score} className="h-3" />
          </div>
          
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-md p-4">
                <div className="flex items-start gap-3">
                  {answers[index] === question.correctAnswer ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">{question.question}</p>
                    <p className="text-sm mt-1">
                      Your answer: <span className={answers[index] === question.correctAnswer ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {question.options[answers[index]]}
                      </span>
                    </p>
                    {answers[index] !== question.correctAnswer && (
                      <p className="text-sm mt-1 text-green-600">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.location.href = "/dashboard"}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={currentQuestionIndex === 0 ? onBack : handlePrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> 
            {currentQuestionIndex === 0 ? "Back" : "Previous"}
          </Button>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <CardTitle className="text-xl mt-4">{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption?.toString()} className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={index.toString()} 
                id={`option-${index}`} 
                onClick={() => handleOptionSelect(index)}
              />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer py-2">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleNext}>
          {currentQuestionIndex + 1 === questions.length ? "Finish" : "Next"} <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
