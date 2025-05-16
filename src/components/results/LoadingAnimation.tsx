
import React, { useRef, useEffect } from 'react';
import Lottie from 'react-lottie';
import * as animationData from '@/assets/analysis.json';

const LoadingAnimation: React.FC = () => {
  const lottieRef = useRef(null);
  
  // Configuration for the Lottie animation with a safe copy of the data
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: JSON.parse(JSON.stringify(animationData)),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  
  // Clean up animation when component unmounts
  useEffect(() => {
    return () => {
      if (lottieRef.current) {
        lottieRef.current = null;
      }
    };
  }, []);
  
  return (
    <div className="my-6 flex justify-center">
      <div className="w-40 h-40">
        <Lottie 
          options={defaultOptions}
          height={160}
          width={160}
          isClickToPauseDisabled={true}
          ref={lottieRef}
        />
      </div>
    </div>
  );
};

export default LoadingAnimation;
