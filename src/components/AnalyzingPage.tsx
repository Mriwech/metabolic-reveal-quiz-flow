
import React, { useEffect, useState, useRef } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Progress } from '@/components/ui/progress';
import Lottie from 'react-lottie';
import * as animationData from '@/assets/analysis.json';

const AnalyzingPage = () => {
  const { setCurrentQuestion } = useQuiz();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Crunching 127 metabolic data points...");
  const lottieRef = useRef<any>(null);
  
  // Configuration pour l'animation Lottie avec une copie sécurisée des données
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: JSON.parse(JSON.stringify(animationData)),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  
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
      if (lottieRef.current && lottieRef.current.anim) {
        lottieRef.current.anim.destroy();
      }
    };
  }, [setCurrentQuestion]);

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-3xl font-bold text-center text-brand-darkBlue mb-8">
        Analyzing Your Data
      </h2>
      
      {/* Metabolic Scanner Visualization */}
      <div className="relative h-80 w-full bg-brand-lightBlue rounded-lg mb-8 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Animation Lottie */}
          <Lottie 
            options={defaultOptions}
            height={200}
            width={200}
            isClickToPauseDisabled={true}
            ref={lottieRef}
          />
        </div>
        
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
