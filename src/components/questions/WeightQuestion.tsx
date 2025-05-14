
import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import QuizNavigation from '../QuizNavigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const WeightQuestion = () => {
  const { quizData, updateQuizData, setCurrentQuestion } = useQuiz();
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      updateQuizData('currentWeight', 0);
      setError('Please enter a valid number');
    } else if (value < 50 || value > 500) {
      updateQuizData('currentWeight', value);
      setError('Please enter a weight between 50 and 500 lbs');
    } else {
      updateQuizData('currentWeight', value);
      setError('');
    }
  };

  const handleNext = () => {
    setCurrentQuestion(3);
  };

  const handleBack = () => {
    setCurrentQuestion(1);
  };

  const isValid = quizData.currentWeight >= 50 && quizData.currentWeight <= 500;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        What is your current weight?
      </h2>
      <div className="max-w-xs mx-auto">
        <div className="mb-6">
          <Label htmlFor="currentWeight">Current Weight (lbs)</Label>
          <div className="flex items-center mt-2">
            <Input
              id="currentWeight"
              type="number"
              min="50"
              max="500"
              value={quizData.currentWeight || ''}
              onChange={handleChange}
              placeholder="Enter weight in pounds"
              className="text-lg"
            />
            <span className="ml-2 text-gray-500">lbs</span>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
      <QuizNavigation 
        isValid={isValid} 
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default WeightQuestion;
