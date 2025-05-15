
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import OptionCard from '../OptionCard';
import QuizNavigation from '../QuizNavigation';
import { GenderFemale, GenderMale } from 'lucide-react';

const GenderQuestion = () => {
  const { quizData, updateQuizData, setCurrentQuestion } = useQuiz();
  
  const options = [
    { 
      label: 'Female', 
      value: 'female', 
      icon: <GenderFemale className="h-12 w-12 text-pink-500" /> 
    },
    { 
      label: 'Male', 
      value: 'male', 
      icon: <GenderMale className="h-12 w-12 text-blue-500" /> 
    },
    { 
      label: 'Other', 
      value: 'other', 
      icon: <span className="text-4xl">⭐</span>
    },
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
        <span className="mr-2">👤</span>
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
            icon={option.icon}
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
