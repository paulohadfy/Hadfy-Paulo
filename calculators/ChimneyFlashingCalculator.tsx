
import React, { useState } from 'react';
import CalculatorInput from '../components/CalculatorInput.tsx';
import useLocalStorage from '../hooks/useLocalStorage.ts';

interface ChimneyFlashingCalculatorProps {
  onBack: () => void;
}

type ChimneyType = 'STANDARD' | 'RIDGE' | 'FULL_CLADDING';

const ChimneyFlashingCalculator: React.FC<ChimneyFlashingCalculatorProps> = ({ onBack }) => {
  // Persist Active Type and Inputs
  const [activeType, setActiveType] = useLocalStorage<ChimneyType>('chimney_type', 'STANDARD');
  
  // State for inputs
  const [width, setWidth] = useLocalStorage('chimney_width', '');
  const [length, setLength] = useLocalStorage('chimney_length', '');
  const [roofAngle, setRoofAngle] = useLocalStorage('chimney_angle', '');
  const [frontApron, setFrontApron] = useLocalStorage('chimney_apron', '150'); // Pallsvep/Frontstycke
  const [sideFlashing, setSideFlashing] = useLocalStorage('chimney_side', '150'); // Sidostycke bredd

  // New state for 3D view toggle
  const [show3D, setShow3D] = useState(false);

  const renderVisualGuide = () => {
    return (
      <div className="relative p-6 bg-workshop-surface rounded-lg flex justify-center items-center h-80 border border-gray-700 shadow-inner overflow-hidden">
        
        {/* Toggle 3D Button inside the container */}
        <button 
            onClick={() => setShow3D(!show3D)}
            className="absolute top-4 right-4 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold py-2 px-3 rounded border border-gray-600 z-20 flex items-center gap-2 shadow-lg"
        >
            {show3D ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-workshop-secondary"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    Visa Ritning (2D)
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-workshop-accent"><path d="M12 3l9.66 6.54a1.5 1.5 0 0 1 0 2.92L12 21 .34 12.46a1.5 1.5 0 0 1 0-2.92L12 3z"/><line x1="12" y1="21" x2="12" y2="10"/><line x1="12" y1="10" x2="21.66" y2="12.46"/><line x1="12" y1="10" x2=".34" y2="12.46"/></svg>
                    Visa 3D-modell
                </>
            )}
        </button>

        {show3D ? (
            <div className="w-full h-full flex justify-center items-center perspective-[1000px]">
                <style>
                {`
                    @keyframes rotate3d {
                        from { transform: rotateX(-10deg) rotateY(0deg); }
                        to { transform: rotateX(-10deg) rotateY(360deg); }
                    }
                    .chimney-3d {
                        transform-style: preserve-3d;
                        animation: rotate3d 10s linear infinite;
                    }
                    .face {
                        position: absolute;
                        border: 1px solid #44403c;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: bold;
                        color: rgba(255,255,255,0.8);
                        font-size: 10px;
                        backface-visibility: visible; 
                    }
                    .metal-texture {
                        background: linear-gradient(135deg, #57534e 0%, #78716c 50%, #44403c 100%);
                    }
                    .metal-apron {
                        background: linear-gradient(135deg, #a16207 0%, #d97706 50%, #b45309 100%); /* Copper/Accent look for flashing */
                        opacity: 0.9;
                    }
                `}
                </style>
                <div className="chimney-3d relative w-24 h-40">
                    {/* Front Face (A) */}
                    <div className="face w-24 h-40 metal-texture" style={{ transform: 'translateZ(48px)' }}>
                        FRONT (A)
                        <div className="absolute bottom-0 w-full h-8 metal-apron border-t border-orange-900/50"></div>
                    </div>
                    
                    {/* Back Face */}
                    <div className="face w-24 h-40 metal-texture" style={{ transform: 'rotateY(180deg) translateZ(48px)' }}>
                        BAK
                        <div className="absolute bottom-0 w-full h-12 metal-apron border-t border-orange-900/50"></div>
                    </div>

                    {/* Right Face (B) */}
                    <div className="face w-24 h-40 metal-texture" style={{ transform: 'rotateY(90deg) translateZ(48px)' }}>
                        SIDA (B)
                        <div className="absolute bottom-0 w-full h-10 metal-apron border-t border-orange-900/50" style={{ clipPath: 'polygon(0 100%, 100% 70%, 100% 100%, 0% 100%)' }}></div> {/* Slope illusion */}
                    </div>

                    {/* Left Face */}
                    <div className="face w-24 h-40 metal-texture" style={{ transform: 'rotateY(-90deg) translateZ(48px)' }}>
                        SIDA
                         <div className="absolute bottom-0 w-full h-10 metal-apron border-t border-orange-900/50" style={{ clipPath: 'polygon(0 70%, 100% 100%, 100% 100%, 0% 100%)' }}></div>
                    </div>

                    {/* Top Face */}
                    <div className="face w-24 h-24 bg-stone-800" style={{ transform: 'rotateX(90deg) translateZ(80px)' }}>
                         <div className="w-16 h-16 border-2 border-stone-600 rounded-full"></div>
                    </div>
                </div>
                <div className="absolute bottom-4 text-xs text-gray-500 animate-pulse">Roterar...</div>
            </div>
        ) : (
            // 2D SVG VIEW
            <svg viewBox="0 0 200 150" className="w-full h-full text-workshop-secondary">
            {activeType === 'STANDARD' && (
                <>
                {/* Roof Slope */}
                <line x1="20" y1="120" x2="180" y2="40" stroke="currentColor" strokeWidth="2" />
                {/* Chimney Body */}
                <path d="M 80 90 L 80 30 L 130 30 L 130 65" fill="none" stroke="currentColor" strokeWidth="2" />
                {/* Base */}
                <line x1="80" y1="90" x2="130" y2="65" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                
                {/* Dimensions */}
                <text x="105" y="25" textAnchor="middle" className="text-xs fill-workshop-accent">A (Bredd)</text>
                <text x="65" y="60" textAnchor="end" className="text-xs fill-workshop-accent">H (Höjd)</text>
                <path d="M 150 55 A 20 20 0 0 0 140 70" fill="none" stroke="#d97706" />
                <text x="160" y="70" className="text-xs fill-workshop-accent">{roofAngle || 'V'}°</text>
                </>
            )}

            {activeType === 'RIDGE' && (
                <>
                {/* Ridge Roof */}
                <line x1="20" y1="100" x2="100" y2="40" stroke="currentColor" strokeWidth="2" />
                <line x1="100" y1="40" x2="180" y2="100" stroke="currentColor" strokeWidth="2" />
                {/* Chimney at Ridge */}
                <rect x="85" y="10" width="30" height="50" fill="none" stroke="currentColor" strokeWidth="2" />
                {/* Intersection */}
                <line x1="85" y1="50" x2="100" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="115" y1="50" x2="100" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                
                <text x="100" y="120" textAnchor="middle" className="text-xs fill-workshop-accent">Nockplacering</text>
                </>
            )}

            {activeType === 'FULL_CLADDING' && (
                <>
                {/* Full Chimney */}
                <path d="M 70 120 L 70 20 L 130 20 L 130 90" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="40" y1="135" x2="160" y2="75" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                
                {/* Wrapping lines */}
                <line x1="70" y1="30" x2="130" y2="30" stroke="#d97706" strokeWidth="1" />
                <line x1="70" y1="50" x2="130" y2="50" stroke="#d97706" strokeWidth="1" />
                <line x1="70" y1="70" x2="130" y2="70" stroke="#d97706" strokeWidth="1" />
                
                <text x="100" y="140" textAnchor="middle" className="text-xs fill-workshop-accent">Helskodd / Inklädnad</text>
                </>
            )}
            </svg>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="bg-workshop-surface p-3 rounded-md hover:bg-gray-600 mr-4 text-workshop-text border border-gray-700">&larr; Tillbaka</button>
        <div>
            <h2 className="text-2xl font-bold text-workshop-text">Överbeslag Skorsten</h2>
            <p className="text-sm text-workshop-secondary">Välj typ av beslag och ange mått</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveType('STANDARD')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors border ${activeType === 'STANDARD' ? 'bg-workshop-primary border-red-900 text-white font-bold' : 'bg-workshop-surface border-gray-700 text-workshop-secondary hover:bg-gray-700'}`}
        >
          Standard (Enkelsidigt)
        </button>
        <button 
          onClick={() => setActiveType('RIDGE')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors border ${activeType === 'RIDGE' ? 'bg-workshop-primary border-red-900 text-white font-bold' : 'bg-workshop-surface border-gray-700 text-workshop-secondary hover:bg-gray-700'}`}
        >
          Nockskorsten
        </button>
        <button 
          onClick={() => setActiveType('FULL_CLADDING')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors border ${activeType === 'FULL_CLADDING' ? 'bg-workshop-primary border-red-900 text-white font-bold' : 'bg-workshop-surface border-gray-700 text-workshop-secondary hover:bg-gray-700'}`}
        >
          Helskodd / Inklädnad
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-workshop-surface p-4 rounded-lg border border-gray-700 shadow-md">
            <h3 className="text-lg font-semibold text-workshop-primary mb-4">Grundmått Skorsten</h3>
            <div className="space-y-4">
                <CalculatorInput 
                    label="Skorstensbredd (Front)" 
                    unit="mm" 
                    value={width} 
                    onChange={(e) => setWidth(e.target.value)} 
                    id="width" 
                    symbol="A" 
                />
                <CalculatorInput 
                    label="Skorstenslängd (Sida)" 
                    unit="mm" 
                    value={length} 
                    onChange={(e) => setLength(e.target.value)} 
                    id="length" 
                    symbol="B" 
                />
            </div>
          </div>

          <div className="bg-workshop-surface p-4 rounded-lg border border-gray-700 shadow-md">
            <h3 className="text-lg font-semibold text-workshop-primary mb-4">Tak & Beslag</h3>
            <div className="space-y-4">
                <CalculatorInput 
                    label="Taklutning" 
                    unit="grader" 
                    value={roofAngle} 
                    onChange={(e) => setRoofAngle(e.target.value)} 
                    id="angle" 
                    symbol="V" 
                />
                 <CalculatorInput 
                    label="Pallsvep / Front" 
                    unit="mm" 
                    value={frontApron} 
                    onChange={(e) => setFrontApron(e.target.value)} 
                    id="apron" 
                    symbol="F" 
                />
            </div>
          </div>
          
          <button className="w-full bg-workshop-primary text-workshop-text text-xl font-bold py-4 rounded-lg hover:bg-workshop-primary-hover transition-colors shadow-lg mt-4 opacity-50 cursor-not-allowed border border-red-900" disabled>
            Beräkna Utbredning (Snart)
          </button>
          <p className="text-xs text-center text-workshop-secondary">Kalkylatorn uppdateras med skarpa beräkningsformler inom kort.</p>
        </div>

        {/* Visual Guide Section */}
        <div className="flex flex-col space-y-4">
           <h3 className="text-lg font-semibold text-workshop-text">Visuell Guide</h3>
           {renderVisualGuide()}
           
           <div className="bg-workshop-surface p-4 rounded-lg text-sm text-workshop-secondary space-y-2 border border-gray-700">
             <p><strong className="text-workshop-accent">Standard:</strong> För skorstenar placerade mitt på takfallet. Beräknar bakstycke (rör), sidostycken och framstycke.</p>
             <p><strong className="text-workshop-accent">Nock:</strong> När skorstenen bryter nocklinjen. Kräver dubbla bakstycken eller sadelbeslag.</p>
             <p><strong className="text-workshop-accent">Helskodd:</strong> Dimensionering av plåtpaneler för att täcka hela murens höjd.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChimneyFlashingCalculator;
