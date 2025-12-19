
import React, { useState } from 'react';
import CalculatorInput from '../components/CalculatorInput.tsx';
import { SquareToRoundResult } from '../types.ts';
import { calculateSquareToRound } from '../services/calculationService.ts';
import ResultView from '../components/ResultView.tsx';
import useLocalStorage from '../hooks/useLocalStorage.ts';

interface SquareToRoundCalculatorProps {
  onBack: () => void;
}

const SquareToRoundCalculator: React.FC<SquareToRoundCalculatorProps> = ({ onBack }) => {
  // Persistence applied to inputs
  const [baseWidth, setBaseWidth] = useLocalStorage('sq2rnd_baseWidth', '200');
  const [baseDepth, setBaseDepth] = useLocalStorage('sq2rnd_baseDepth', '200');
  const [topDiameter, setTopDiameter] = useLocalStorage('sq2rnd_topDiameter', '100');
  const [height, setHeight] = useLocalStorage('sq2rnd_height', '150');
  
  const [result, setResult] = useState<SquareToRoundResult | null>(null);
  const [error, setError] = useState<string>('');
  
  // State for 3D view toggle
  const [show3D, setShow3D] = useState(false);

  const handleCalculate = () => {
    const w = parseFloat(baseWidth);
    const d = parseFloat(baseDepth);
    const dia = parseFloat(topDiameter);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(d) || isNaN(dia) || isNaN(h) || w <= 0 || d <= 0 || dia <= 0 || h <= 0) {
      setError('Alla värden måste vara positiva tal.');
      setResult(null);
      return;
    }
    if (dia >= w || dia >= d) {
        setError('Toppdiametern måste vara mindre än basens bredd och djup.');
        setResult(null);
        return;
    }

    try {
      const calcResult = calculateSquareToRound(w, d, dia, h);
      setResult(calcResult);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  const VisualGuide = () => {
    // Parse values for 3D visualization (defaults if empty/invalid to prevent crash)
    const wVal = parseFloat(baseWidth) || 200;
    const dVal = parseFloat(baseDepth) || 200;
    const diaVal = parseFloat(topDiameter) || 100;
    const hVal = parseFloat(height) || 150;

    // Scale logic to fit in the container (~150px max dimension)
    const maxDim = Math.max(wVal, dVal, hVal);
    const scale = 120 / maxDim;

    const sW = wVal * scale;
    const sD = dVal * scale;
    const sDia = diaVal * scale;
    const sH = hVal * scale;

    return (
        <div className="relative p-4 bg-workshop-surface rounded-lg flex justify-center items-center border border-gray-700 h-80 overflow-hidden shadow-inner">
            
            {/* Toggle Button */}
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
                        @keyframes rotateObj {
                            from { transform: rotateX(-20deg) rotateY(0deg); }
                            to { transform: rotateX(-20deg) rotateY(360deg); }
                        }
                        .sq2rnd-scene {
                            transform-style: preserve-3d;
                            animation: rotateObj 10s linear infinite;
                        }
                        .wireframe-face {
                            position: absolute;
                            backface-visibility: visible;
                            border: 1px solid rgba(255,255,255,0.3);
                        }
                        .corner-line {
                            position: absolute;
                            width: 1px;
                            background: rgba(217, 119, 6, 0.8); /* Accent color */
                            transform-origin: top center;
                        }
                    `}
                    </style>
                    
                    <div className="sq2rnd-scene relative w-0 h-0">
                         {/* Top Circle */}
                         <div 
                            className="absolute rounded-full border-2 border-workshop-accent bg-workshop-accent/20"
                            style={{
                                width: `${sDia}px`,
                                height: `${sDia}px`,
                                transform: `translate(-50%, -50%) translateY(${-sH/2}px) rotateX(90deg)`
                            }}
                         >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] text-white font-bold transform -rotate-90">Ø{diaVal}</span>
                            </div>
                         </div>

                         {/* Base Square */}
                         <div 
                            className="absolute border-2 border-gray-400 bg-gray-700/30"
                            style={{
                                width: `${sW}px`,
                                height: `${sD}px`,
                                transform: `translate(-50%, -50%) translateY(${sH/2}px) rotateX(90deg)`
                            }}
                         >
                            <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                <span className="text-[10px] text-gray-400 font-bold">{wVal} x {dVal}</span>
                            </div>
                         </div>

                         {/* Connecting Lines (Corners to roughly 45deg on circle) */}
                         {/* Simplification: We draw 4 lines from corners of base to corners of imaginary bounding box of circle */}
                         {/* Front Left */}
                         <div className="absolute bg-workshop-accent/50 w-0.5" style={{
                             height: `${Math.sqrt(Math.pow(sH,2) + Math.pow((sW-sDia)/2, 2))}px`, // Approx length
                             transformOrigin: 'top center',
                             transform: `translate3d(${-sW/2}px, ${sH/2}px, ${sD/2}px) rotateX(-${Math.atan(sH/((sD-sDia)/2)) * (180/Math.PI) + 90}deg) rotateY(45deg)` // Simplified visual anchor
                         }}></div>
                         
                         {/* Center Axis */}
                         <div className="absolute w-0.5 bg-gray-500 border-dashed border-l border-gray-500 opacity-30" 
                              style={{ height: `${sH + 40}px`, transform: `translateY(-50%)` }}>
                         </div>
                    </div>
                    <div className="absolute bottom-4 text-xs text-gray-500 animate-pulse">Roterar...</div>
                </div>
            ) : (
                <svg viewBox="0 0 200 150" className="max-w-full h-auto">
                    <title>Visuell guide för fyrkant-till-rund</title>
                    {/* Base square */}
                    <path d="M 50 130 L 150 130 L 180 110 L 80 110 Z" fill="none" stroke="#a8a29e" strokeWidth="1"/>
                    <path d="M 50 130 L 80 110" fill="none" stroke="#a8a29e" strokeWidth="1"/>
                    {/* Top circle */}
                    <ellipse cx="115" cy="40" rx="30" ry="10" fill="none" stroke="#a8a29e" strokeWidth="1"/>
                    {/* Connecting lines */}
                    <path d="M 50 130 L 85 40" fill="none" stroke="#a8a29e" strokeDasharray="2,2" strokeWidth="1"/>
                    <path d="M 150 130 L 145 40" fill="none" stroke="#a8a29e" strokeDasharray="2,2" strokeWidth="1"/>
                    <path d="M 80 110 L 85 40" fill="none" stroke="#a8a29e" strokeDasharray="2,2" strokeWidth="1"/>
                    <path d="M 180 110 L 145 40" fill="none" stroke="#a8a29e" strokeDasharray="2,2" strokeWidth="1"/>
                    {/* Dimensions */}
                    <text x="95" y="145" className="text-xs fill-current text-workshop-accent">A (Bredd)</text>
                    <text x="160" y="125" className="text-xs fill-current text-workshop-accent -rotate-15">B (Djup)</text>
                    <text x="115" y="25" className="text-xs fill-current text-workshop-accent">D (Diameter)</text>
                    <line x1="20" y1="40" x2="20" y2="120" stroke="#d97706" strokeWidth="0.5"/>
                    <text x="25" y="85" className="text-xs fill-current text-workshop-accent -rotate-90">H (Höjd)</text>
                </svg>
            )}
        </div>
    );
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="bg-workshop-surface p-3 rounded-md hover:bg-gray-600 mr-4 border border-gray-700">&larr; Tillbaka</button>
        <h2 className="text-2xl font-bold text-workshop-text">Fyrkant till Rund</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <CalculatorInput label="Bredd bas" unit="mm" value={baseWidth} onChange={(e) => setBaseWidth(e.target.value)} id="baseWidth" symbol="A" />
          <CalculatorInput label="Djup bas" unit="mm" value={baseDepth} onChange={(e) => setBaseDepth(e.target.value)} id="baseDepth" symbol="B" />
          <CalculatorInput label="Diameter topp" unit="mm" value={topDiameter} onChange={(e) => setTopDiameter(e.target.value)} id="topDiameter" symbol="D" />
          <CalculatorInput label="Höjd" unit="mm" value={height} onChange={(e) => setHeight(e.target.value)} id="height" symbol="H" />
        </div>
        <VisualGuide />
      </div>

      <div className="mt-8">
        <button onClick={handleCalculate} className="w-full bg-workshop-primary text-workshop-text text-2xl font-bold py-4 rounded-lg hover:bg-workshop-primary-hover transition-colors shadow-lg border border-red-900">
          Beräkna
        </button>
      </div>

      {error && <div className="mt-6 p-4 bg-red-900/50 border border-red-500 text-white rounded-md">{error}</div>}
      
      {result && (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-workshop-accent">Resultat - Utbredning (1/4 del)</h3>
            <ResultView result={result} />
        </div>
      )}
    </div>
  );
};

export default SquareToRoundCalculator;
