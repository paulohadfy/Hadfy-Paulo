
import React, { useState, useRef, useEffect } from 'react';

interface MusicRadioToolProps {
  onBack: () => void;
}

interface Station {
  id: string;
  name: string;
  desc: string;
  color: string;
  streamUrl: string;
}

// Direct stream URLs for Swedish radio
const STATIONS: Station[] = [
  // Sveriges Radio
  { id: 'p1', name: 'P1', desc: 'Nyheter & Fakta', color: '#00aecb', streamUrl: 'https://sverigesradio.se/topsy/direkt/srapi/132.mp3' },
  { id: 'p3', name: 'P3', desc: 'Musik & Humor', color: '#14a076', streamUrl: 'https://sverigesradio.se/topsy/direkt/srapi/164.mp3' },
  { id: 'p4', name: 'P4 Riks', desc: 'Lokalt & Sport', color: '#c22588', streamUrl: 'https://sverigesradio.se/topsy/direkt/srapi/212.mp3' }, // P4 Plus/Riks
  { id: 'dingata', name: 'Din Gata', desc: 'HipHop & RnB', color: '#e74c3c', streamUrl: 'https://sverigesradio.se/topsy/direkt/srapi/2576.mp3' },
  
  // Commercial (Bauer Media / Viaplay streams)
  { id: 'bandit', name: 'Bandit Rock', desc: 'Vi spelar vad vi vill', color: '#000000', streamUrl: 'https://live-bauerse-fm.sharp-stream.com/bandit_rock_instream_se_mp3' },
  { id: 'mix', name: 'Mix Megapol', desc: 'Den bästa musiken', color: '#e84393', streamUrl: 'https://live-bauerse-fm.sharp-stream.com/mix_megapol_instream_se_mp3' },
  { id: 'rix', name: 'Rix FM', desc: 'Bäst musik just nu', color: '#f0932b', streamUrl: 'https://live-bauerse-fm.sharp-stream.com/rix_fm_instream_se_mp3' },
  { id: 'rock', name: 'Rockklassiker', desc: 'Tidernas bästa rock', color: '#2c3e50', streamUrl: 'https://live-bauerse-fm.sharp-stream.com/rockklassiker_instream_se_mp3' },
  { id: 'star', name: 'Star FM', desc: 'Bästa låtarna 70/80/90', color: '#8e44ad', streamUrl: 'https://live-bauerse-fm.sharp-stream.com/star_fm_instream_se_mp3' },
];

const MusicRadioTool: React.FC<MusicRadioToolProps> = ({ onBack }) => {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup on unmount (stops music when going back via Header)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const playStation = async (station: Station) => {
    if (!audioRef.current) return;

    // If clicking the same station, toggle play/pause
    if (currentStation?.id === station.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // New station
    setIsLoading(true);
    setCurrentStation(station);
    audioRef.current.src = station.streamUrl;
    audioRef.current.load();
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Playback failed", error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const openSpotify = () => {
    window.open('https://open.spotify.com', '_blank', 'noopener,noreferrer');
  };

  // Equalizer Animation Component
  const Equalizer = () => (
    <div className="flex items-end gap-0.5 h-4 ml-2">
      <div className="w-1 bg-workshop-accent animate-[bounce_1s_infinite] h-2"></div>
      <div className="w-1 bg-workshop-accent animate-[bounce_1.2s_infinite] h-4"></div>
      <div className="w-1 bg-workshop-accent animate-[bounce_0.8s_infinite] h-3"></div>
      <div className="w-1 bg-workshop-accent animate-[bounce_1.1s_infinite] h-4"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-24 relative min-h-full">
      <audio ref={audioRef} onError={() => { setIsLoading(false); setIsPlaying(false); alert('Kunde inte spela upp kanalen just nu.'); }} />

      {/* Header section removed - integrated into main Header */}
      <div className="mb-6">
           <h2 className="text-2xl font-bold text-workshop-text">Musik & Radio</h2>
           <p className="text-sm text-workshop-secondary">Live i Verkstan</p>
      </div>

      <div className="space-y-8">
        
        {/* Live Radio Grid */}
        <div>
            <h3 className="text-workshop-accent font-bold uppercase tracking-wider text-sm mb-3 px-1 flex items-center justify-between">
              Live Radio
              {isPlaying && <span className="text-xs text-green-400 animate-pulse">● Sänder Live</span>}
            </h3>
            <div className="grid grid-cols-1 gap-3">
               {STATIONS.map((station) => {
                 const isActive = currentStation?.id === station.id;
                 return (
                  <button 
                    key={station.id}
                    onClick={() => playStation(station)}
                    className={`
                      relative p-4 rounded-xl flex items-center justify-between transition-all active:scale-95 group shadow-md border
                      ${isActive 
                        ? 'bg-workshop-surface border-workshop-accent ring-1 ring-workshop-accent' 
                        : 'bg-workshop-surface border-gray-700 hover:bg-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon/Color circle */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg shrink-0`} style={{ backgroundColor: station.color }}>
                        {isActive && isPlaying ? (
                           <div className="space-x-1 flex items-center justify-center">
                              <div className="w-1 h-3 bg-white animate-pulse"></div>
                              <div className="w-1 h-5 bg-white animate-pulse delay-75"></div>
                              <div className="w-1 h-3 bg-white animate-pulse delay-150"></div>
                           </div>
                        ) : (
                          // Initials
                          <span className="text-sm">{station.name.substring(0, 2).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="flex flex-col items-start text-left">
                        <span className={`font-bold text-lg ${isActive ? 'text-workshop-accent' : 'text-workshop-text'}`}>
                          {station.name}
                        </span>
                        <span className="text-xs text-workshop-secondary">{station.desc}</span>
                      </div>
                    </div>

                    {/* Play/Pause Status Icon */}
                    <div className="text-workshop-secondary">
                      {isActive && isLoading ? (
                        <div className="w-6 h-6 border-2 border-workshop-accent border-t-transparent rounded-full animate-spin"></div>
                      ) : isActive && isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-workshop-accent">
                           <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-50 group-hover:opacity-100">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                 );
               })}
            </div>
        </div>

        {/* App Links (Spotify) */}
        <div>
            <h3 className="text-workshop-accent font-bold uppercase tracking-wider text-sm mb-3 px-1">Appar</h3>
            <div className="grid grid-cols-1 gap-3">
                <button 
                onClick={openSpotify}
                className="bg-[#191414] border border-gray-700 text-white p-4 rounded-xl flex items-center justify-between hover:bg-[#1DB954] hover:text-black hover:border-[#1DB954] transition-all active:scale-95 shadow-lg group"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center text-black">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-lg">Spotify</span>
                        <span className="text-xs text-gray-400 group-hover:text-black/70">Öppna appen</span>
                      </div>
                   </div>
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 opacity-50">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                   </svg>
                </button>
            </div>
        </div>

      </div>

      {/* Sticky Bottom Player */}
      {currentStation && (
        <div className="fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-workshop-accent p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.7)] z-50 flex items-center justify-between md:justify-center md:gap-12 animate-slide-up">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: currentStation.color }}>
                 {currentStation.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                 <span className="text-white font-bold text-sm leading-tight flex items-center">
                    {currentStation.name}
                    {isPlaying && <Equalizer />}
                 </span>
                 <span className="text-workshop-secondary text-xs">{isPlaying ? 'Spelas nu' : 'Pausad'}</span>
              </div>
           </div>

           <button 
             onClick={() => isPlaying ? stopPlayback() : playStation(currentStation)}
             className="w-12 h-12 bg-workshop-accent rounded-full flex items-center justify-center text-white shadow-lg hover:bg-orange-500 active:scale-95 transition-all"
           >
              {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                 </svg>
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                 </svg>
              )}
           </button>
        </div>
      )}
    </div>
  );
};

export default MusicRadioTool;