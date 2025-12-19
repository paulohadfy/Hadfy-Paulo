
import React, { useState } from 'react';
import CalculatorInput from '../components/CalculatorInput.tsx';
import { SegmentBendResult } from '../types.ts';
import { calculateSegmentBend } from '../services/calculationService.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

interface SegmentBendCalculatorProps {
  onBack: () => void;
}

const SegmentBendCalculator: React.FC<SegmentBendCalculatorProps> = ({ onBack }) => {
  // Inputs stored in local storage
  const [diameter, setDiameter] = useLocalStorage('seg_diameter', '100');
  const [radius, setRadius] = useLocalStorage('seg_radius', '150');
  const [angle, setAngle] = useLocalStorage('seg_angle', '90');
  const [segments, setSegments] = useLocalStorage('seg_segments', '3'); // Standard 3 pieces (2 welds)

  const [result, setResult] = useState<SegmentBendResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    const d = parseFloat(diameter);
    const r = parseFloat(radius);
    const a = parseFloat(angle);
    const s = parseInt(segments);

    if (isNaN(d) || isNaN(r) || isNaN(a) || isNaN(s)) {
      setError('Alla värden måste vara nummer.');
      setResult(null);
      return;
    }

    if (s < 2) {
      setError('Antal segment måste vara minst 2.');
      setResult(null);
      return;
    }

    try {
      const res = calculateSegmentBend(d, r, a, s);
      setResult(res);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  const ResultVisualizer = ({ res }: { res: SegmentBendResult }) => {
    const padding = 20;
    const width = 600;
    const height = 300;
    
    // Scale the graph to fit SVG
    const scaleX = (width - padding * 2) / res.circumference;
    const scaleY = (height - padding * 2) / (res.maxHeight * 1.5);
    
    // Create Path data
    // Move to start
    let pathD = `M ${padding} ${height - padding - (res.coordinates[0].y * scaleY)}`;
    
    // Line to points
    res.coordinates.forEach(pt => {
        const px = padding + pt.x * scaleX;
        const py = height - padding - (pt.y * scaleY);
        pathD += ` L ${px} ${py}`;
    });

    // Close shape (draw bottom line)
    const lastPt = res.coordinates[res.coordinates.length - 1];
    const firstPt = res.coordinates[0];
    
    // Complete the box for fill effect
    pathD += ` L ${padding + res.circumference * scaleX} ${height - padding}`;
    pathD += ` L ${padding} ${height - padding} Z`;

    return (
        <div className="w-full bg-workshop-surface rounded-xl border border-gray-700 p-4 shadow-lg overflow-hidden">
            <h4 className="text-workshop-accent font-bold mb-2 text-center uppercase tracking-widest text-xs">Utbredning Mellanbit (100% Skala ej möjlig här)</h4>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-stone-900 rounded border border-stone-800">
                {/* Grid lines vertical */}
                {[0, 0.25, 0.5, 0.75, 1].map(pct => (
                    <line 
                        key={pct}
                        x1={padding + (width - padding*2)*pct} 
                        y1={padding} 
                        x2={padding + (width - padding*2)*pct} 
                        y2={height - padding} 
                        stroke="#333" 
                        strokeDasharray="4"
                    />
                ))}
                
                {/* Center line */}
                <line 
                     x1={padding} 
                     y1={height - padding - (res.middleHeight * scaleY)} 
                     x2={width - padding} 
                     y2={height - padding - (res.middleHeight * scaleY)} 
                     stroke="#666" 
                     strokeDasharray="2"
                />

                {/* The Shape */}
                <path d={pathD} fill="rgba(217, 119, 6, 0.2)" stroke="#d97706" strokeWidth="3" />
                
                {/* Labels */}
                <text x={padding} y={height - 5} className="fill-gray-500 text-xs">Rygg (0°)</text>
                <text x={width/2} y={height - 5} textAnchor="middle" className="fill-gray-500 text-xs">Buk (180°)</text>
                <text x={width - padding} y={height - 5} textAnchor="end" className="fill-gray-500 text-xs">Rygg (360°)</text>
            </svg>
            <p className="text-center text-xs text-gray-500 mt-2">Grafen visar mallen för en HEL mellanbit. Ändbitar är halva denna höjd.</p>
        </div>
    );
  };

  return (
    <div className="pb-20">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="bg-workshop-surface p-3 rounded-md hover:bg-gray-600 mr-4 border border-gray-700 text-workshop-text">&larr; Tillbaka</button>
        <div>
            <h2 className="text-2xl font-bold text-workshop-text">Segmentböj</h2>
            <p className="text-sm text-workshop-secondary">Lobster back bend</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* INPUTS */}
        <div className="space-y-6">
            <CalculatorInput 
                label="Diameter (D)" 
                unit="mm" 
                value={diameter} 
                onChange={(e) => setDiameter(e.target.value)} 
                id="dia" 
                symbol="Ø" 
            />
            <CalculatorInput 
                label="Radie i centrum (R)" 
                unit="mm" 
                value={radius} 
                onChange={(e) => setRadius(e.target.value)} 
                id="rad" 
                symbol="R" 
            />
            <CalculatorInput 
                label="Total Vinkel" 
                unit="grader" 
                value={angle} 
                onChange={(e) => setAngle(e.target.value)} 
                id="ang" 
                symbol="A" 
            />
            <div className="flex items-center space-x-4">
                <label className="flex items-center justify-center w-12 h-12 bg-workshop-surface rounded-md text-workshop-accent font-bold text-2xl">
                    N
                </label>
                <div className="flex-1">
                    <span className="text-sm text-workshop-secondary">Antal Segment</span>
                    <div className="flex items-baseline bg-gray-800 rounded-md">
                    <input
                        type="number"
                        value={segments}
                        onChange={(e) => setSegments(e.target.value)}
                        className="w-full bg-transparent p-3 text-2xl font-mono text-workshop-text focus:outline-none"
                        placeholder="3"
                    />
                    <span className="pr-4 text-workshop-secondary">st</span>
                    </div>
                </div>
            </div>

            <button onClick={handleCalculate} className="w-full bg-workshop-primary text-workshop-text text-2xl font-bold py-4 rounded-lg hover:bg-workshop-primary-hover transition-colors shadow-lg border border-red-900 mt-4">
                Beräkna Mall
            </button>

            {error && <div className="p-4 bg-red-900/50 border border-red-500 text-white rounded-md">{error}</div>}
        </div>

        {/* RESULTS */}
        {result && (
            <div className="space-y-6 animate-slide-up">
                
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-workshop-surface p-4 rounded-lg border border-gray-700">
                        <span className="text-xs text-gray-400 uppercase">Klippvinkel (Snitt)</span>
                        <div className="text-2xl font-bold text-white">{result.cutAngle.toFixed(2)}°</div>
                    </div>
                    <div className="bg-workshop-surface p-4 rounded-lg border border-gray-700">
                        <span className="text-xs text-gray-400 uppercase">Segmentvinkel</span>
                        <div className="text-2xl font-bold text-workshop-accent">{result.segmentAngle.toFixed(2)}°</div>
                    </div>
                    <div className="bg-workshop-surface p-4 rounded-lg border border-gray-700">
                        <span className="text-xs text-gray-400 uppercase">Längd Rygg (Max)</span>
                        <div className="text-xl font-mono text-white">{result.maxHeight.toFixed(1)} mm</div>
                    </div>
                    <div className="bg-workshop-surface p-4 rounded-lg border border-gray-700">
                        <span className="text-xs text-gray-400 uppercase">Längd Buk (Min)</span>
                        <div className="text-xl font-mono text-white">{result.minHeight.toFixed(1)} mm</div>
                    </div>
                </div>

                <div className="bg-stone-800 p-4 rounded border border-stone-600 text-sm">
                    <p className="mb-1"><span className="text-workshop-accent font-bold">Omkrets (Längd på plåt):</span> {result.circumference.toFixed(1)} mm</p>
                    <p><span className="text-gray-400">Antal skarvar:</span> {parseInt(segments) - 1} st</p>
                </div>

                <ResultVisualizer res={result} />

                {/* Table for manual plotting */}
                <div className="bg-workshop-surface rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-stone-900 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Vinkel</th>
                                <th className="px-4 py-3">Längd (X)</th>
                                <th className="px-4 py-3 text-right">Höjd (Y)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {/* We show 8 points (every 45 deg) for brevity in the table, although chart has more */}
                            {result.coordinates.filter((_, i) => i % 3 === 0).map((pt, idx) => (
                                <tr key={idx} className="hover:bg-stone-800">
                                    <td className="px-4 py-2 font-bold text-workshop-accent">{Math.round(pt.angle)}°</td>
                                    <td className="px-4 py-2 text-gray-300">{pt.x.toFixed(1)}</td>
                                    <td className="px-4 py-2 text-right font-mono text-white">{pt.y.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        )}
      </div>
    </div>
  );
};

export default SegmentBendCalculator;
