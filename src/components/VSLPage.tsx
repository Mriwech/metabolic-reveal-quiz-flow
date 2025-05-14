
import React, { useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';

const VSLPage = () => {
  const { quizData } = useQuiz();
  
  useEffect(() => {
    // Track view for analytics
    console.log("VSL page viewed", { email: quizData.email });
    
    // Simulate tracking UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    
    console.log("UTM Parameters:", { utmSource, utmMedium, utmCampaign });
    
    // Track event with Facebook Pixel (simulation)
    console.log("Facebook Pixel Event: ViewContent", {
      content_name: "Metabolic Breakthrough VSL",
      user_data: { email: quizData.email }
    });
  }, [quizData]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-brand-darkBlue text-white py-4 text-center">
        <h1 className="text-2xl font-bold">Your Personal Report is Being Generated</h1>
      </div>
      
      {/* VSL Content */}
      <div className="flex-1 bg-gray-100">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Video Placeholder */}
            <div className="aspect-w-16 aspect-h-9 bg-black flex items-center justify-center">
              <div className="text-white text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Watch This Quick Video</h2>
                <p className="mb-8">To understand WHY your metabolism is failing you—and how to fix it in 6 seconds/day.</p>
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-16 border-t-transparent border-b-transparent border-l-white ml-2"></div>
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-center mb-4">
                Your report is being generated!
              </h3>
              <p className="text-gray-700 text-center">
                Watch this quick video to understand WHY your metabolism is failing you—and how to fix it in 6 seconds/day.
              </p>
            </div>
          </div>
          
          {/* Information Box */}
          <div className="mt-8 bg-brand-lightBlue rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">What Lean People Have (And You Don't):</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Efficient mitochondria that burn fat 24/7, even while sleeping</li>
              <li>A metabolic "switch" that prevents fat storage</li>
              <li>The ability to convert food into energy instead of storing it as fat</li>
            </ul>
            <div className="mt-6 font-semibold text-brand-darkBlue">
              Pay close attention to the "forbidden fruit" revelation at 7:42 in the video!
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-200 py-4 text-center text-sm text-gray-600">
        <div className="max-w-4xl mx-auto px-4">
          <p>Copyright © 2025 Metabolic Breakthrough. All Rights Reserved.</p>
          <div className="mt-2">
            <a href="#" className="text-gray-600 hover:text-gray-800 mx-2">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 mx-2">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 mx-2">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VSLPage;
