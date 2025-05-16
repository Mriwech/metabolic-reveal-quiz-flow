
import React from 'react';

type MetabolicMetricsProps = {
  metabolicAge: number;
  projectedMonths: number;
};

const MetabolicMetrics: React.FC<MetabolicMetricsProps> = ({ metabolicAge, projectedMonths }) => {
  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="result-metric p-5">
          <h3 className="text-lg font-semibold">
            <span className="mr-2">⏳</span>
            Current Metabolic Age
          </h3>
          <div className="text-3xl font-bold text-red-600 mt-2">
            {metabolicAge} years
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {metabolicAge - 10}+ years above ideal
          </div>
        </div>
        
        <div className="result-metric p-5">
          <h3 className="text-lg font-semibold">
            <span className="mr-2">🗓️</span>
            Projected Goal Timeline
          </h3>
          <div className="text-3xl font-bold text-red-600 mt-2">
            {projectedMonths} months
          </div>
          <div className="text-sm text-gray-600 mt-1">
            with diet & exercise alone
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-brand-darkBlue">
          <span className="mr-2">📊</span>
          Key Metabolic Indicators:
        </h3>
        
        <div className="result-metric bad p-4">
          <h4 className="font-semibold">
            <span className="mr-2">🔥</span>
            Fat-Burning Speed
          </h4>
          <div className="text-lg font-bold text-red-600 mt-1">
            43% slower than optimal
          </div>
        </div>
        
        <div className="result-metric bad p-4">
          <h4 className="font-semibold">
            <span className="mr-2">⚡</span>
            Cellular Energy Production
          </h4>
          <div className="text-lg font-bold text-red-600 mt-1">
            2.1x below healthy levels
          </div>
        </div>
        
        <div className="result-metric bad p-4">
          <h4 className="font-semibold">
            <span className="mr-2">⚠️</span>
            Visceral Fat Risk
          </h4>
          <div className="text-lg font-bold text-red-600 mt-1">
            High
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetabolicMetrics;
