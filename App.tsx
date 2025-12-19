
import React, { useState } from 'react';
import { ShapeType } from './types.ts';
import ShapeSelector from './components/ShapeSelector.tsx';
import SquareToRoundCalculator from './calculators/SquareToRoundCalculator.tsx';
import Header from './components/Header.tsx';
import ConeCalculator from './calculators/ConeCalculator.tsx';
import ProfileCalculator from './calculators/ProfileCalculator.tsx';
import SegmentBendCalculator from './calculators/SegmentBendCalculator.tsx';
import ChimneyFlashingCalculator from './calculators/ChimneyFlashingCalculator.tsx';
import TimeReport from './components/TimeReport.tsx';
import CalculatorTool from './components/CalculatorTool.tsx';
import CameraTool from './components/CameraTool.tsx';
import FlashlightTool from './components/FlashlightTool.tsx';
import MusicRadioTool from './components/MusicRadioTool.tsx';
import ProjectContactsTool from './components/ProjectContactsTool.tsx';
import CompanyWebTool from './components/CompanyWebTool.tsx';
import MaterialOrderTool from './components/MaterialOrderTool.tsx';

const App: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null);

  const handleSelectShape = (shape: ShapeType) => {
    setSelectedShape(shape);
  };

  const handleBack = () => {
    setSelectedShape(null);
  };

  const renderCalculator = () => {
    switch (selectedShape) {
      case ShapeType.COMPANY_WEB:
        return <CompanyWebTool onBack={handleBack} />;
      case ShapeType.PROJECT_CONTACTS:
        return <ProjectContactsTool onBack={handleBack} />;
      case ShapeType.MATERIAL_ORDER:
        return <MaterialOrderTool onBack={handleBack} />;
      case ShapeType.MUSIC_RADIO:
        return <MusicRadioTool onBack={handleBack} />;
      case ShapeType.FLASHLIGHT:
        return <FlashlightTool onBack={handleBack} />;
      case ShapeType.CAMERA:
        return <CameraTool onBack={handleBack} />;
      case ShapeType.CALCULATOR:
        return <CalculatorTool onBack={handleBack} />;
      case ShapeType.TIME_REPORT:
        return <TimeReport onBack={handleBack} />;
      case ShapeType.SQUARE_TO_ROUND:
        return <SquareToRoundCalculator onBack={handleBack} />;
      case ShapeType.CONE:
        return <ConeCalculator onBack={handleBack} />;
      case ShapeType.PROFILE:
        return <ProfileCalculator onBack={handleBack} />;
      case ShapeType.SEGMENT_BEND:
        return <SegmentBendCalculator onBack={handleBack} />;
      case ShapeType.CHIMNEY_FLASHING:
        return <ChimneyFlashingCalculator onBack={handleBack} />;
      default:
        return <ShapeSelector onSelectShape={handleSelectShape} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onBack={selectedShape ? handleBack : undefined} />
      <main className="flex-grow container mx-auto p-4 md:p-6 flex flex-col">
        {renderCalculator()}
      </main>
    </div>
  );
};

export default App;
