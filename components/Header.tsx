
import React from 'react';
import HallgrensLogo from './HallgrensLogo.tsx';

interface HeaderProps {
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <header className="bg-workshop-surface shadow-2xl border-b border-gray-800 relative z-10 transition-all duration-300">
      {/* Back Button positioned absolute top-right */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-4 right-4 z-20 bg-workshop-bg border border-gray-700 text-workshop-secondary p-2 rounded-full hover:bg-red-900/30 hover:text-white hover:border-red-800 transition-all active:scale-95 group"
          aria-label="Gå tillbaka"
        >
          <div className="flex items-center gap-2 px-1">
             <span className="text-xs font-bold uppercase tracking-wider hidden md:block group-hover:text-red-200">Stäng</span>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
          </div>
        </button>
      )}

      {/* Container centered with extra vertical padding to accommodate larger logo */}
      <div className="container mx-auto px-4 py-4 md:py-6 flex flex-col items-center justify-center">
        <div className={`transform transition-transform duration-500 ${onBack ? 'scale-75 md:scale-90' : 'hover:scale-105'}`}>
            {/* Logo */}
            <HallgrensLogo className="h-24 md:h-48 w-auto filter drop-shadow-xl" />
        </div>
      </div>
    </header>
  );
};

export default Header;