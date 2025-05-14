
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';

interface QuizNavigationProps {
  isValid: boolean;
  onNext: () => void;
  onBack?: () => void;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({ 
  isValid, 
  onNext, 
  onBack 
}) => {
  const { currentQuestion } = useQuiz();

  return (
    <div className="flex justify-between mt-8">
      {currentQuestion > 0 ? (
        <Button 
          variant="outline" 
          onClick={onBack}
          className="px-8"
        >
          Back
        </Button>
      ) : (
        <div></div>
      )}
      <Button 
        onClick={onNext}
        disabled={!isValid}
        className="px-8 bg-brand-blue hover:bg-brand-blue/90"
      >
        {currentQuestion === 9 ? "See Results" : "Continue"}
      </Button>
    </div>
  );
};

export default QuizNavigation;
