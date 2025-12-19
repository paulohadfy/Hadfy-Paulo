import React from 'react';
import { ShapeType } from '../types.ts';
import ShapeCard from './ShapeCard.tsx';
import { SquareToRoundIcon, ConeIcon, ProfileIcon, SegmentBendIcon, ChimneyIcon, TimeReportIcon, CalculatorIcon, CameraIcon, LightIcon, MusicIcon, PhoneIcon, MaterialIcon, RoofIcon } from './icons/index.ts';

interface ShapeSelectorProps {
  onSelectShape: (shape: ShapeType) => void;
}

interface ShapeOption {
  type: ShapeType;
  name: string;
  icon: React.ReactNode;
  description: string;
  disabled?: boolean;
}

const shapes: ShapeOption[] = [
  { type: ShapeType.TIME_REPORT, name: 'Tidrapport', icon: <TimeReportIcon />, description: 'Rapportera tid & material' },
  { type: ShapeType.MATERIAL_ORDER, name: 'Beställ Material', icon: <MaterialIcon />, description: 'Grossister Östergötland' },
  { type: ShapeType.PROJECT_CONTACTS, name: 'Kontakter', icon: <PhoneIcon />, description: 'Ring & SMS' },
  { type: ShapeType.COMPANY_WEB, name: 'Tak Kalkyl', icon: <RoofIcon />, description: 'Hallgrens Portal' },
  { type: ShapeType.MUSIC_RADIO, name: 'Musik & Radio', icon: <MusicIcon />, description: 'Spotify & Radio' },
  { type: ShapeType.CAMERA, name: 'Kamera', icon: <CameraIcon />, description: 'Fota & filma' },
  { type: ShapeType.FLASHLIGHT, name: 'Lampa', icon: <LightIcon />, description: 'Arbetsbelysning' },
  { type: ShapeType.CALCULATOR, name: 'Kalkylator', icon: <CalculatorIcon />, description: 'Verkstad & Matte' },
  { type: ShapeType.SQUARE_TO_ROUND, name: 'Fyrkant-Rund', icon: <SquareToRoundIcon />, description: 'Övergångsutbredning' },
  { type: ShapeType.CONE, name: 'Kona', icon: <ConeIcon />, description: 'Konberäkning' },
  { type: ShapeType.PROFILE, name: 'Profil', icon: <ProfileIcon />, description: 'Bockade profiler' },
  { type: ShapeType.SEGMENT_BEND, name: 'Segmentböj', icon: <SegmentBendIcon />, description: 'Rörböjar & Utbredning' },
  { type: ShapeType.CHIMNEY_FLASHING, name: 'Skorsten', icon: <ChimneyIcon />, description: 'Överbeslag & mått' },
];

const ShapeSelector: React.FC<ShapeSelectorProps> = ({ onSelectShape }) => {
  return (
    <div>
      <h2 className="text-lg md:text-2xl font-semibold mb-4 text-workshop-secondary px-1">Verktyg & Rapportering</h2>
      {/* Changed to grid-cols-2 for mobile to show more items, reduced gap */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {shapes.map((shape) => (
          <ShapeCard
            key={shape.type}
            name={shape.name}
            icon={shape.icon}
            description={shape.description}
            onClick={() => onSelectShape(shape.type)}
            disabled={shape.disabled} 
          />
        ))}
      </div>
    </div>
  );
};

export default ShapeSelector;