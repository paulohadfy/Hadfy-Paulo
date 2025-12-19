
import React, { useState } from 'react';

interface CompanyWebToolProps {
  onBack: () => void;
}

const CompanyWebTool: React.FC<CompanyWebToolProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const url = "https://hallgrens-34912224386.us-west1.run.app/";

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Top Bar for External Link (Minimalistic) */}
      <div className="absolute top-0 left-0 right-0 p-2 z-20 flex justify-end pointer-events-none">
         <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="pointer-events-auto bg-black/50 backdrop-blur-md text-white/80 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors hover:bg-black/70"
        >
          Öppna i webbläsare
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* Floating Back Button - The "Take me back" button */}
      <button
        onClick={onBack}
        className="absolute bottom-6 right-6 z-50 bg-workshop-primary text-white pl-4 pr-6 py-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-2 border-stone-800 hover:bg-workshop-primary-hover active:scale-95 transition-all flex items-center gap-3 group"
      >
        <div className="bg-white/20 p-1.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
        </div>
        <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-wider text-red-200 font-bold leading-none">Avsluta</span>
            <span className="font-bold text-lg leading-none">TILLBAKA</span>
        </div>
      </button>

      {/* Main Content Area */}
      <div className="flex-grow w-full h-full relative bg-gray-100">
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-workshop-surface z-10">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-workshop-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-white text-xl font-bold">Öppnar Hallgrens Portal...</h3>
                </div>
            </div>
        )}
        <iframe 
            src={url}
            title="Hallgrens Web"
            className="w-full h-full border-0 block"
            onLoad={() => setIsLoading(false)}
            allowFullScreen
        />
      </div>
    </div>
  );
};

export default CompanyWebTool;