
import React, { useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { trackSession } from '@/lib/analytics';
import ResultsHeader from './results/ResultsHeader';
import LoadingAnimation from './results/LoadingAnimation';
import MetabolicMetrics from './results/MetabolicMetrics';
import ResultsSummary from './results/ResultsSummary';
import EmailForm from './results/EmailForm';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { useQuizSubmission } from '@/hooks/useQuizSubmission';

const ResultsPage = () => {
  const { quizData, calculateMetabolicAge, calculateProjectedMonths, isHighMotivation, isUrgent } = useQuiz();
  const { email, emailValid, handleEmailChange } = useEmailValidation();
  const { submitting, showLoader, setShowLoader, handleSubmit } = useQuizSubmission({...quizData, email});
  
  const metabolicAge = calculateMetabolicAge();
  const projectedMonths = calculateProjectedMonths();
  
  useEffect(() => {
    // Track user session when the results page is loaded
    const initTracking = async () => {
      await trackSession();
    };
    
    initTracking();
  }, []);

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
        email={email}
        emailValid={emailValid}
        submitting={submitting}
        handleEmailChange={handleEmailChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default ResultsPage;
