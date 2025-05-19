
import React, { useEffect } from 'react';
import { QuizProvider } from '@/context/QuizContext';
import Quiz from '@/components/Quiz';
import Footer from '@/components/Footer';
import { trackSession } from '@/lib/analytics';

const Index = () => {
  useEffect(() => {
    // Initialize session tracking when the app first loads
    const initTracking = async () => {
      await trackSession();
    };
    
    initTracking();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <QuizProvider>
          <Quiz />
        </QuizProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
