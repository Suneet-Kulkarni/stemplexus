
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface GradeSelectorProps {
  onGradeSelect: (grade: number) => void;
}

const GradeSelector: React.FC<GradeSelectorProps> = ({ onGradeSelect }) => {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  
  const handleGradeChange = (value: string) => {
    setSelectedGrade(parseInt(value));
  };
  
  const handleContinue = () => {
    if (selectedGrade) {
      onGradeSelect(selectedGrade);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to STEMplexus</CardTitle>
        <CardDescription>
          Let's personalize your learning experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="grade">Select your grade</Label>
          <Select onValueChange={handleGradeChange}>
            <SelectTrigger id="grade">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                <SelectItem key={grade} value={grade.toString()}>
                  Grade {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={handleContinue} 
          className="w-full" 
          disabled={!selectedGrade}
        >
          Continue <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default GradeSelector;
