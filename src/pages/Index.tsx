
import React from 'react';
import { QuizProvider } from '@/context/QuizContext';
import Quiz from '@/components/Quiz';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <QuizProvider>
          <Quiz />
        </QuizProvider>
      </div>
    </div>
  );
};

export default Index;
