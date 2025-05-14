
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import OptionCard from '../OptionCard';
import QuizNavigation from '../QuizNavigation';

const EnergyQuestion = () => {
  const { quizData, updateQuizData, setCurrentQuestion } = useQuiz();
  
  const options = [
    { label: 'Always tired', value: 'Always tired' },
    { label: 'Some fatigue', value: 'Some fatigue' },
    { label: 'High energy', value: 'High energy' },
  ];

  const handleSelect = (value: string) => {
    updateQuizData('energyLevel', value);
    // Auto progress to next question
    setCurrentQuestion(8);
  };

  const handleNext = () => {
    setCurrentQuestion(8);
  };

  const handleBack = () => {
    setCurrentQuestion(6);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        What is your current energy level?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            value={option.value}
            selected={quizData.energyLevel === option.value}
            onClick={() => handleSelect(option.value)}
            autoConfirm={true}
          />
        ))}
      </div>
      <QuizNavigation 
        isValid={!!quizData.energyLevel} 
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default EnergyQuestion;
