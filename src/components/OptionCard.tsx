
import React from 'react';

type OptionCardProps = {
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
  image?: string;
  description?: string;
  autoConfirm?: boolean;
  icon?: React.ReactNode;
};

const OptionCard: React.FC<OptionCardProps> = ({ 
  label, 
  selected, 
  onClick, 
  image, 
  description, 
  icon 
}) => {
  return (
    <div 
      className={`option-card ${selected ? 'selected' : ''} transition-all`}
      onClick={onClick}
    >
      {icon && (
        <div className="mb-3">
          {icon}
        </div>
      )}
      
      {image && (
        <div className="mb-3">
          <img src={image} alt={label} className="h-16 w-16 object-contain mx-auto" />
        </div>
      )}
      
      <div className="text-lg font-medium text-center">{label}</div>
      
      {description && (
        <div className="text-sm text-gray-500 text-center mt-1">{description}</div>
      )}
      
      {selected && (
        <div className="absolute top-2 right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default OptionCard;
