
import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { submitQuizData } from '@/lib/supabase';
import { Check, AlertCircle } from 'lucide-react';

const ResultsPage = () => {
  const { quizData, updateQuizData, setCurrentQuestion, isHighMotivation, isUrgent, calculateMetabolicAge, calculateProjectedMonths } = useQuiz();
  const [emailValid, setEmailValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
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
    setSubmitting(true);
    
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
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');
      const utmTerm = urlParams.get('utm_term');
      const utmContent = urlParams.get('utm_content');
      const trafficType = urlParams.get('traffic_type');
      const trafficSource = urlParams.get('traffic_source');
      const campaign = urlParams.get('campaign');
      const adgroup = urlParams.get('adgroup');
      const ad = urlParams.get('ad');
      const creative = urlParams.get('creative');
      
      // Create session ID if not exists
      const sessionId = localStorage.getItem('quiz_session_id') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('quiz_session_id', sessionId);
      
      // Ensure all required fields are present and correctly typed
      const quizSubmission = {
        session_id: sessionId,
        utm_source: utmSource || trafficSource || '',
        utm_medium: utmMedium || trafficType || '',
        utm_campaign: utmCampaign || campaign || '',
        utm_term: utmTerm || '',
        utm_content: utmContent || creative || '',
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
      
      // Build the redirect URL with mapped parameters
      let redirectUrl = "https://mitolyn.com/science/?shield=34006jve54p94p7hmhxf2g7wbe";
      
      // Map Facebook parameters to ClickBank parameters
      if (utmSource) redirectUrl += `&tid=${encodeURIComponent(utmSource)}`;
      if (trafficType) redirectUrl += `&utm_medium=${encodeURIComponent(trafficType)}`;
      if (trafficSource) redirectUrl += `&utm_source=${encodeURIComponent(trafficSource)}`;
      if (campaign) redirectUrl += `&cbname=${encodeURIComponent(campaign)}`;
      if (adgroup) redirectUrl += `&cbfid=${encodeURIComponent(adgroup)}`;
      if (ad) redirectUrl += `&cbaff=${encodeURIComponent(ad)}`;
      if (creative) redirectUrl += `&creative=${encodeURIComponent(creative)}`;
      
      // Add email to the URL
      redirectUrl += `&email=${encodeURIComponent(quizData.email || '')}`;
      
      console.log("Redirecting to:", redirectUrl);
      
      // Redirect to Mitolyn website after a short delay
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
      
    } catch (err) {
      console.error("Error in submission process:", err);
      setSubmitting(false);
      toast.error("Something went wrong", {
        description: "Please try again later",
        icon: <AlertCircle className="h-4 w-4" />
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold mb-4">
          🎉 CONGRATS! You Qualify 🎉
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-brand-darkBlue mb-2">
          Your Personal Fat-Loss Report
        </h1>
        <p className="text-lg text-gray-600">
          We've identified your unique metabolic profile
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="result-metric p-5">
            <h3 className="text-lg font-semibold">
              <span className="mr-2">⏳</span>
              Current Metabolic Age
            </h3>
            <div className="text-3xl font-bold text-red-600 mt-2">
              {metabolicAge} years
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {metabolicAge - 10}+ years above ideal
            </div>
          </div>
          
          <div className="result-metric p-5">
            <h3 className="text-lg font-semibold">
              <span className="mr-2">🗓️</span>
              Projected Goal Timeline
            </h3>
            <div className="text-3xl font-bold text-red-600 mt-2">
              {projectedMonths} months
            </div>
            <div className="text-sm text-gray-600 mt-1">
              with diet & exercise alone
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-brand-darkBlue">
            <span className="mr-2">📊</span>
            Key Metabolic Indicators:
          </h3>
          
          <div className="result-metric bad p-4">
            <h4 className="font-semibold">
              <span className="mr-2">🔥</span>
              Fat-Burning Speed
            </h4>
            <div className="text-lg font-bold text-red-600 mt-1">
              43% slower than optimal
            </div>
          </div>
          
          <div className="result-metric bad p-4">
            <h4 className="font-semibold">
              <span className="mr-2">⚡</span>
              Cellular Energy Production
            </h4>
            <div className="text-lg font-bold text-red-600 mt-1">
              2.1x below healthy levels
            </div>
          </div>
          
          <div className="result-metric bad p-4">
            <h4 className="font-semibold">
              <span className="mr-2">⚠️</span>
              Visceral Fat Risk
            </h4>
            <div className="text-lg font-bold text-red-600 mt-1">
              High
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-brand-lightBlue p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-3">
          <span className="mr-2">💡</span>
          What This Means:
        </h3>
        <p className="text-gray-800 mb-4">
          Your quiz results indicate a rare mitochondrial deficiency—the root cause of stubborn fat. 
          <span className="font-semibold"> But there's hope...</span>
        </p>
        <p className={`${isUrgent ? 'text-red-600' : 'text-brand-blue'} font-bold`}>
          {isUrgent 
            ? "⏰ TIME-SENSITIVE: Your profile matches those who have seen dramatic improvements with our specialized approach."
            : "✨ Your profile matches those who have seen excellent results with our specialized approach."}
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-brand-teal to-brand-blue text-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">
          <span className="mr-2">📧</span>
          Enter your email to unlock your FULL report:
        </h3>
        <p className="mb-4">Complete with 3-step solution blueprint tailored to your metabolism</p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <Input
              id="email"
              type="email"
              className="bg-white text-black mt-1"
              placeholder="Your email address"
              value={quizData.email}
              onChange={handleEmailChange}
            />
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!emailValid || submitting}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-base sm:text-lg py-6 px-4 max-w-full whitespace-normal h-auto"
          >
            {submitting ? "Processing..." : "SEND MY REPORT & WATCH VIDEO"}
          </Button>
          
          <div className="text-xs text-center opacity-75">
            Your privacy is protected. We will never spam you or sell your data.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
