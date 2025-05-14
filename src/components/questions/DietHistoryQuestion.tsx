
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import OptionCard from '../OptionCard';
import QuizNavigation from '../QuizNavigation';

const DietHistoryQuestion = () => {
  const { quizData, updateQuizData, setCurrentQuestion } = useQuiz();
  
  const options = [
    { label: 'None', value: '0' },
    { label: '1-3 diets', value: '1-3' },
    { label: '4 or more diets', value: '4+' },
  ];

  const handleSelect = (value: string) => {
    updateQuizData('failedDiets', value);
    // Auto progress to next question
    setCurrentQuestion(7);
  };

  const handleNext = () => {
    setCurrentQuestion(7);
  };

  const handleBack = () => {
    setCurrentQuestion(5);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        How many diet plans have you tried before?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            value={option.value}
            selected={quizData.failedDiets === option.value}
            onClick={() => handleSelect(option.value)}
            autoConfirm={true}
          />
        ))}
      </div>
      <QuizNavigation 
        isValid={!!quizData.failedDiets} 
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default DietHistoryQuestion;
