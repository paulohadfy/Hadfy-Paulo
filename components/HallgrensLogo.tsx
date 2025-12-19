
import React from 'react';

const HallgrensLogo: React.FC<{ className?: string }> = ({ className = "h-16" }) => {
  /* 
     VIEWBOX EXPLANATION:
     0: min-x
     -60: min-y (Critical change: Starts drawing 60 units 'up' to capture the top of the arc which peaks at y=-50)
     300: width
     210: height (Total height from -60 to 150 covering the bottom text)
  */
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 -60 300 210" 
      className={className}
      fill="none"
      role="img"
      aria-label="Hallgrens Plåt AB Logotyp"
    >
      <defs>
        {/* Gradient for the Red Arch (Deep red to slightly lighter red) */}
        <linearGradient id="hallgrenRedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#991b1b" /> {/* workshop-primary */}
          <stop offset="100%" stopColor="#7f1d1d" /> {/* Darker red */}
        </linearGradient>

        {/* Gradient for the Tools (Steel/Silver look) */}
        <linearGradient id="toolSteelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e7e5e4" /> {/* Stone 200 */}
          <stop offset="50%" stopColor="#a8a29e" /> {/* Stone 400 */}
          <stop offset="100%" stopColor="#57534e" /> {/* Stone 600 */}
        </linearGradient>

        {/* Soft shadow for depth */}
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="1" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Top Arc Background - Using Gradient */}
      {/* The arc A 130 130 implies a tall semicircle reaching up to y=-50 */}
      <path 
        d="M 20 80 A 130 130 0 0 1 280 80 L 255 80 A 105 105 0 0 0 45 80 Z" 
        fill="url(#hallgrenRedGradient)"
        filter="url(#softShadow)"
        stroke="#450a0a"
        strokeWidth="1"
      />
      
      {/* Text on Arc Path */}
      <path id="textArc" d="M 33 76 A 117 117 0 0 1 267 76" fill="none" />
      <text className="fill-white text-[11px] font-black tracking-[0.2em] uppercase" textAnchor="middle" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}>
        <textPath href="#textArc" startOffset="50%">
          Byggn. - Vent. - Verkst. - Plåtsl.
        </textPath>
      </text>

      {/* Crossed Tools (Stylized Hammer and Snips) - Using Steel Gradient */}
      <g transform="translate(150, 68) scale(0.9)">
        {/* Hammer */}
        <g transform="rotate(-45)">
          <rect x="-2.5" y="-22" width="5" height="44" fill="url(#toolSteelGradient)" stroke="#1c1917" strokeWidth="0.5" rx="1"/>
          <rect x="-7" y="-28" width="14" height="12" rx="2" fill="url(#toolSteelGradient)" stroke="#1c1917" strokeWidth="0.5" />
        </g>
        {/* Snips */}
        <g transform="rotate(45)">
           <rect x="-2.5" y="-22" width="5" height="44" fill="url(#toolSteelGradient)" stroke="#1c1917" strokeWidth="0.5" rx="1" />
           <circle cx="0" cy="0" r="3.5" className="fill-workshop-bg stroke-gray-400" strokeWidth="1.5"/>
           <path d="M -2.5 -22 L -7 -34 L 7 -34 L 2.5 -22 Z" fill="url(#toolSteelGradient)" stroke="#1c1917" strokeWidth="0.5" />
        </g>
      </g>

      {/* Main Text Below */}
      <g filter="url(#softShadow)">
        <text x="150" y="112" textAnchor="middle" className="fill-workshop-text font-black text-[26px] tracking-tight leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>
            HALLGRENS
        </text>
        <text x="150" y="128" textAnchor="middle" className="fill-workshop-accent font-bold text-[18px] tracking-[0.3em] uppercase">
            PLÅT AB
        </text>
      </g>
    </svg>
  );
};

export default HallgrensLogo;
