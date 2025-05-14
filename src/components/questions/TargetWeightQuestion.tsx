
import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import QuizNavigation from '../QuizNavigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TargetWeightQuestion = () => {
  const { quizData, updateQuizData, setCurrentQuestion } = useQuiz();
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      updateQuizData('targetWeight', 0);
      setError('Please enter a valid number');
    } else if (value < 50 || value > 500) {
      updateQuizData('targetWeight', value);
      setError('Please enter a weight between 50 and 500 lbs');
    } else if (value >= quizData.currentWeight) {
      updateQuizData('targetWeight', value);
      setError('Target weight should be less than your current weight');
    } else {
      updateQuizData('targetWeight', value);
      setError('');
    }
  };

  const handleNext = () => {
    setCurrentQuestion(5);
  };

  const handleBack = () => {
    setCurrentQuestion(3);
  };

  const isValid = quizData.targetWeight >= 50 && 
                  quizData.targetWeight <= 500 && 
                  quizData.targetWeight < quizData.currentWeight;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        What is your target weight?
      </h2>
      <div className="max-w-xs mx-auto">
        <div className="mb-6">
          <Label htmlFor="targetWeight">Target Weight (lbs)</Label>
          <div className="flex items-center mt-2">
            <Input
              id="targetWeight"
              type="number"
              min="50"
              max="500"
              value={quizData.targetWeight || ''}
              onChange={handleChange}
              placeholder="Enter target weight in pounds"
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

export default TargetWeightQuestion;
