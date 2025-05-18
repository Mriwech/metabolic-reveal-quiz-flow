
import { useState } from 'react';
import { toast } from 'sonner';
import { submitQuizData } from '@/lib/supabase';
import { updateSessionSubmission } from '@/lib/analytics';
import { buildRedirectUrl } from '@/utils/redirectUtils';

export const useQuizSubmission = (quizData: any) => {
  const [submitting, setSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  
  const handleSubmit = async () => {
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
      
      // Get UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmCampaign = urlParams.get('utm_campaign');
      const utmContent = urlParams.get('utm_content');
      
      // Create session ID if not exists
      const sessionId = localStorage.getItem('quiz_session_id') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('quiz_session_id', sessionId);
      
      // Update session to mark email submission
      updateSessionSubmission(sessionId);
      
      // Prepare submission data
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
        metabolic_age: quizData.metabolicAge || 0,
        fat_burning_speed: "43% slower than optimal",
        cellular_energy_production: "2.1x below healthy levels",
        email: quizData.email || ''
      };
      
      // Save to localStorage for backup
      localStorage.setItem('quizData', JSON.stringify(quizData));
      
      // Submit to Supabase
      const { success, error } = await submitQuizData(quizSubmission);
      
      // Send confirmation email using SendGrid template
      const sendEmailResponse = await fetch("https://dzbjugabndesaikxgtpi.supabase.co/functions/v1/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: quizData.email,
          firstName: "",
          utmSource: utmSource || '',
          utmCampaign: utmCampaign || '',
          utmContent: utmContent || ''
        })
      });
      
      // Process email response
      let emailResult;
      try {
        emailResult = await sendEmailResponse.json();
      } catch (e) {
        console.error("Could not parse email response:", e);
        emailResult = { error: "Could not parse response" };
      }
      
      // Handle email result
      if (sendEmailResponse.ok) {
        toast.success("Check your email!", {
          description: "Your full metabolic report has been sent"
        });
      } else {
        console.error("Error sending email:", emailResult);
        toast.error("Could not send email report", {
          description: "But we'll still redirect you to your results"
        });
      }
      
      // Handle submission result
      if (success) {
        toast.success("Data submitted successfully!", {
          description: "Redirecting you to your personalized solution..."
        });
      } else {
        console.error("Error submitting data:", error);
        toast.error("Submission had some issues, but we'll still redirect you", {
          description: "Please check your connection"
        });
      }
      
      // Get redirect URL
      let redirectUrl;
      if (emailResult && emailResult.redirectUrl) {
        redirectUrl = emailResult.redirectUrl;
      } else {
        redirectUrl = buildRedirectUrl(
          utmSource || "direct",
          utmCampaign,
          utmContent
        );
      }
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
      
    } catch (err) {
      console.error("Error in submission process:", err);
      setSubmitting(false);
      setShowLoader(false);
      toast.error("Something went wrong", {
        description: "Please try again later"
      });
    }
  };
  
  return {
    submitting,
    showLoader,
    setShowLoader,
    handleSubmit
  };
};
