
import React, { useState } from 'react';
import CalculatorInput from '../components/CalculatorInput.tsx';
import { ConeResult } from '../types.ts';
import { calculateCone } from '../services/calculationService.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

interface ConeCalculatorProps {
  onBack: () => void;
}

const ConeCalculator: React.FC<ConeCalculatorProps> = ({ onBack }) => {
  // Persistence states
  const [largeDia, setLargeDia] = useLocalStorage('cone_largeDia', '200');
  const [smallDia, setSmallDia] = useLocalStorage('cone_smallDia', '100');
  const [height, setHeight] = useLocalStorage('cone_height', '150');

  const [result, setResult] = useState<ConeResult | null>(null);
  const [error, setError] = useState<string>('');
  
  // New state for 3D view toggle
  const [show3D, setShow3D] = useState(false);

  const handleCalculate = () => {
    const D = parseFloat(largeDia);
    const d = parseFloat(smallDia);
    const h = parseFloat(height);

    if (isNaN(D) || isNaN(d) || isNaN(h)) {
        setError('Ange giltiga siffror för alla fält.');
        setResult(null);
        return;
    }

    try {
        const res = calculateCone(D, d, h);
        setResult(res);
        setError('');
    } catch (e) {
        setError((e as Error).message);
        setResult(null);
    }
  };

  const VisualGuide = () => {
    return (
      <div className="relative p-6 bg-workshop-surface rounded-lg flex justify-center items-center h-80 border border-gray-700 shadow-inner overflow-hidden">
        
        {/* Toggle 3D Button */}
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
                        from { transform: rotateX(-15deg) rotateY(0deg); }
                        to { transform: rotateX(-15deg) rotateY(360deg); }
                    }
                    .cone-3d {
                        transform-style: preserve-3d;
                        animation: rotate3d 8s linear infinite;
                    }
                    .metal-grad {
                        background: linear-gradient(135deg, #57534e 0%, #78716c 50%, #44403c 100%);
                    }
                    .plate-profile {
                        position: absolute;
                        width: 100px; /* Width of base */
                        height: 120px;
                        background: rgba(217, 119, 6, 0.15); /* Orange tint */
                        border-left: 2px solid #d97706;
                        border-right: 2px solid #d97706;
                        /* Create trapezoid shape: Top width approx 60px (60%), Bottom 100px */
                        clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%); 
                    }
                `}
                </style>
                
                <div className="cone-3d relative w-24 h-40 flex items-center justify-center">
                    
                    {/* Top Circle (Diameter A) */}
                    <div className="absolute w-16 h-16 rounded-full border-4 border-gray-400 bg-gray-800/80" style={{ transform: 'translateY(-60px) rotateX(90deg)' }}>
                         <div className="absolute inset-0 flex items-center justify-center">
                             <span className="text-[8px] font-bold text-white transform -rotate-90">Liten Ø</span>
                         </div>
                    </div>

                    {/* Bottom Circle (Diameter B) */}
                    <div className="absolute w-28 h-28 rounded-full border-4 border-workshop-accent bg-gray-800/50" style={{ transform: 'translateY(60px) rotateX(90deg)' }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                             <span className="text-[10px] font-bold text-workshop-accent transform -rotate-90 pt-16">Stor Ø</span>
                         </div>
                    </div>

                    {/* Vertical Cross Profile 1 */}
                    <div className="plate-profile" style={{ transform: 'translateZ(0px)' }}></div>
                    
                    {/* Vertical Cross Profile 2 (Rotated 90deg) */}
                    <div className="plate-profile" style={{ transform: 'rotateY(90deg)' }}></div>

                    {/* Center Axis */}
                    <div className="absolute h-32 w-0.5 bg-gray-500 border-dashed border-l border-gray-300 opacity-50"></div>

                </div>
                
                <div className="absolute bottom-4 text-xs text-gray-500 animate-pulse">Roterar...</div>
            </div>
        ) : (
            // 2D SVG VIEW
            <svg viewBox="0 0 200 160" className="max-w-full h-full">
                <title>Visuell guide kon</title>
                {/* Cone Body */}
                <path d="M 50 140 L 150 140 L 130 40 L 70 40 Z" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinejoin="round"/>
                
                {/* Center Line */}
                <line x1="100" y1="30" x2="100" y2="150" stroke="#57534e" strokeWidth="1" strokeDasharray="4,4"/>

                {/* D (Large Dia) */}
                <line x1="50" y1="150" x2="150" y2="150" stroke="#d97706" strokeWidth="1"/>
                <line x1="50" y1="145" x2="50" y2="155" stroke="#d97706" strokeWidth="1"/>
                <line x1="150" y1="145" x2="150" y2="155" stroke="#d97706" strokeWidth="1"/>
                <text x="100" y="158" textAnchor="middle" className="text-xs fill-workshop-accent font-bold">A (Stor Ø)</text>

                {/* d (Small Dia) */}
                <line x1="70" y1="25" x2="130" y2="25" stroke="#d97706" strokeWidth="1"/>
                <line x1="70" y1="20" x2="70" y2="30" stroke="#d97706" strokeWidth="1"/>
                <line x1="130" y1="20" x2="130" y2="30" stroke="#d97706" strokeWidth="1"/>
                <text x="100" y="20" textAnchor="middle" className="text-xs fill-workshop-accent font-bold">B (Liten Ø)</text>

                {/* H (Height) */}
                <line x1="160" y1="40" x2="160" y2="140" stroke="#d97706" strokeWidth="1"/>
                <line x1="155" y1="40" x2="165" y2="40" stroke="#d97706" strokeWidth="1"/>
                <line x1="155" y1="140" x2="165" y2="140" stroke="#d97706" strokeWidth="1"/>
                <text x="175" y="95" className="text-xs fill-workshop-accent font-bold">H</text>
            </svg>
        )}
      </div>
    );
  };

  const ResultDrawing: React.FC<{ res: ConeResult }> = ({ res }) => {
     // Scaled drawing logic
     const width = 300;
     const height = 250;
     const cx = width / 2;
     const cy = height - 20;

     // Scale logic to fit the arc in the box
     const maxR = res.outerRadius;
     const scale = Math.min(width / (maxR * 2), (height * 0.9) / maxR) * 0.8;
     
     const R = res.outerRadius * scale;
     const r = res.innerRadius * scale;
     
     // Angles in radians
     const angleRad = (res.arcAngle * Math.PI) / 180;
     const startAngle = -Math.PI / 2 - angleRad / 2;
     const endAngle = -Math.PI / 2 + angleRad / 2;

     // Calculate points
     // Note: In SVG y grows downwards. We center at bottom (cy) and draw upwards.
     const x1_out = cx + R * Math.cos(startAngle);
     const y1_out = cy + R * Math.sin(startAngle);
     const x2_out = cx + R * Math.cos(endAngle);
     const y2_out = cy + R * Math.sin(endAngle);

     const x1_in = cx + r * Math.cos(startAngle);
     const y1_in = cy + r * Math.sin(startAngle);
     const x2_in = cx + r * Math.cos(endAngle);
     const y2_in = cy + r * Math.sin(endAngle);

     // SVG Path Command
     // M (Move to start inner) -> L (Line to start outer) -> A (Arc to end outer) -> L (Line to end inner) -> A (Arc back to start inner) -> Z
     const largeArcFlag = res.arcAngle > 180 ? 1 : 0;
     
     const pathData = `
        M ${x1_in} ${y1_in}
        L ${x1_out} ${y1_out}
        A ${R} ${R} 0 ${largeArcFlag} 1 ${x2_out} ${y2_out}
        L ${x2_in} ${y2_in}
        A ${r} ${r} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in}
        Z
     `;

     return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-gray-800 rounded border border-gray-700">
            <path d={pathData} fill="#4a5568" stroke="#f6ad55" strokeWidth="2" />
            
            {/* Center point mark (apex) */}
            <circle cx={cx} cy={cy} r="2" fill="red" opacity="0.5" />
            
            {/* Radius Lines visual */}
            <line x1={cx} y1={cy} x2={x2_out} y2={y2_out} stroke="#718096" strokeDasharray="2,2" />
            
            {/* Angle Text */}
            <text x={cx} y={cy - r - 10} textAnchor="middle" className="text-xs fill-white font-bold">{res.arcAngle.toFixed(1)}°</text>
        </svg>
     );
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="bg-workshop-surface p-3 rounded-md hover:bg-gray-600 mr-4 border border-gray-700 text-workshop-text">&larr; Tillbaka</button>
        <div>
            <h2 className="text-2xl font-bold text-workshop-text">Konberäkning</h2>
            <p className="text-sm text-workshop-secondary">Stympad kon (Frustum)</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Inputs */}
         <div className="space-y-6">
            <CalculatorInput 
                label="Stor Diameter" 
                unit="mm" 
                value={largeDia} 
                onChange={(e) => setLargeDia(e.target.value)} 
                id="largeDia" 
                symbol="A" 
            />
            <CalculatorInput 
                label="Liten Diameter" 
                unit="mm" 
                value={smallDia} 
                onChange={(e) => setSmallDia(e.target.value)} 
                id="smallDia" 
                symbol="B" 
            />
            <CalculatorInput 
                label="Vertikal Höjd" 
                unit="mm" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)} 
                id="height" 
                symbol="H" 
            />
            
            <button 
                onClick={handleCalculate} 
                className="w-full bg-workshop-primary text-workshop-text text-xl font-bold py-4 rounded-lg hover:bg-workshop-primary-hover transition-colors shadow-lg border border-red-900 mt-4"
            >
              Beräkna Utbredning
            </button>
         </div>

         {/* Visual Guide */}
         <div>
            <VisualGuide />
         </div>
      </div>

      {error && <div className="mt-6 p-4 bg-red-900/50 border border-red-500 text-white rounded-md animate-pulse">{error}</div>}

      {/* Results */}
      {result && (
         <div className="mt-8 bg-workshop-surface p-6 rounded-xl border border-gray-700 shadow-xl animate-slide-up">
            <h3 className="text-xl font-bold text-workshop-accent mb-6 border-b border-gray-700 pb-2">Resultat</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 font-mono text-lg">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Yttre Radie (R):</span>
                        <span className="font-bold text-white text-xl">{result.outerRadius.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Inre Radie (r):</span>
                        <span className="font-bold text-white text-xl">{result.innerRadius.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Vinkel (α):</span>
                        <span className="font-bold text-workshop-accent text-xl">{result.arcAngle.toFixed(1)}°</span>
                    </div>
                    <div className="flex justify-between pb-2">
                        <span className="text-gray-400 text-sm">Sida (Hypotenusa):</span>
                        <span className="text-gray-300 text-sm">{result.slantHeight.toFixed(1)} mm</span>
                    </div>
                </div>
                
                <div className="flex justify-center">
                    <ResultDrawing res={result} />
                </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default ConeCalculator;
