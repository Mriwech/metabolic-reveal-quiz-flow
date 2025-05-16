
import React from 'react';

type ResultsHeaderProps = {
  showLoader: boolean;
};

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ showLoader }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold mb-4">
        🎉 CONGRATS! You Qualify 🎉
      </div>
      <h1 className="text-2xl md:text-4xl font-bold text-brand-darkBlue mb-2">
        Your Personal Fat-Loss Report
      </h1>
      <p className="text-lg text-gray-600">
        We've identified your unique metabolic profile
      </p>
    </div>
  );
};

export default ResultsHeader;
