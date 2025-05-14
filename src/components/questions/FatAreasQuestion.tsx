
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import QuizNavigation from '../QuizNavigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const FatAreasQuestion = () => {
  const { quizData, updateQuizData, setCurrentQuestion } = useQuiz();
  
  const options = [
    { label: 'Belly', value: 'Belly' },
    { label: 'Hips', value: 'Hips' },
    { label: 'Arms', value: 'Arms' },
    { label: 'All over', value: 'All over' },
  ];

  const handleToggle = (value: string) => {
    let updatedAreas;
    
    if (value === 'All over') {
      // If "All over" is selected, clear other selections
      updatedAreas = quizData.stubbornFatAreas.includes('All over') 
        ? [] 
        : ['All over'];
    } else {
      // If any other area is selected, remove "All over" if it exists
      const withoutAllOver = quizData.stubbornFatAreas.filter(area => area !== 'All over');
      
      if (withoutAllOver.includes(value)) {
        updatedAreas = withoutAllOver.filter(area => area !== value);
      } else {
        updatedAreas = [...withoutAllOver, value];
      }
    }
    
    updateQuizData('stubbornFatAreas', updatedAreas);
  };

  const handleNext = () => {
    setCurrentQuestion(6);
  };

  const handleBack = () => {
    setCurrentQuestion(4);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Where are your stubborn fat areas?
      </h2>
      <div className="max-w-xs mx-auto">
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <Checkbox 
                id={option.value}
                checked={quizData.stubbornFatAreas.includes(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
              />
              <Label 
                htmlFor={option.value}
                className="text-lg cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <QuizNavigation 
        isValid={quizData.stubbornFatAreas.length > 0} 
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default FatAreasQuestion;
