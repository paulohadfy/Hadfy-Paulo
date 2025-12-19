
import React from 'react';

interface CalculatorInputProps {
  label: string;
  unit: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  symbol: string;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({ label, unit, value, onChange, id, symbol }) => {
  return (
    <div className="flex items-center space-x-4">
      <label htmlFor={id} className="flex items-center justify-center w-12 h-12 bg-workshop-surface rounded-md text-workshop-accent font-bold text-2xl">
        {symbol}
      </label>
      <div className="flex-1">
        <span className="text-sm text-workshop-secondary">{label}</span>
        <div className="flex items-baseline bg-gray-800 rounded-md">
          <input
            type="number"
            id={id}
            value={value}
            onChange={onChange}
            className="w-full bg-transparent p-3 text-2xl font-mono text-workshop-text focus:outline-none"
            placeholder="0"
          />
          <span className="pr-4 text-workshop-secondary">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default CalculatorInput;
