
import React from 'react';

type ResultsSummaryProps = {
  isUrgent: boolean;
};

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ isUrgent }) => {
  return (
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
  );
};

export default ResultsSummary;
