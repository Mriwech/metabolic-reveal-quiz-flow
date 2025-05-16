
import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { toast } from 'sonner';
import { submitQuizData } from '@/lib/supabase';
import { Check, AlertCircle } from 'lucide-react';
import ResultsHeader from './results/ResultsHeader';
import LoadingAnimation from './results/LoadingAnimation';
import MetabolicMetrics from './results/MetabolicMetrics';
import ResultsSummary from './results/ResultsSummary';
import EmailForm from './results/EmailForm';
import { buildRedirectUrl } from '@/utils/redirectUtils';

const ResultsPage = () => {
  const { quizData, updateQuizData, calculateMetabolicAge, calculateProjectedMonths, isHighMotivation, isUrgent } = useQuiz();
  const [emailValid, setEmailValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  
  const metabolicAge = calculateMetabolicAge();
  const projectedMonths = calculateProjectedMonths();
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    updateQuizData('email', email);
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  };
  
  const handleSubmit = async () => {
    if (!emailValid) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setSubmitting(true);
    setShowLoader(true);
    
    try {
      // Parse height into feet and inches
      let heightFt = 0;
      let heightIn = 0;
      
      if (quizData.height) {
        const match = quizData.height.match(/(\d+)'(\d+)"/);
        if (match) {
          heightFt = parseInt(match[1], 10);
          heightIn = parseInt(match[2], 10);
        }
      }
      
      // Get UTM parameters - uniquement ceux demandés
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmCampaign = urlParams.get('utm_campaign');
      const utmContent = urlParams.get('utm_content');
      
      // Create session ID if not exists
      const sessionId = localStorage.getItem('quiz_session_id') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('quiz_session_id', sessionId);
      
      // Ensure all required fields are present and correctly typed
      const quizSubmission = {
        session_id: sessionId,
        utm_source: utmSource || '',
        utm_campaign: utmCampaign || '',
        utm_content: utmContent || '',
        gender: quizData.gender || 'not_specified',
        age_group: quizData.ageGroup || 'not_specified',
        current_weight: Number(quizData.currentWeight) || 0,
        height_ft: heightFt,
        height_in: heightIn,
        target_weight: Number(quizData.targetWeight) || 0,
        quiz_responses: {
          stubbornFatAreas: quizData.stubbornFatAreas || [],
          failedDiets: quizData.failedDiets || 'not_specified',
          energyLevel: quizData.energyLevel || 'not_specified',
          biggestFrustration: quizData.biggestFrustration || 'not_specified',
          readinessToChange: quizData.readinessToChange || 'not_specified'
        },
        metabolic_age: metabolicAge || 0,
        fat_burning_speed: "43% slower than optimal",
        cellular_energy_production: "2.1x below healthy levels",
        email: quizData.email || ''
      };
      
      console.log("About to submit quiz data:", quizSubmission);
      
      // Save to localStorage for backup
      localStorage.setItem('quizData', JSON.stringify(quizData));
      
      // Submit to Supabase
      const { success, error } = await submitQuizData(quizSubmission);
      
      // Send confirmation email via Edge Function
      const sendEmailResponse = await fetch("https://dzbjugabndesaikxgtpi.supabase.co/functions/v1/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: quizData.email,
          firstName: "", // We haven't collected first name, so leave empty
          utmSource: utmSource || '',
          utmCampaign: utmCampaign || '',
          utmContent: utmContent || ''
        })
      });
      
      // Check if email was sent successfully
      const emailResult = await sendEmailResponse.json();
      
      if (sendEmailResponse.ok) {
        toast.success("Check your email!", {
          description: "Your full metabolic report has been sent",
          icon: <Check className="h-4 w-4" />
        });
        console.log("Email sent successfully:", emailResult);
      } else {
        console.error("Error sending email:", emailResult);
      }
      
      if (success) {
        toast.success("Data submitted successfully!", {
          description: "Redirecting you to your personalized solution...",
          icon: <Check className="h-4 w-4" />
        });
        console.log("Data submission successful!");
      } else {
        console.error("Error submitting data:", error);
        // We still redirect even if there's an error with Supabase
        toast.error("Submission had some issues, but we'll still redirect you", {
          description: "Please check your connection",
          icon: <AlertCircle className="h-4 w-4" />
        });
      }
      
      // Get redirect URL from the email service response or build default one
      let redirectUrl;
      
      if (emailResult && emailResult.redirectUrl) {
        redirectUrl = emailResult.redirectUrl;
      } else {
        // Build the redirect URL using our utility function
        redirectUrl = buildRedirectUrl(
          utmSource,
          utmCampaign,
          utmContent
        );
      }
      
      console.log("Redirecting to:", redirectUrl);
      
      // Redirect to Mitolyn website after a short delay
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
      
    } catch (err) {
      console.error("Error in submission process:", err);
      setSubmitting(false);
      setShowLoader(false);
      toast.error("Something went wrong", {
        description: "Please try again later",
        icon: <AlertCircle className="h-4 w-4" />
      });
    }
  };

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

export default ResultsPage;
