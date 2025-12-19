
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

  const VisualGuide = () => (
    <div className="p-4 bg-workshop-surface rounded-lg flex justify-center items-center border border-gray-700">
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
    </div>
  );

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
