
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import QuizNavigation from '../QuizNavigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const HeightQuestion = () => {
  const { quizData, updateQuizData, setCurrentQuestion } = useQuiz();
  
  const heights = Array.from({ length: 37 }, (_, i) => {
    const feet = Math.floor((i + 48) / 12);
    const inches = (i + 48) % 12;
    return {
      value: `${feet}'${inches}"`,
      label: `${feet}' ${inches}"`
    };
  });

  const handleChange = (value: string) => {
    updateQuizData('height', value);
  };

  const handleNext = () => {
    setCurrentQuestion(4);
  };

  const handleBack = () => {
    setCurrentQuestion(2);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        What is your height?
      </h2>
      <div className="max-w-xs mx-auto">
        <div className="mb-6">
          <Label htmlFor="height">Select your height</Label>
          <Select 
            value={quizData.height} 
            onValueChange={handleChange}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select height" />
            </SelectTrigger>
            <SelectContent>
              {heights.map((height) => (
                <SelectItem key={height.value} value={height.value}>
                  {height.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <QuizNavigation 
        isValid={!!quizData.height} 
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default HeightQuestion;
