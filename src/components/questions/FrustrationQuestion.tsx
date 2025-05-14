
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import OptionCard from '../OptionCard';
import QuizNavigation from '../QuizNavigation';

const FrustrationQuestion = () => {
  const { quizData, updateQuizData, setCurrentQuestion } = useQuiz();
  
  const options = [
    { label: 'Slow results', value: 'Slow results' },
    { label: 'Regaining weight', value: 'Regaining weight' },
    { label: 'Constant hunger', value: 'Hunger' },
  ];

  const handleSelect = (value: string) => {
    updateQuizData('biggestFrustration', value);
  };

  const handleNext = () => {
    setCurrentQuestion(9);
  };

  const handleBack = () => {
    setCurrentQuestion(7);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        What's your biggest weight loss frustration?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            value={option.value}
            selected={quizData.biggestFrustration === option.value}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>
      <QuizNavigation 
        isValid={!!quizData.biggestFrustration} 
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default FrustrationQuestion;
