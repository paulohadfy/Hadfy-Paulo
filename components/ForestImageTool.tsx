
import React from 'react';

interface ForestImageToolProps {
  onBack: () => void;
}

const ForestImageTool: React.FC<ForestImageToolProps> = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold text-workshop-secondary">Skog</h2>
      <div className="w-full max-w-lg rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 280"
          width="100%"
          aria-label="En skog med granar och lövträd"
        >
          {/* Sky gradient */}
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#87CEEB" />
              <stop offset="100%" stopColor="#d0eeff" />
            </linearGradient>
            <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a7c3f" />
              <stop offset="100%" stopColor="#2d5a20" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="400" height="280" fill="url(#skyGrad)" />

          {/* Sun */}
          <circle cx="340" cy="45" r="28" fill="#FFE066" opacity="0.9" />
          <circle cx="340" cy="45" r="22" fill="#FFD700" />

          {/* Clouds */}
          <ellipse cx="80" cy="40" rx="35" ry="14" fill="white" opacity="0.85" />
          <ellipse cx="105" cy="32" rx="25" ry="12" fill="white" opacity="0.85" />
          <ellipse cx="55" cy="35" rx="22" ry="10" fill="white" opacity="0.85" />

          <ellipse cx="220" cy="55" rx="28" ry="11" fill="white" opacity="0.75" />
          <ellipse cx="243" cy="48" rx="20" ry="10" fill="white" opacity="0.75" />

          {/* Ground */}
          <rect x="0" y="210" width="400" height="70" fill="url(#groundGrad)" />

          {/* Grass bumps */}
          <ellipse cx="50" cy="210" rx="60" ry="8" fill="#5a9e4a" />
          <ellipse cx="170" cy="213" rx="80" ry="7" fill="#4e8c3d" />
          <ellipse cx="320" cy="211" rx="70" ry="8" fill="#56a044" />

          {/* ---- Trees ---- */}

          {/* Far background trees (small, desaturated) */}
          {/* Pine far-left */}
          <polygon points="30,160 20,200 40,200" fill="#5a8a5a" opacity="0.6" />
          <polygon points="30,140 17,175 43,175" fill="#4d7d4d" opacity="0.6" />
          <rect x="27" y="200" width="6" height="12" fill="#7a5c3a" opacity="0.6" />

          {/* Pine far-right */}
          <polygon points="370,155 358,195 382,195" fill="#5a8a5a" opacity="0.6" />
          <polygon points="370,135 356,170 384,170" fill="#4d7d4d" opacity="0.6" />
          <rect x="367" y="195" width="6" height="14" fill="#7a5c3a" opacity="0.6" />

          {/* Deciduous tree – far mid left */}
          <rect x="128" y="170" width="7" height="42" fill="#8B6343" opacity="0.7" />
          <circle cx="131" cy="158" r="22" fill="#6aaf50" opacity="0.65" />
          <circle cx="118" cy="165" r="15" fill="#5da044" opacity="0.65" />
          <circle cx="145" cy="163" r="17" fill="#62a848" opacity="0.65" />

          {/* ---- Foreground trees ---- */}

          {/* Big spruce / pine – left */}
          <rect x="73" y="180" width="10" height="32" fill="#7a5c3a" />
          <polygon points="78,80 58,145 98,145" fill="#2d6e2d" />
          <polygon points="78,105 55,160 101,160" fill="#347834" />
          <polygon points="78,130 52,185 104,185" fill="#3a843a" />

          {/* Deciduous tree – center-left */}
          <rect x="158" y="175" width="10" height="37" fill="#7a5230" />
          <circle cx="163" cy="155" r="30" fill="#4aac38" />
          <circle cx="145" cy="163" r="20" fill="#44a032" />
          <circle cx="180" cy="160" r="22" fill="#50b840" />
          <circle cx="163" cy="138" r="18" fill="#56c445" />

          {/* Big spruce – center */}
          <rect x="196" y="182" width="11" height="30" fill="#6b4f2e" />
          <polygon points="201,70 177,145 225,145" fill="#1e5e1e" />
          <polygon points="201,100 174,162 228,162" fill="#246024" />
          <polygon points="201,130 171,190 231,190" fill="#2a6e2a" />

          {/* Deciduous tree – center-right */}
          <rect x="255" y="178" width="9" height="34" fill="#7a5230" />
          <circle cx="259" cy="158" r="28" fill="#48aa36" />
          <circle cx="242" cy="167" r="18" fill="#42983e" />
          <circle cx="275" cy="165" r="20" fill="#50b03e" />
          <circle cx="259" cy="142" r="16" fill="#54be44" />

          {/* Big spruce – right */}
          <rect x="315" y="180" width="11" height="32" fill="#7a5c3a" />
          <polygon points="320,85 298,150 342,150" fill="#2d6e2d" />
          <polygon points="320,112 295,165 345,165" fill="#347834" />
          <polygon points="320,138 292,188 348,188" fill="#3a843a" />

          {/* Small bush / shrub foreground */}
          <ellipse cx="40" cy="215" rx="18" ry="10" fill="#3d8c30" />
          <ellipse cx="105" cy="218" rx="14" ry="8" fill="#3a8a2d" />
          <ellipse cx="350" cy="216" rx="16" ry="9" fill="#3d8c30" />
          <ellipse cx="385" cy="220" rx="12" ry="7" fill="#378a2c" />

          {/* Foreground grass tufts */}
          <ellipse cx="150" cy="222" rx="22" ry="6" fill="#56a044" />
          <ellipse cx="280" cy="220" rx="20" ry="6" fill="#5aaa48" />

          {/* Small flowers */}
          <circle cx="90" cy="217" r="3" fill="#FFD700" />
          <circle cx="190" cy="220" r="2.5" fill="#FF6B6B" />
          <circle cx="300" cy="218" r="3" fill="#FFD700" />
          <circle cx="360" cy="222" r="2.5" fill="#FFA0C8" />
        </svg>
      </div>
      <p className="text-sm text-gray-500">En stilla skog – SVG-illustration</p>
    </div>
  );
};

export default ForestImageTool;
