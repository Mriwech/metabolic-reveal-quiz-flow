
import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
  
  const handleSubmit = () => {
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setCurrentQuestion(12); // Move to VSL page
      
      // Save data to localStorage for demonstration
      localStorage.setItem('quizData', JSON.stringify(quizData));
      
      // Log UTM parameters if available
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');
      
      console.log('Quiz submitted:', { 
        ...quizData,
        utmSource,
        utmMedium,
        utmCampaign
      });
      
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold mb-4">
          CONGRATS! You Qualify
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-darkBlue mb-2">
          Your Personal Fat-Loss Report
        </h1>
        <p className="text-lg text-gray-600">
          We've identified your unique metabolic profile
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="result-metric">
            <h3 className="text-lg font-semibold">Current Metabolic Age</h3>
            <div className="text-3xl font-bold text-red-600 mt-2">
              {metabolicAge} years
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {metabolicAge - 10}+ years above ideal
            </div>
          </div>
          
          <div className="result-metric">
            <h3 className="text-lg font-semibold">Projected Goal Timeline</h3>
            <div className="text-3xl font-bold text-red-600 mt-2">
              {projectedMonths} months
            </div>
            <div className="text-sm text-gray-600 mt-1">
              with diet & exercise alone
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-brand-darkBlue">Key Metabolic Indicators:</h3>
          
          <div className="result-metric bad">
            <h4 className="font-semibold">Fat-Burning Speed</h4>
            <div className="text-lg font-bold text-red-600 mt-1">
              43% slower than optimal
            </div>
          </div>
          
          <div className="result-metric bad">
            <h4 className="font-semibold">Cellular Energy Production</h4>
            <div className="text-lg font-bold text-red-600 mt-1">
              2.1x below healthy levels
            </div>
          </div>
          
          <div className="result-metric bad">
            <h4 className="font-semibold">Visceral Fat Risk</h4>
            <div className="text-lg font-bold text-red-600 mt-1">
              High
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-brand-lightBlue p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-3">What This Means:</h3>
        <p className="text-gray-800 mb-4">
          Your quiz results indicate a rare mitochondrial deficiency—the root cause of stubborn fat. 
          <span className="font-semibold"> But there's hope...</span>
        </p>
        <p className={`${isUrgent ? 'text-red-600' : 'text-brand-blue'} font-bold`}>
          {isUrgent 
            ? "TIME-SENSITIVE: Your profile matches those who have seen dramatic improvements with our specialized approach."
            : "Your profile matches those who have seen excellent results with our specialized approach."}
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-brand-teal to-brand-blue text-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Enter your email to unlock your FULL report:</h3>
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
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg py-6"
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
