
import React from 'react';

const ChimneyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        {/* Chimney stack */}
        <rect x="9" y="4" width="6" height="12" rx="1" />
        {/* Flashing/Base */}
        <path d="M5 20l4-2v-2h6v2l4 2H5z" />
    </svg>
);

export default ChimneyIcon;