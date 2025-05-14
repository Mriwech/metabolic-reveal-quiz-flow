
import React from 'react';
import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  value: string;
  selected: boolean;
  image?: string;
  onClick: () => void;
  autoConfirm?: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({ 
  label, 
  value, 
  selected, 
  image,
  onClick,
  autoConfirm = false
}) => {
  const handleClick = () => {
    onClick();
    // If autoConfirm is true, we'll trigger any onClick logic immediately
    // The parent component will handle the navigation
  };

  return (
    <div 
      className={cn(
        "option-card min-h-[80px] flex items-center justify-center p-6",
        selected && "selected"
      )}
      onClick={handleClick}
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
