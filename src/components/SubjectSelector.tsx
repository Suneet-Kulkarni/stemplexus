
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Atom, Calculator, ChevronLeft, Cpu, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SubjectType = "science" | "technology" | "engineering" | "mathematics";

interface SubjectSelectorProps {
  onSubjectSelect: (subject: SubjectType) => void;
  onBack: () => void;
  selectedGrade: number;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ 
  onSubjectSelect, 
  onBack,
  selectedGrade 
}) => {
  const subjects: { id: SubjectType; name: string; icon: React.ReactNode; description: string }[] = [
    { 
      id: "science", 
      name: "Science", 
      icon: <Microscope className="h-8 w-8" />,
      description: "Explore biology, chemistry, physics and more" 
    },
    { 
      id: "technology", 
      name: "Technology", 
      icon: <Cpu className="h-8 w-8" />,
      description: "Learn about computers, programming and digital systems" 
    },
    { 
      id: "engineering", 
      name: "Engineering", 
      icon: <Atom className="h-8 w-8" />,
      description: "Discover how to design and build structures and machines" 
    },
    { 
      id: "mathematics", 
      name: "Mathematics", 
      icon: <Calculator className="h-8 w-8" />,
      description: "Master numbers, algebra, geometry and calculus" 
    },
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="text-sm text-muted-foreground">Grade {selectedGrade}</div>
        </div>
        <CardTitle className="text-2xl mt-4">Choose a Subject</CardTitle>
        <CardDescription>
          Select a subject to begin your personalized learning journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <Button
              key={subject.id}
              variant="outline"
              className="h-auto p-6 flex flex-col items-center text-left hover:border-primary hover:bg-primary/5 transition-all"
              onClick={() => onSubjectSelect(subject.id)}
            >
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                {subject.icon}
              </div>
              <h3 className="text-lg font-medium">{subject.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 text-center">
                {subject.description}
              </p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectSelector;
