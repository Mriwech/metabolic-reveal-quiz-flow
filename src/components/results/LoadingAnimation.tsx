
import React, { useRef, useEffect } from 'react';
import Lottie from 'react-lottie';
import * as animationData from '@/assets/analysis.json';

const LoadingAnimation: React.FC = () => {
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
  
  // Nettoyer l'animation lorsque le composant est démonté
  useEffect(() => {
    return () => {
      if (lottieRef.current && lottieRef.current.anim) {
        lottieRef.current.anim.destroy();
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
