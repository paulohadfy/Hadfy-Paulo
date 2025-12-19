
import React, { useState, useEffect, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.ts';
import { ProfileSegment } from '../types.ts';

interface ProfileCalculatorProps {
  onBack: () => void;
}

interface SavedProfile {
    id: string;
    name: string;
    date: string;
    segments: ProfileSegment[];
    profileLength: string;
}

const ProfileCalculator: React.FC<ProfileCalculatorProps> = ({ onBack }) => {
  // Initialize with a standard Window Flashing shape (Fönsterbleck)
  const defaultProfile: ProfileSegment[] = [
    { id: '1', length: 15, angle: 0 },   // Bakkant
    { id: '2', length: 100, angle: 100 }, // Fall
    { id: '3', length: 30, angle: 90 },   // Framkant
    { id: '4', length: 10, angle: 135 },  // Droppnäsa
  ];

  const [segments, setSegments] = useLocalStorage<ProfileSegment[]>('profile_segments', defaultProfile);
  const [profileLength, setProfileLength] = useLocalStorage<string>('profile_length', '');
  const [savedProfiles, setSavedProfiles] = useLocalStorage<SavedProfile[]>('saved_profiles_list', []);
  
  const [totalLength, setTotalLength] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Calculate total theoretical cut length
  useEffect(() => {
    const sum = segments.reduce((acc, curr) => acc + (isNaN(curr.length) ? 0 : curr.length), 0);
    setTotalLength(sum);
  }, [segments]);

  const updateSegment = (id: string, field: keyof ProfileSegment, value: number) => {
    const newSegments = segments.map(seg => {
      if (seg.id === id) {
        return { ...seg, [field]: value };
      }
      return seg;
    });
    setSegments(newSegments);
  };

  const addSegment = () => {
    const newId = Date.now().toString();
    setSegments([...segments, { id: newId, length: 50, angle: 90 }]);
  };

  const removeSegment = (id: string) => {
    if (segments.length <= 1) return; 
    setSegments(segments.filter(s => s.id !== id));
  };

  // --- Save / Load Logic ---
  const saveProfile = () => {
      if (!profileName.trim()) {
          alert('Ange ett namn på profilen först.');
          return;
      }
      const newProfile: SavedProfile = {
          id: Date.now().toString(),
          name: profileName,
          date: new Date().toLocaleDateString('sv-SE'),
          segments: segments,
          profileLength: profileLength
      };
      setSavedProfiles([newProfile, ...savedProfiles]);
      setProfileName('');
      alert('Profil sparad!');
  };

  const loadProfile = (profile: SavedProfile) => {
      if(window.confirm(`Vill du ladda "${profile.name}"? Nuvarande osparade ändringar försvinner.`)) {
          setSegments(profile.segments);
          setProfileLength(profile.profileLength || '');
          setShowShareModal(false);
      }
  };

  const deleteProfile = (id: string) => {
      if(window.confirm('Ta bort denna sparade profil?')) {
          setSavedProfiles(savedProfiles.filter(p => p.id !== id));
      }
  };

  // --- Visualizer Component (Supports Print Mode) ---
  const ProfileVisualizer = ({ items, is3D, printMode = false }: { items: ProfileSegment[], is3D: boolean, printMode?: boolean }) => {
    let currentX = 0;
    let currentY = 0;
    let currentAngle = 0; 
    
    const calculatedSegments: {x: number, y: number, length: number, angle: number}[] = [];
    const points: {x: number, y: number}[] = [{x: 0, y: 0}];

    items.forEach((seg, index) => {
        const len = seg.length || 0;
        if (index > 0) currentAngle += seg.angle;
        const startX = currentX;
        const startY = currentY;
        const absAngle = currentAngle;
        const rad = (currentAngle * Math.PI) / 180;
        currentX += len * Math.cos(rad);
        currentY += len * Math.sin(rad);
        points.push({x: currentX, y: currentY});
        calculatedSegments.push({ x: startX, y: startY, length: len, angle: absAngle });
    });

    // Bounding box
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const padding = 40;
    
    // Theme Colors
    const bgClass = printMode ? "bg-white border-2 border-gray-300" : "bg-stone-900 border border-stone-700";
    const strokeColor = printMode ? "#000000" : "#d97706"; // Black for print, Amber for dark mode
    const vertexStart = printMode ? "#16a34a" : "#10b981";
    const vertexEnd = printMode ? "#dc2626" : "#ef4444";
    const gridColor = printMode ? "#e5e5e5" : "#333";
    const textColor = printMode ? "text-gray-800" : "text-gray-500";
    
    // 3D Colors
    // In print mode we want a "SketchUp" style: light faces with dark edges
    const faceGradient = printMode 
        ? "linear-gradient(90deg, #e5e7eb, #f3f4f6, #d1d5db)" // Light gray gradient
        : "linear-gradient(90deg, #78716c, #a8a29e, #57534e)"; // Dark stone gradient
    const faceBorder = printMode ? "1px solid #374151" : "1px solid rgba(255,255,255,0.1)";

    // 2D SVG View
    if (!is3D) {
        const vbW = Math.max(width + padding * 2, 100);
        const vbH = Math.max(height + padding * 2, 100);
        const vbX = minX - padding;
        const vbY = minY - padding;
        const pathD = points.map((p, i) => (i === 0 ? "M" : "L") + ` ${p.x} ${p.y}`).join(" ");

        return (
            <div className={`w-full ${printMode ? 'h-64' : 'h-80'} ${bgClass} rounded-lg flex items-center justify-center overflow-hidden relative shadow-inner print:shadow-none`}>
                 <svg viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} className="w-full h-full p-4" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <pattern id={printMode ? "grid-p" : "grid"} width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridColor} strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect x={vbX} y={vbY} width={vbW} height={vbH} fill={`url(#${printMode ? "grid-p" : "grid"})`} />
                    <path d={pathD} stroke={strokeColor} strokeWidth={printMode ? "3" : "2"} fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="3" fill={i === 0 ? vertexStart : i === points.length - 1 ? vertexEnd : (printMode ? "#000" : "#fff")} vectorEffect="non-scaling-stroke" />
                    ))}
                </svg>
                {!printMode && <div className="absolute bottom-2 left-2 text-[10px] text-gray-500 font-mono">Grön: Start | Röd: Slut</div>}
            </div>
        );
    }

    // 3D CSS View
    const maxDim = Math.max(width, height) || 100;
    const scale = 200 / maxDim;
    const extrusionDepth = 300; 

    return (
        <div className={`w-full ${printMode ? 'h-64' : 'h-80'} ${bgClass} rounded-lg flex items-center justify-center overflow-hidden relative shadow-inner perspective-[1000px] print:shadow-none`}>
             <style>
                {`
                    @keyframes rotateProfile {
                        from { transform: rotateX(-20deg) rotateY(-30deg); }
                        to { transform: rotateX(-20deg) rotateY(330deg); }
                    }
                    .profile-3d-scene {
                        transform-style: preserve-3d;
                        animation: ${printMode ? 'none' : 'rotateProfile 12s linear infinite'};
                        transform: ${printMode ? 'rotateX(-25deg) rotateY(-45deg)' : ''}; /* Fixed nice angle for print */
                    }
                    .profile-face {
                        position: absolute;
                        background: ${faceGradient};
                        border: ${faceBorder};
                        backface-visibility: visible;
                        transform-origin: 0 0;
                    }
                `}
            </style>
            
            <div className="profile-3d-scene relative w-0 h-0">
                <div style={{ transform: `translateX(${-centerX * scale}px) translateY(${-centerY * scale}px)` }}>
                    {calculatedSegments.map((seg, i) => (
                        <div key={i} className="profile-face"
                            style={{
                                width: `${seg.length * scale}px`,
                                height: `${extrusionDepth}px`,
                                transform: `translate3d(${seg.x * scale}px, ${seg.y * scale}px, ${-extrusionDepth/2}px) rotateZ(${seg.angle}deg) rotateX(90deg)`
                            }}
                        />
                    ))}
                </div>
            </div>
             {!printMode && <div className="absolute bottom-4 text-xs text-gray-500 animate-pulse">Roterar...</div>}
        </div>
    );
  };

  return (
    <div className="pb-20">
      {/* Hide controls when printing */}
      <div className="print:hidden">
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="bg-workshop-surface p-3 rounded-md hover:bg-gray-600 mr-4 border border-gray-700 text-workshop-text">&larr; Tillbaka</button>
            <div>
                <h2 className="text-2xl font-bold text-workshop-text">Profilverktyg</h2>
                <p className="text-sm text-workshop-secondary">Fönsterbleck & Beslag</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Col: Visualizer */}
            <div className="order-2 lg:order-1 space-y-6">
                <div className="relative">
                    <button 
                        onClick={() => setShow3D(!show3D)}
                        className="absolute top-4 right-4 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold py-2 px-3 rounded border border-gray-600 z-20 flex items-center gap-2 shadow-lg"
                    >
                        {show3D ? "Visa Ritning (2D)" : "Visa 3D-modell"}
                    </button>
                    <ProfileVisualizer items={segments} is3D={show3D} />
                </div>
                
                {/* Saved Profiles Section */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                    <h3 className="text-workshop-accent font-bold uppercase text-xs tracking-wider mb-3">Sparade Profiler</h3>
                    {savedProfiles.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">Inga sparade profiler än.</p>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {savedProfiles.map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-workshop-surface p-2 rounded border border-stone-700">
                                    <div className="flex-1 cursor-pointer hover:text-white" onClick={() => loadProfile(p)}>
                                        <div className="font-bold text-sm text-gray-200">{p.name}</div>
                                        <div className="text-[10px] text-gray-500">{p.date} • {p.segments.length} delar</div>
                                    </div>
                                    <button onClick={() => deleteProfile(p.id)} className="text-gray-500 hover:text-red-500 px-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Col: Builder */}
            <div className="order-1 lg:order-2">
                <div className="bg-workshop-surface p-4 rounded-xl border border-gray-700 shadow-lg">
                    {/* Top Actions: Add New / Share */}
                    <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
                        <div className="flex gap-2">
                             <button 
                                onClick={() => { setShowShareModal(true); setShow3D(true); }}
                                className="bg-workshop-accent hover:bg-orange-700 text-white text-sm px-3 py-2 rounded flex items-center gap-1 shadow"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                Dela / Beställ
                            </button>
                        </div>
                        <button 
                            onClick={addSegment}
                            className="bg-green-700 hover:bg-green-600 text-white text-sm px-3 py-2 rounded flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Ny Del
                        </button>
                    </div>

                    {/* Profile Name & Length */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-stone-900/50 p-2 rounded border border-stone-700">
                             <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Benämning</label>
                             <div className="flex gap-1">
                                <input 
                                    type="text" 
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    className="w-full bg-stone-800 text-white p-1 rounded border border-stone-600 text-sm"
                                    placeholder="T.ex. Fönsterbleck Kök"
                                />
                                <button onClick={saveProfile} className="bg-stone-700 px-2 rounded hover:bg-stone-600" title="Spara">💾</button>
                             </div>
                        </div>
                        <div className="bg-stone-900/50 p-2 rounded border border-stone-700">
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Längd (mm)</label>
                            <input 
                                type="number" 
                                value={profileLength}
                                onChange={(e) => setProfileLength(e.target.value)}
                                className="w-full bg-stone-800 text-white p-1 rounded border border-stone-600 text-sm font-mono"
                                placeholder="2000"
                            />
                        </div>
                    </div>

                    {/* Segments List */}
                    <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                        <div className="grid grid-cols-10 gap-2 text-xs font-bold text-gray-500 uppercase px-2">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-4">Längd (mm)</div>
                            <div className="col-span-4">Bock (°)</div>
                            <div className="col-span-1"></div>
                        </div>

                        {segments.map((seg, index) => (
                            <div key={seg.id} className="grid grid-cols-10 gap-2 items-center bg-workshop-bg p-2 rounded border border-gray-800">
                                <div className="col-span-1 flex justify-center items-center">
                                    <span className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-bold">{index + 1}</span>
                                </div>
                                <div className="col-span-4">
                                    <input 
                                        type="number" 
                                        value={seg.length}
                                        onChange={(e) => updateSegment(seg.id, 'length', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-stone-800 text-white p-2 rounded border border-stone-600 focus:border-workshop-accent focus:outline-none font-mono text-center"
                                    />
                                </div>
                                <div className="col-span-4 relative">
                                    {index === 0 ? (
                                        <div className="text-center text-gray-500 text-xs italic py-2">Start</div>
                                    ) : (
                                        <div className="flex items-center">
                                            <input 
                                                type="number" 
                                                value={seg.angle}
                                                onChange={(e) => updateSegment(seg.id, 'angle', parseFloat(e.target.value) || 0)}
                                                className="w-full bg-stone-800 text-white p-2 rounded border border-stone-600 focus:border-workshop-accent focus:outline-none font-mono text-center"
                                            />
                                            <button 
                                                onClick={() => updateSegment(seg.id, 'angle', seg.angle * -1)}
                                                className="absolute right-1 text-gray-400 hover:text-white"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <button 
                                        onClick={() => removeSegment(seg.id)}
                                        className="text-gray-500 hover:text-red-500"
                                        disabled={segments.length <= 1}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Result Box */}
                    <div className="mt-6 pt-6 border-t border-gray-600">
                        <div className="flex flex-col items-center p-4 bg-stone-900 rounded-lg border border-stone-700 shadow-inner">
                            <span className="text-workshop-secondary uppercase text-xs font-bold tracking-widest mb-2">Teoretisk Klippbredd</span>
                            <span className="text-4xl font-mono font-bold text-white mb-2">{totalLength} <span className="text-xl text-gray-500">mm</span></span>
                            
                            {profileLength && !isNaN(parseFloat(profileLength)) && parseFloat(profileLength) > 0 && (
                                <div className="mt-3 pt-3 border-t border-stone-700 w-full flex justify-between items-center px-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase font-bold">Total Area</span>
                                        <span className="text-xl font-bold text-workshop-accent">
                                            {((totalLength * parseFloat(profileLength)) / 1000000).toFixed(3)} m²
                                        </span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-xs text-gray-400 uppercase font-bold">Längd</span>
                                        <span className="text-xl font-bold text-gray-300">{profileLength} mm</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* SHARE / PRINT MODAL */}
      {showShareModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-0 md:p-4 overflow-y-auto print:static print:bg-white print:p-0">
             <div className="bg-white w-full max-w-4xl min-h-[50vh] rounded-xl shadow-2xl flex flex-col print:shadow-none print:w-full">
                
                {/* Header (No Print) */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 print:hidden">
                    <h3 className="text-xl font-bold text-gray-800">Beställningsunderlag</h3>
                    <div className="flex gap-2">
                        <button onClick={() => window.print()} className="bg-workshop-primary hover:bg-red-800 text-white px-4 py-2 rounded font-bold shadow flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                            Skriv ut / PDF
                        </button>
                        <button onClick={() => setShowShareModal(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-bold">Stäng</button>
                    </div>
                </div>

                {/* Printable Content */}
                <div className="p-8 bg-white text-gray-900 print:p-0">
                    {/* Header */}
                    <div className="flex justify-between items-end border-b-2 border-gray-800 pb-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">Profilspecifikation</h1>
                            <p className="text-sm text-gray-500 mt-1">Skapat med Hallgrens PlåtVerkstan App</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">{profileName || "Namnlös Profil"}</p>
                            <p className="text-sm text-gray-600">Datum: {new Date().toLocaleDateString('sv-SE')}</p>
                        </div>
                    </div>

                    {/* 3D Visual in Light Mode */}
                    <div className="mb-8 border border-gray-200 rounded p-4 bg-gray-50">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">3D Visualisering</p>
                        <ProfileVisualizer items={segments} is3D={true} printMode={true} />
                    </div>

                    {/* Data Table */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold border-b border-gray-300 pb-2 mb-4">Segmentdata</h4>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 uppercase text-xs font-bold text-gray-600">
                                    <tr>
                                        <th className="p-2">#</th>
                                        <th className="p-2">Längd</th>
                                        <th className="p-2">Bock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {segments.map((s, i) => (
                                        <tr key={i}>
                                            <td className="p-2 font-bold">{i + 1}</td>
                                            <td className="p-2">{s.length} mm</td>
                                            <td className="p-2 text-gray-600">{i===0 ? 'Start' : `${s.angle}°`}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div>
                             <h4 className="font-bold border-b border-gray-300 pb-2 mb-4">Sammanställning</h4>
                             <div className="bg-gray-100 p-4 rounded border border-gray-200 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Klippbredd (Ämne):</span>
                                    <span className="font-bold font-mono text-xl">{totalLength} mm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Profilens Längd:</span>
                                    <span className="font-bold">{profileLength || "Ej angivet"} {profileLength ? 'mm' : ''}</span>
                                </div>
                                <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
                                    <span className="font-bold uppercase text-xs">Total Area</span>
                                    <span className="font-bold text-2xl text-orange-600">
                                        {profileLength ? ((totalLength * parseFloat(profileLength)) / 1000000).toFixed(3) : "0.000"} m²
                                    </span>
                                </div>
                             </div>

                             <div className="mt-8 border border-gray-300 p-4 h-32 rounded">
                                 <p className="text-xs text-gray-400 uppercase font-bold mb-1">Anteckningar / Kulör</p>
                             </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default ProfileCalculator;
