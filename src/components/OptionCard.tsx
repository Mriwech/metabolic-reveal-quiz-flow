
import React from 'react';
import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  value: string;
  selected: boolean;
  image?: string;
  onClick: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ 
  label, 
  value, 
  selected, 
  image,
  onClick 
}) => {
  return (
    <div 
      className={cn(
        "option-card",
        selected && "selected"
      )}
      onClick={onClick}
    >
      {image && (
        <div className="mb-3">
          <img src={image} alt={label} className="w-16 h-16 object-contain" />
        </div>
      )}
      <span className="text-center font-medium">{label}</span>
    </div>
  );
};

export default OptionCard;
