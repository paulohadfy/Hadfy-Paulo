
import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.ts';

interface CalculatorToolProps {
  onBack: () => void;
}

const CalculatorTool: React.FC<CalculatorToolProps> = ({ onBack }) => {
  // Persist the display value so we don't lose the calculation
  const [display, setDisplay] = useLocalStorage('calc_display', '0');
  
  const [expression, setExpression] = useState('');
  const [lastWasResult, setLastWasResult] = useState(false);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (/[0-9]/.test(key)) inputDigit(key);
      if (['+', '-', '*', '/'].includes(key)) performOperation(key);
      if (key === 'Enter' || key === '=') calculateResult();
      if (key === 'Backspace') handleBackspace();
      if (key === 'Escape' || key === 'c' || key === 'C') clearAll();
      if (key === '.') inputDot();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, expression, lastWasResult]);

  const inputDigit = (digit: string) => {
    if (lastWasResult) {
      setDisplay(digit);
      setLastWasResult(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (lastWasResult) {
      setDisplay('0.');
      setLastWasResult(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setExpression('');
    setLastWasResult(false);
  };

  const handleBackspace = () => {
    if (lastWasResult) {
      clearAll();
    } else {
      setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    
    if (lastWasResult) {
        setExpression(display + ' ' + nextOperator + ' ');
        setLastWasResult(false);
        setDisplay('0');
    } else {
        setExpression(prev => prev + display + ' ' + nextOperator + ' ');
        setDisplay('0');
    }
  };

  const calculateResult = () => {
    if (!expression && !lastWasResult) return;
    
    // Logic to finalize calculation
    let fullExpression = expression + display;
    
    // Replace visual symbols with JS math
    fullExpression = fullExpression.replace(/×/g, '*').replace(/÷/g, '/');
    
    try {
      // Note: Using Function constructor is safer than eval but still requires care.
      // Since input is strictly controlled by buttons/regex, it is acceptable here.
      // We also support Math functions if they were injected, though currently we compute them immediately.
      const result = new Function('return ' + fullExpression)();
      
      const formattedResult = String(Math.round(result * 10000) / 10000); // Max 4 decimals
      setDisplay(formattedResult);
      setExpression('');
      setLastWasResult(true);
    } catch (e) {
      setDisplay('Error');
      setLastWasResult(true);
    }
  };

  // Scientific functions act immediately on the current display value
  const performScientific = (func: string) => {
    const current = parseFloat(display);
    let newVal = 0;

    switch (func) {
      case 'sqrt':
        newVal = Math.sqrt(current);
        break;
      case 'sqr':
        newVal = Math.pow(current, 2);
        break;
      case 'sin':
        // Deg to Rad for JS Math
        newVal = Math.sin(current * (Math.PI / 180));
        break;
      case 'cos':
        newVal = Math.cos(current * (Math.PI / 180));
        break;
      case 'tan':
        newVal = Math.tan(current * (Math.PI / 180));
        break;
      case 'pi':
        newVal = Math.PI;
        break;
      default:
        return;
    }
    
    setDisplay(String(Math.round(newVal * 10000) / 10000));
    setLastWasResult(true);
  };

  const Button = ({ label, onClick, className = "", accent = false, scientific = false }: any) => (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg font-bold text-xl md:text-2xl h-16 md:h-20 transition-all active:scale-95 shadow-md
        ${accent 
          ? 'bg-workshop-accent text-white hover:bg-orange-700' 
          : scientific
            ? 'bg-stone-700 text-stone-300 hover:bg-stone-600 text-lg'
            : 'bg-workshop-surface text-workshop-text hover:bg-stone-700 border border-stone-700'
        }
        ${className}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="bg-workshop-surface p-3 rounded-md hover:bg-gray-600 mr-4 border border-gray-700 text-workshop-text">&larr; Tillbaka</button>
        <h2 className="text-2xl font-bold text-workshop-text">Verkstadskalkylator</h2>
      </div>

      <div className="bg-stone-900 p-6 rounded-2xl shadow-2xl border border-stone-800">
        {/* Display Screen */}
        <div className="bg-[#9ca3af] rounded-xl mb-6 p-4 text-right shadow-inner border-4 border-stone-700">
          <div className="text-stone-800 text-sm h-6 font-mono overflow-hidden">{expression.replace(/\*/g, '×').replace(/\//g, '÷')}</div>
          <div className="text-stone-900 text-4xl md:text-5xl font-mono font-bold tracking-wider overflow-x-auto overflow-y-hidden whitespace-nowrap">
            {display}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          
          {/* Scientific Row 1 */}
          <Button label="Sin" scientific onClick={() => performScientific('sin')} />
          <Button label="Cos" scientific onClick={() => performScientific('cos')} />
          <Button label="Tan" scientific onClick={() => performScientific('tan')} />
          <Button label="AC" className="bg-red-900/80 text-white border-red-800 hover:bg-red-800" onClick={clearAll} />

          {/* Scientific Row 2 */}
          <Button label="√" scientific onClick={() => performScientific('sqrt')} />
          <Button label="x²" scientific onClick={() => performScientific('sqr')} />
          <Button label="π" scientific onClick={() => performScientific('pi')} />
          <Button label="÷" accent onClick={() => performOperation('/')} />

          {/* Numbers */}
          <Button label="7" onClick={() => inputDigit('7')} />
          <Button label="8" onClick={() => inputDigit('8')} />
          <Button label="9" onClick={() => inputDigit('9')} />
          <Button label="×" accent onClick={() => performOperation('*')} />

          <Button label="4" onClick={() => inputDigit('4')} />
          <Button label="5" onClick={() => inputDigit('5')} />
          <Button label="6" onClick={() => inputDigit('6')} />
          <Button label="-" accent onClick={() => performOperation('-')} />

          <Button label="1" onClick={() => inputDigit('1')} />
          <Button label="2" onClick={() => inputDigit('2')} />
          <Button label="3" onClick={() => inputDigit('3')} />
          <Button label="+" accent onClick={() => performOperation('+')} />

          <Button label="0" className="col-span-2" onClick={() => inputDigit('0')} />
          <Button label="." onClick={inputDot} />
          <Button label="=" className="bg-green-700 text-white hover:bg-green-600 border-green-800" onClick={calculateResult} />
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-workshop-secondary">
          <div className="bg-workshop-surface p-3 rounded border border-stone-800">
              <strong className="text-workshop-accent block">Tips:</strong>
              Använd <strong>Sin/Cos/Tan</strong> för att räkna ut takvinklar och språngmått. Vinklar anges i grader.
          </div>
          <div className="bg-workshop-surface p-3 rounded border border-stone-800">
              <strong className="text-workshop-accent block">Tips:</strong>
              Använd <strong>π</strong> (Pi) för att räkna ut omkrets på rör (Diameter × π).
          </div>
      </div>
    </div>
  );
};

export default CalculatorTool;
