
import React from 'react';
import { useQuiz } from '@/context/QuizContext';

const QuizHeader = () => {
  const { currentQuestion } = useQuiz();
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-center text-brand-darkBlue mb-6">
        Metabolic Breakthrough Quiz
      </h1>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div 
          className="progress-bar h-2 rounded-full"
          style={{ width: `${(currentQuestion / 10) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>Start</span>
        <span>Question {currentQuestion + 1} of 10</span>
      </div>
    </div>
  );
};

export default QuizHeader;
