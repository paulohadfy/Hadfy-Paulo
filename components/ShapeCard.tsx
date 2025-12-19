
import React from 'react';

interface ShapeCardProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

const ShapeCard: React.FC<ShapeCardProps> = ({ name, icon, description, onClick, disabled = false }) => {
  const cardClasses = `
    bg-workshop-surface rounded-lg shadow-sm border border-gray-700/50
    flex flex-col items-center justify-center text-center
    transition-all duration-200 ease-in-out transform
    p-3 md:p-6 h-full
    ${disabled
      ? 'opacity-40 cursor-not-allowed'
      : 'hover:bg-gray-700 hover:border-gray-500 hover:shadow-md active:scale-95 cursor-pointer'
    }
  `;

  return (
    <div className={cardClasses} onClick={!disabled ? onClick : undefined}>
      {/* Icon size reduced significantly for mobile compact view */}
      <div className="w-8 h-8 md:w-14 md:h-14 mb-2 md:mb-4 text-workshop-primary transition-colors duration-200 group-hover:text-workshop-primary-hover">
        {icon}
      </div>
      
      {/* Title text size reduced */}
      <h3 className="text-xs md:text-lg font-bold text-workshop-text mb-1 leading-tight">
        {name}
      </h3>
      
      {/* Description made smaller and lighter */}
      <p className="text-[10px] md:text-sm text-workshop-secondary leading-snug line-clamp-2">
        {description}
      </p>
    </div>
  );
};

export default ShapeCard;