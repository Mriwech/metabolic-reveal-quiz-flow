
import React, { useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { updateQuizProgress } from '@/lib/analytics';
import QuizHeader from './QuizHeader';
import GenderQuestion from './questions/GenderQuestion';
import AgeQuestion from './questions/AgeQuestion';
import WeightQuestion from './questions/WeightQuestion';
import HeightQuestion from './questions/HeightQuestion';
import TargetWeightQuestion from './questions/TargetWeightQuestion';
import FatAreasQuestion from './questions/FatAreasQuestion';
import DietHistoryQuestion from './questions/DietHistoryQuestion';
import EnergyQuestion from './questions/EnergyQuestion';
import FrustrationQuestion from './questions/FrustrationQuestion';
import ReadinessQuestion from './questions/ReadinessQuestion';
import AnalyzingPage from './AnalyzingPage';
import ResultsPage from './ResultsPage';

const Quiz = () => {
  const { currentQuestion, quizData } = useQuiz();
  
  // Track quiz progress whenever the current question changes
  useEffect(() => {
    const sessionId = localStorage.getItem('quiz_session_id');
    if (sessionId && currentQuestion >= 0 && currentQuestion < 11) {
      updateQuizProgress(sessionId, currentQuestion, quizData);
    }
  }, [currentQuestion, quizData]);

  // Render the appropriate question based on the current question index
  const renderQuestion = () => {
    switch (currentQuestion) {
      case 0: return <GenderQuestion />;
      case 1: return <AgeQuestion />;
      case 2: return <WeightQuestion />;
      case 3: return <HeightQuestion />;
      case 4: return <TargetWeightQuestion />;
      case 5: return <FatAreasQuestion />;
      case 6: return <DietHistoryQuestion />;
      case 7: return <EnergyQuestion />;
      case 8: return <FrustrationQuestion />;
      case 9: return <ReadinessQuestion />;
      case 10: return <AnalyzingPage />;
      case 11: return <ResultsPage />;
      default: return <GenderQuestion />;
    }
  };

  // Only show the header for the actual questions, not for analysis or results
  const showHeader = currentQuestion >= 0 && currentQuestion < 10;

  return (
    <div className="quiz-container">
      {showHeader && <QuizHeader />}
      {renderQuestion()}
    </div>
  );
};

export default Quiz;
