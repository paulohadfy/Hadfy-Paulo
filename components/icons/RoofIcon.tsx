
import React from 'react';

const RoofIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    {/* Taket */}
    <path d="M2 12L12 3L22 12" />
    {/* Huset */}
    <path d="M5 12V20C5 20.55 5.45 21 6 21H18C18.55 21 19 20.55 19 20V12" />
    {/* Skorsten (Viktigt för plåtslagare) */}
    <path d="M16 6V3H19V9" />
  </svg>
);

export default RoofIcon;
