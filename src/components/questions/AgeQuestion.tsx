
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import OptionCard from '../OptionCard';
import QuizNavigation from '../QuizNavigation';

const AgeQuestion = () => {
  const { quizData, updateQuizData, setCurrentQuestion } = useQuiz();
  
  const options = [
    { label: 'Under 30', value: 'Under 30' },
    { label: '30-45', value: '30-45' },
    { label: '45-60', value: '45-60' },
    { label: '60+', value: '60+' },
  ];

  const handleSelect = (value: string) => {
    updateQuizData('ageGroup', value);
    // Auto progress to next question
    setCurrentQuestion(2);
  };

  const handleNext = () => {
    setCurrentQuestion(2);
  };

  const handleBack = () => {
    setCurrentQuestion(0);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        What is your age group?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            value={option.value}
            selected={quizData.ageGroup === option.value}
            onClick={() => handleSelect(option.value)}
            autoConfirm={true}
          />
        ))}
      </div>
      <QuizNavigation 
        isValid={!!quizData.ageGroup} 
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default AgeQuestion;
