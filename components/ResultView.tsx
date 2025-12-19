
import React from 'react';
import { SquareToRoundResult } from '../types.ts';

interface ResultViewProps {
  result: SquareToRoundResult;
}

const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  const { patternHeight, outerArcRadius, innerArcRadius, chordLength, arcAngle } = result;

  const f = (num: number) => num.toFixed(1);

  const viewBoxWidth = 300;
  const viewBoxHeight = 200;
  const centerX = viewBoxWidth / 2;
  // Adjust centerY to better position the drawing, especially for large radii
  const centerY = 190; 

  const scale = Math.min(viewBoxWidth / (chordLength * 1.5), viewBoxHeight / (patternHeight * 1.2));
  
  // Prevent scale from being zero or negative if dimensions are invalid
  if (scale <= 0 || !isFinite(scale)) {
    return <p>Ogiltiga dimensioner för att rita resultat.</p>;
  }
  
  const rOuter = outerArcRadius * scale;
  const rInner = innerArcRadius * scale;
  const chord = chordLength * scale;
  
  // Angle for the arc that represents the top circle segment
  const topArcAngleRad = (chordLength / outerArcRadius) * (rInner / (outerArcRadius - patternHeight)); // Approximation
  const angleRad = arcAngle * (Math.PI / 180);

  // For a symmetrical piece, the total angle is split
  const startAngle = -angleRad / 2;
  const endAngle = angleRad / 2;
  
  const x1_outer = centerX + rOuter * Math.sin(startAngle);
  const y1_outer = centerY - rOuter * Math.cos(startAngle);
  
  const x2_outer = centerX + rOuter * Math.sin(endAngle);
  const y2_outer = centerY - rOuter * Math.cos(endAngle);

  // The bottom corners of the 1/4 pattern
  const x1_inner = centerX - chordLength/2 * scale;
  const y1_inner = centerY - rInner;
  const x2_inner = centerX + chordLength/2 * scale;
  const y2_inner = centerY - rInner;


  const pathData = `
    M ${x1_inner},${y1_inner}
    L ${x1_outer},${y1_outer}
    A ${rOuter},${rOuter} 0 0 1 ${x2_outer},${y2_outer}
    L ${x2_inner},${y2_inner}
    Z
  `;

  return (
    <div className="bg-workshop-surface rounded-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="text-lg space-y-3 font-mono">
        <p>Yttre radie: <span className="font-bold text-workshop-accent">{f(outerArcRadius)} mm</span></p>
        <p>Inre radie: <span className="font-bold text-workshop-accent">{f(innerArcRadius)} mm</span></p>
        <p>Höjd på mönster: <span className="font-bold text-workshop-accent">{f(patternHeight)} mm</span></p>
        <p>Bredd bas: <span className="font-bold text-workshop-accent">{f(chordLength)} mm</span></p>
        <p>Sektorvinkel: <span className="font-bold text-workshop-accent">{f(arcAngle)}°</span></p>
      </div>
      <div>
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-auto bg-gray-800 rounded">
          <path d={pathData} fill="#4a5568" stroke="#a0aec0" strokeWidth="1" />

          {/* Dimension Lines */}
          <line x1={x1_inner} y1={y1_inner+5} x2={x2_inner} y2={y2_inner+5} stroke="#f6ad55" strokeWidth="0.5" />
          <text x={centerX} y={y1_inner+15} textAnchor="middle" className="text-[8px] fill-current text-workshop-accent">{f(chordLength)}</text>
          
          <line x1={centerX} y1={centerY - rOuter} x2={centerX} y2={centerY-rInner} stroke="#f6ad55" strokeWidth="0.5" strokeDasharray="2,2"/>
          <text x={centerX+5} y={centerY - rInner - (rOuter - rInner)/2} className="text-[8px] fill-current text-workshop-accent">{f(patternHeight)}</text>
        </svg>
      </div>
    </div>
  );
};

export default ResultView;
