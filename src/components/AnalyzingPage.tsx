
import React, { useEffect, useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Progress } from '@/components/ui/progress';

const AnalyzingPage = () => {
  const { setCurrentQuestion } = useQuiz();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Crunching 127 metabolic data points...");
  
  useEffect(() => {
    // Simulate analyzing data with a sequence of messages
    const messages = [
      "Crunching 127 metabolic data points...",
      "Comparing your profile to 96,400 success cases...",
      "Identifying your hidden fat-loss blockers..."
    ];
    
    let currentStep = 0;
    const totalDuration = 5000; // 5 seconds total
    const stepDuration = totalDuration / messages.length;
    
    // Update progress continuously
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        return newProgress <= 100 ? newProgress : 100;
      });
    }, totalDuration / 100);
    
    // Update messages sequentially
    const messageInterval = setInterval(() => {
      currentStep += 1;
      if (currentStep < messages.length) {
        setMessage(messages[currentStep]);
      } else {
        clearInterval(messageInterval);
      }
    }, stepDuration);
    
    // Move to results after the animation completes
    const timer = setTimeout(() => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      setCurrentQuestion(11); // Move to results page
    }, totalDuration + 500); // Add a small buffer
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [setCurrentQuestion]);

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-3xl font-bold text-center text-brand-darkBlue mb-8">
        Analyzing Your Data
      </h2>
      
      {/* Metabolic Scanner Visualization */}
      <div className="relative h-80 w-full bg-brand-lightBlue rounded-lg mb-8 overflow-hidden">
        {/* Body Outline */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-3/4 bg-white rounded-full mx-auto opacity-70"></div>
        </div>
        
        {/* Problem Areas */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-red-400 animate-pulse-red opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-24 h-12 rounded-full bg-red-400 animate-pulse-red opacity-60"></div>
        
        {/* Scanner Line */}
        <div className="scanner-line animate-scanning"></div>
        
        {/* Simulated Biomarkers */}
        <div className="absolute bottom-4 left-4 right-4 text-left text-sm">
          <div className="mb-1">
            <span className="font-semibold">Mitochondria Efficiency:</span> 
            <span className="ml-2 typing-animation">Loading...</span>
          </div>
          <div className="mb-1">
            <span className="font-semibold">Metabolic Rate:</span> 
            <span className="ml-2 typing-animation">Analyzing...</span>
          </div>
          <div>
            <span className="font-semibold">Visceral Fat Index:</span> 
            <span className="ml-2 typing-animation">Calculating...</span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <Progress value={progress} className="mb-4" />
      
      {/* Status Message */}
      <div className="text-center text-lg font-medium text-brand-darkBlue">
        {message}
      </div>
    </div>
  );
};

export default AnalyzingPage;
