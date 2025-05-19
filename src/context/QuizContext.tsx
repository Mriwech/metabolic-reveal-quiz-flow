
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { updateQuizProgress } from '@/lib/analytics';

// Define types for our quiz state
type QuizData = {
  gender: string;
  ageGroup: string;
  currentWeight: number;
  height: string;
  targetWeight: number;
  stubbornFatAreas: string[];
  failedDiets: string;
  energyLevel: string;
  biggestFrustration: string;
  readinessToChange: string;
  email: string;
};

type QuizContextType = {
  currentQuestion: number;
  quizData: QuizData;
  setCurrentQuestion: (questionNumber: number) => void;
  updateQuizData: (field: keyof QuizData, value: any) => void;
  isHighMotivation: boolean;
  isUrgent: boolean;
  calculateMetabolicAge: () => number;
  calculateProjectedMonths: () => number;
};

const initialQuizData: QuizData = {
  gender: '',
  ageGroup: '',
  currentWeight: 0,
  height: '',
  targetWeight: 0,
  stubbornFatAreas: [],
  failedDiets: '',
  energyLevel: '',
  biggestFrustration: '',
  readinessToChange: '',
  email: '',
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>(initialQuizData);

  // Calculate additional metrics based on the user's inputs
  const isHighMotivation = quizData.currentWeight - quizData.targetWeight > 20;
  const isUrgent = 
    (quizData.ageGroup === '45-60' || quizData.ageGroup === '60+') && 
    quizData.failedDiets === '4+';

  // Track question changes and update analytics
  useEffect(() => {
    // Get session ID
    const sessionId = localStorage.getItem('quiz_session_id');
    if (sessionId) {
      // Track current question and data
      updateQuizProgress(sessionId, currentQuestion, quizData);
    }
  }, [currentQuestion, quizData]);

  // Calculate "metabolic age" for display in results (current age + 10-15 years)
  const calculateMetabolicAge = () => {
    let baseAge = 35; // Default middle age
    
    switch (quizData.ageGroup) {
      case 'Under 30': baseAge = 25; break;
      case '30-45': baseAge = 38; break;
      case '45-60': baseAge = 53; break;
      case '60+': baseAge = 65; break;
    }
    
    // Add 10-15 years based on other factors
    let agingFactor = 10;
    if (quizData.energyLevel === 'Always tired') agingFactor += 5;
    if (quizData.failedDiets === '4+') agingFactor += 2;
    
    return baseAge + agingFactor;
  };

  // Calculate projected months to reach target weight
  const calculateProjectedMonths = () => {
    const weightDifference = quizData.currentWeight - quizData.targetWeight;
    // Base calculation - typically takes 5 months per 10 pounds with conventional methods
    let baseMonths = Math.ceil((weightDifference / 10) * 5);
    
    // Add factors that make it seem more challenging
    if (quizData.energyLevel === 'Always tired') baseMonths += 3;
    if (quizData.failedDiets === '4+') baseMonths += 4;
    if (quizData.ageGroup === '45-60' || quizData.ageGroup === '60+') baseMonths += 3;
    
    // Ensure it's at least 9 months to make the solution seem much better
    return Math.max(baseMonths, 9);
  };

  const updateQuizData = (field: keyof QuizData, value: any) => {
    setQuizData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <QuizContext.Provider 
      value={{ 
        currentQuestion, 
        quizData, 
        setCurrentQuestion, 
        updateQuizData,
        isHighMotivation,
        isUrgent,
        calculateMetabolicAge,
        calculateProjectedMonths
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
