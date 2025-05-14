
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import OptionCard from '../OptionCard';
import QuizNavigation from '../QuizNavigation';

const ReadinessQuestion = () => {
  const { quizData, updateQuizData, setCurrentQuestion } = useQuiz();
  
  const options = [
    { label: "I'm ready now", value: 'Immediately' },
    { label: 'In the next month', value: 'In 1 month' },
    { label: "I'm not sure yet", value: 'Not sure' },
  ];

  const handleSelect = (value: string) => {
    updateQuizData('readinessToChange', value);
    // Auto progress to next question
    setCurrentQuestion(10); 
  };

  const handleNext = () => {
    setCurrentQuestion(10); // This will move to the analyzing screen
  };

  const handleBack = () => {
    setCurrentQuestion(8);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        When are you ready to transform your metabolism?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            value={option.value}
            selected={quizData.readinessToChange === option.value}
            onClick={() => handleSelect(option.value)}
            autoConfirm={true}
          />
        ))}
      </div>
      <QuizNavigation 
        isValid={!!quizData.readinessToChange} 
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default ReadinessQuestion;
