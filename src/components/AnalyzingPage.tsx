
import React, { useEffect, useState, useRef } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Progress } from '@/components/ui/progress';
import Lottie from 'react-lottie';
import * as animationData from '@/assets/analysis.json';
import { markQuizCompleted } from '@/lib/analytics';

const AnalyzingPage = () => {
  const { setCurrentQuestion } = useQuiz();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Crunching 127 metabolic data points...");
  const lottieRef = useRef<any>(null);
  const [bioMarkers, setBioMarkers] = useState({
    mitochondria: "Loading...",
    metabolicRate: "Analyzing...",
    visceralFat: "Calculating..."
  });
  
  // Configuration for the Lottie animation with a secure copy of the data
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
    
    // Simulate biomarker analysis
    const biomarkerUpdates = [
      {
        mitochondria: "Scanning mitochondrial efficiency...",
        metabolicRate: "Measuring baseline metabolic rate...",
        visceralFat: "Assessing visceral fat distribution..."
      },
      {
        mitochondria: "Detected suboptimal efficiency (62%)",
        metabolicRate: "Baseline: 1,420 kcal/day (below optimal)",
        visceralFat: "Index: 7.3 (moderate risk zone)"
      },
      {
        mitochondria: "FINAL: 38% below optimal range",
        metabolicRate: "FINAL: 22% below age/gender average",
        visceralFat: "FINAL: 31% reduction potential"
      }
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
    
    // Update messages and biomarkers sequentially
    const messageInterval = setInterval(() => {
      currentStep += 1;
      if (currentStep < messages.length) {
        setMessage(messages[currentStep]);
        setBioMarkers(biomarkerUpdates[currentStep]);
      } else {
        clearInterval(messageInterval);
      }
    }, stepDuration);
    
    // Animated pulse effect for scanning
    const scanEffect = document.createElement('div');
    scanEffect.className = 'absolute inset-0 bg-blue-400 opacity-10 animate-pulse rounded-lg z-0';
    const container = document.getElementById('scanner-container');
    if (container) {
      container.appendChild(scanEffect);
    }
    
    // Mark quiz as completed in analytics
    const sessionId = localStorage.getItem('quiz_session_id');
    if (sessionId) {
      markQuizCompleted(sessionId);
    }
    
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
      if (container && scanEffect.parentNode === container) {
        container.removeChild(scanEffect);
      }
    };
  }, [setCurrentQuestion]);

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-3xl font-bold text-center text-brand-darkBlue mb-8">
        Analyzing Your Data
      </h2>
      
      {/* Metabolic Scanner Visualization */}
      <div id="scanner-container" className="relative h-80 w-full bg-brand-lightBlue rounded-lg mb-8 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {/* Animation Lottie */}
          <Lottie 
            options={defaultOptions}
            height={200}
            width={200}
            isClickToPauseDisabled={true}
            ref={lottieRef}
          />
        </div>
        
        {/* Scanner Lines Animation */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-300 to-blue-500 animate-[scanner-line_2s_infinite_linear]"></div>
        
        {/* Simulated Biomarkers */}
        <div className="absolute bottom-4 left-4 right-4 text-left text-sm z-20 bg-black/20 p-3 rounded-md backdrop-blur-sm">
          <div className="mb-1">
            <span className="font-semibold text-white">Mitochondria Efficiency:</span> 
            <span className="ml-2 typing-animation text-cyan-300">{bioMarkers.mitochondria}</span>
          </div>
          <div className="mb-1">
            <span className="font-semibold text-white">Metabolic Rate:</span> 
            <span className="ml-2 typing-animation text-cyan-300">{bioMarkers.metabolicRate}</span>
          </div>
          <div>
            <span className="font-semibold text-white">Visceral Fat Index:</span> 
            <span className="ml-2 typing-animation text-cyan-300">{bioMarkers.visceralFat}</span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <Progress value={progress} className="mb-4 h-2 bg-gray-200" />
      
      {/* Status Message */}
      <div className="text-center text-lg font-medium text-brand-darkBlue">
        {message}
      </div>
      
      {/* Add some global styles for the animations */}
      <style jsx global>{`
        @keyframes scanner-line {
          0% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(320px); opacity: 0.6; }
          51% { opacity: 0; }
          52% { transform: translateY(0); opacity: 0; }
          53% { opacity: 0.8; }
          100% { transform: translateY(320px); opacity: 0.6; }
        }
        
        .typing-animation {
          overflow: hidden;
          border-right: 0.15em solid rgba(0, 255, 255, 0.5);
          white-space: nowrap;
          letter-spacing: 0.05em;
          animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: rgba(0, 255, 255, 0.5) }
        }
      `}</style>
    </div>
  );
};

export default AnalyzingPage;
