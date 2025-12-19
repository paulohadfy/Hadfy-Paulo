
import React, { useState, useRef, useEffect } from 'react';
import { LightIcon } from './icons/index.ts';

interface FlashlightToolProps {
  onBack: () => void;
}

const FlashlightTool: React.FC<FlashlightToolProps> = ({ onBack }) => {
  const [isOn, setIsOn] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Cleanup: Turn off light when leaving the tool
    return () => {
      stopLight();
    };
  }, []);

  const stopLight = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsOn(false);
  };

  const toggleLight = async () => {
    if (isOn) {
      stopLight();
    } else {
      try {
        setError('');
        // We need video permission to access the torch constraint
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        const track = stream.getVideoTracks()[0];
        
        // Apply torch constraint
        // @ts-ignore - Typescript might not know about torch constraint depending on lib version
        await track.applyConstraints({
          advanced: [{ torch: true } as any]
        });

        streamRef.current = stream;
        
        // Connect to hidden video element to keep stream active on iOS/Android
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setIsOn(true);
      } catch (err) {
        console.error(err);
        setError('Kunde inte starta lampan. Kontrollera att du godkänt kameratillgång.');
        stopLight();
      }
    }
  };

  return (
    <div className="flex flex-col h-full items-center">
        <div className="w-full flex items-center mb-6">
            <button onClick={onBack} className="bg-workshop-surface p-3 rounded-md hover:bg-gray-600 mr-4 border border-gray-700 text-workshop-text">&larr; Tillbaka</button>
            <div>
                <h2 className="text-2xl font-bold text-workshop-text">Arbetslampa</h2>
                <p className="text-sm text-workshop-secondary">Stark belysning</p>
            </div>
        </div>

        {/* Hidden video element required for iOS stream persistence */}
        <video ref={videoRef} playsInline muted autoPlay className="hidden" />

        <div className="flex-grow flex flex-col justify-center items-center w-full max-w-md py-12">
            
            {/* The Big Switch */}
            <button
                onClick={toggleLight}
                className={`
                    relative w-64 h-64 rounded-full border-8 flex items-center justify-center transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]
                    active:scale-95
                    ${isOn 
                        ? 'bg-yellow-500/10 border-yellow-500 shadow-[0_0_100px_rgba(234,179,8,0.4)] scale-105' 
                        : 'bg-workshop-surface border-gray-700 hover:border-gray-500'
                    }
                `}
            >
                <div className={`w-32 h-32 transition-all duration-300 ${isOn ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]' : 'text-gray-600'}`}>
                    <LightIcon />
                </div>
            </button>

            <h3 className={`mt-12 text-3xl font-black tracking-widest uppercase transition-colors duration-300 ${isOn ? 'text-yellow-400 drop-shadow-md' : 'text-gray-600'}`}>
                {isOn ? 'PÅ' : 'AV'}
            </h3>
            
            {error && (
                <div className="mt-8 p-4 bg-red-900/30 border border-red-800 text-red-200 rounded max-w-xs text-center text-sm">
                    {error}
                </div>
            )}
            
            <p className="mt-8 text-workshop-secondary text-sm text-center max-w-xs">
                OBS: Använder kamerans blixt. Stängs av automatiskt när du lämnar denna vy.
            </p>
        </div>
    </div>
  );
};

export default FlashlightTool;