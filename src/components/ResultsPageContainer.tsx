
import React, { useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useResultsSubmission } from '@/hooks/useResultsSubmission';
import ResultsHeader from './results/ResultsHeader';
import LoadingAnimation from './results/LoadingAnimation';
import MetabolicMetrics from './results/MetabolicMetrics';
import ResultsSummary from './results/ResultsSummary';
import EmailForm from './results/EmailForm';

const ResultsPageContainer = () => {
  const { quizData, calculateMetabolicAge, calculateProjectedMonths, isUrgent, updateQuizData } = useQuiz();
  const { emailValid, submitting, showLoader, handleEmailChange, handleSubmit } = useResultsSubmission();
  
  // Calculate and set metabolic age when component mounts
  useEffect(() => {
    const metabolicAge = calculateMetabolicAge();
    updateQuizData('metabolicAge', metabolicAge);
  }, [calculateMetabolicAge, updateQuizData]);
  
  const projectedMonths = calculateProjectedMonths();

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      <ResultsHeader showLoader={showLoader} />
      
      {showLoader && <LoadingAnimation />}
      
      {!showLoader && (
        <>
          <MetabolicMetrics 
            metabolicAge={quizData.metabolicAge || 0} 
            projectedMonths={projectedMonths} 
          />
          
          <ResultsSummary isUrgent={isUrgent} />
        </>
      )}
      
      <EmailForm 
        email={quizData.email || ''}
        emailValid={emailValid}
        submitting={submitting}
        handleEmailChange={handleEmailChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default ResultsPageContainer;
