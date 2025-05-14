
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import OptionCard from '../OptionCard';
import QuizNavigation from '../QuizNavigation';

const GenderQuestion = () => {
  const { quizData, updateQuizData, setCurrentQuestion } = useQuiz();
  
  const options = [
    { label: 'Female', value: 'female', image: '/placeholder.svg' },
    { label: 'Male', value: 'male', image: '/placeholder.svg' },
    { label: 'Other', value: 'other', image: '/placeholder.svg' },
  ];

  const handleSelect = (value: string) => {
    updateQuizData('gender', value);
    // Auto progress to next question
    setCurrentQuestion(1);
  };

  const handleNext = () => {
    setCurrentQuestion(1);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Select your gender
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            value={option.value}
            selected={quizData.gender === option.value}
            image={option.image}
            onClick={() => handleSelect(option.value)}
            autoConfirm={true}
          />
        ))}
      </div>
      <QuizNavigation 
        isValid={!!quizData.gender} 
        onNext={handleNext} 
      />
    </div>
  );
};

export default GenderQuestion;
