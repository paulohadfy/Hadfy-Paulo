
import React, { useState, useRef, useEffect } from 'react';
import { MediaItem } from '../types.ts';
import { LightIcon } from './icons/index.ts';

interface CameraToolProps {
  onBack: () => void;
}

const CameraTool: React.FC<CameraToolProps> = ({ onBack }) => {
  const [mediaGallery, setMediaGallery] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  
  // Torch State
  const [isTorchOn, setIsTorchOn] = useState(false);
  const torchStreamRef = useRef<MediaStream | null>(null);
  // Hidden video ref is sometimes needed to keep the stream active on certain devices (like iOS)
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  
  // Refs for hidden inputs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Clean up torch on unmount
  useEffect(() => {
    return () => {
      stopTorch();
    };
  }, []);

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newItem: MediaItem = {
        id: Date.now().toString(),
        type,
        url,
        timestamp: Date.now(),
        name: file.name
      };
      setMediaGallery(prev => [newItem, ...prev]);
    }
    // Reset input
    event.target.value = '';
  };

  const stopTorch = () => {
    if (torchStreamRef.current) {
        const track = torchStreamRef.current.getVideoTracks()[0];
        if (track) {
            track.stop();
        }
        torchStreamRef.current = null;
    }
    if (hiddenVideoRef.current) {
        hiddenVideoRef.current.srcObject = null;
    }
    setIsTorchOn(false);
  };

  const toggleTorch = async () => {
    if (isTorchOn) {
        stopTorch();
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment'
                }
            });
            
            const track = stream.getVideoTracks()[0];
            
            // Check if torch is supported
            // @ts-ignore - 'torch' is part of the constraint but typescript definition might be missing in some setups
            const capabilities = track.getCapabilities ? track.getCapabilities() : {};
            
            // @ts-ignore
            if (!capabilities.torch && !('torch' in capabilities)) {
                // Some devices don't report capability but support it via constraints anyway, 
                // but usually good to warn. We try anyway.
                console.warn("Torch capability might not be supported.");
            }

            // Apply torch constraint
            await track.applyConstraints({
                advanced: [{ torch: true } as any]
            });

            torchStreamRef.current = stream;
            
            // Attach to hidden video to ensure stream stays active on iOS
            if (hiddenVideoRef.current) {
                hiddenVideoRef.current.srcObject = stream;
            }

            setIsTorchOn(true);

        } catch (err) {
            console.error("Failed to enable torch:", err);
            alert("Kunde inte starta lampan. Kontrollera att du gett kameratillåtelse och att enheten har en lampa.");
            stopTorch();
        }
    }
  };

  const openMedia = (item: MediaItem) => {
    setSelectedMedia(item);
  };

  const closeMedia = () => {
    setSelectedMedia(null);
  };

  const deleteMedia = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaGallery(prev => prev.filter(item => item.id !== id));
    if (selectedMedia?.id === id) setSelectedMedia(null);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex items-center mb-6">
        <button onClick={() => { stopTorch(); onBack(); }} className="bg-workshop-surface p-3 rounded-md hover:bg-gray-600 mr-4 border border-gray-700 text-workshop-text">&larr; Tillbaka</button>
        <div>
           <h2 className="text-2xl font-bold text-workshop-text">Projektkamera</h2>
           <p className="text-sm text-workshop-secondary">Fota, filma och lys upp</p>
        </div>
      </div>

      {/* Hidden video element for torch stream stability */}
      <video ref={hiddenVideoRef} playsInline muted autoPlay className="hidden" />

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button 
          onClick={() => photoInputRef.current?.click()}
          className="bg-workshop-surface border-2 border-workshop-accent/50 hover:bg-workshop-surface/80 text-workshop-text p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
        >
          <div className="w-12 h-12 text-workshop-accent">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <span className="font-bold text-lg uppercase tracking-wider">Ta Bild</span>
        </button>
        <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={photoInputRef} 
            className="hidden" 
            onChange={(e) => handleCapture(e, 'image')}
        />

        <button 
          onClick={() => videoInputRef.current?.click()}
          className="bg-workshop-surface border-2 border-red-900/50 hover:bg-workshop-surface/80 text-workshop-text p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
        >
          <div className="w-12 h-12 text-red-500">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <span className="font-bold text-lg uppercase tracking-wider">Spela in Video</span>
        </button>
        <input 
            type="file" 
            accept="video/*" 
            capture="environment" 
            ref={videoInputRef} 
            className="hidden" 
            onChange={(e) => handleCapture(e, 'video')}
        />
      </div>
      
      {/* Torch Toggle Button */}
      <button 
        onClick={toggleTorch}
        className={`w-full p-6 rounded-xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-lg mb-8 border-2
            ${isTorchOn 
                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                : 'bg-workshop-surface border-gray-700 text-gray-400 hover:text-gray-200'
            }
        `}
      >
        <div className={`w-8 h-8 ${isTorchOn ? 'text-yellow-400 animate-pulse' : 'text-current'}`}>
            <LightIcon />
        </div>
        <span className="font-bold text-lg uppercase tracking-wider">
            {isTorchOn ? 'Arbetslampa PÅ' : 'Tänd Arbetslampa'}
        </span>
      </button>

      {/* Gallery Grid */}
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-4 text-workshop-secondary border-b border-gray-700 pb-2">Senaste inspelningar</h3>
        
        {mediaGallery.length === 0 ? (
          <div className="text-center py-12 bg-workshop-surface rounded-lg border border-dashed border-gray-700 text-gray-500">
            Inga bilder eller videor tagna än.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaGallery.map((item) => (
              <div 
                key={item.id} 
                onClick={() => openMedia(item)}
                className="relative aspect-square bg-black rounded-lg overflow-hidden border border-gray-700 cursor-pointer group shadow-md"
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt="captured" className="w-full h-full object-cover" />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover pointer-events-none" preload="metadata" />
                )}
                
                {/* Overlay Icon for Video */}
                {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <div className="w-0 h-0 border-t-6 border-t-transparent border-l-8 border-l-white border-b-6 border-b-transparent ml-1"></div>
                        </div>
                    </div>
                )}

                {/* Delete Button */}
                <button 
                    onClick={(e) => deleteMedia(item.id, e)}
                    className="absolute top-2 right-2 bg-red-900/80 text-white p-1.5 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4" onClick={closeMedia}>
            <button className="absolute top-4 right-4 text-white p-4 hover:text-workshop-accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            
            <div className="w-full max-w-5xl max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {selectedMedia.type === 'image' ? (
                    <img src={selectedMedia.url} alt="Full view" className="max-w-full max-h-[80vh] object-contain rounded border border-gray-800 shadow-2xl" />
                ) : (
                    <video src={selectedMedia.url} controls autoPlay className="max-w-full max-h-[80vh] rounded border border-gray-800 shadow-2xl" />
                )}
            </div>
            <p className="text-gray-400 mt-4 font-mono text-sm">{new Date(selectedMedia.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default CameraTool;