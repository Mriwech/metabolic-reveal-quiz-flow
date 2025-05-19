
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Play } from 'lucide-react';
import { trackVSLButtonClick, trackSession } from '@/lib/analytics';

const VSLPage = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);

  useEffect(() => {
    // Initialize session tracking on page load
    const initTracking = async () => {
      await trackSession();
    };
    
    initTracking();
    
    // Simulate video loading
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = async () => {
    // Track the VSL button click
    const sessionId = localStorage.getItem('quiz_session_id');
    if (sessionId) {
      await trackVSLButtonClick(sessionId);
    }
    
    // Redirect to sales page or next step
    window.location.href = 'https://mitolyn.com/offer';
  };

  const handlePlayClick = () => {
    setShowPlayButton(false);
    setVideoStarted(true);
    // In a real implementation, you would start the video here
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Your Personalized Metabolic Solution
      </h1>
      
      {/* Video Player */}
      <div className="relative aspect-video bg-gray-900 rounded-lg mb-8 overflow-hidden">
        {!videoLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : showPlayButton ? (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={handlePlayClick}
          >
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="h-10 w-10 text-white fill-white" />
            </div>
          </div>
        ) : null}
        
        {videoStarted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-xl">Video playing...</p>
            {/* In a real implementation, this would be replaced with an actual video player */}
          </div>
        )}
      </div>
      
      {/* Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold mb-2">Metabolic Rebalancing</h3>
            <p className="text-sm text-gray-600">
              Our solution targets the root cause of your metabolic slowdown, not just the symptoms.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold mb-2">Cellular Rejuvenation</h3>
            <p className="text-sm text-gray-600">
              Revitalize your cells' energy production for sustainable fat burning.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold mb-2">Personalized Protocol</h3>
            <p className="text-sm text-gray-600">
              Custom-tailored to your unique metabolic profile and health goals.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* CTA Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={handleButtonClick}
          className="text-lg px-8 py-6 h-auto"
        >
          Get Your Personalized Solution <ArrowRight className="ml-2" />
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          Limited-time special offer available now
        </p>
      </div>
    </div>
  );
};

export default VSLPage;
