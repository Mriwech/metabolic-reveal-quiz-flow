
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useResultsSubmission } from '@/hooks/useResultsSubmission';
import ResultsHeader from './results/ResultsHeader';
import LoadingAnimation from './results/LoadingAnimation';
import MetabolicMetrics from './results/MetabolicMetrics';
import ResultsSummary from './results/ResultsSummary';
import EmailForm from './results/EmailForm';

const ResultsPageContainer = () => {
  const { quizData, calculateMetabolicAge, calculateProjectedMonths, isUrgent } = useQuiz();
  const { emailValid, submitting, showLoader, handleEmailChange, handleSubmit } = useResultsSubmission();
  
  const metabolicAge = calculateMetabolicAge();
  const projectedMonths = calculateProjectedMonths();

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      <ResultsHeader showLoader={showLoader} />
      
      {showLoader && <LoadingAnimation />}
      
      {!showLoader && (
        <>
          <MetabolicMetrics 
            metabolicAge={metabolicAge} 
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
