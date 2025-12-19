
import React, { useState, useEffect } from 'react';
import { TimeEntry } from '../types.ts';

interface TimeReportProps {
  onBack: () => void;
}

const WORK_CATEGORIES = [
  'Verkstadstillverkning',
  'Bandtäckning',
  'Skivtäckning',
  'Garneringsarbeten',
  'Montering Stuvar/Häng',
  'Service / Reparation',
  'Restid / Etablering',
  'Övrigt'
];

// Helper to calculate ISO week number
const getWeekNumber = (d: Date): number => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
};

const TimeReport: React.FC<TimeReportProps> = ({ onBack }) => {
  // Load initial history from localStorage
  const [history, setHistory] = useState<TimeEntry[]>(() => {
    const saved = localStorage.getItem('hallgrens_time_report');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(new Date()));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showReminder, setShowReminder] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    project: '',
    category: WORK_CATEGORIES[0],
    hours: '',
    description: '',
    materials: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Check for Friday Reminder (Friday is day 5) and time >= 15:00
  useEffect(() => {
    const day = currentDate.getDay();
    const hour = currentDate.getHours();
    
    if (day === 5 && hour >= 15) {
      setShowReminder(true);
    }
  }, [currentDate]);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('hallgrens_time_report', JSON.stringify(history));
  }, [history]);

  // Filter entries for the selected week
  const weekEntries = history.filter(entry => {
    const entryDate = new Date(entry.date);
    return getWeekNumber(entryDate) === selectedWeek && entryDate.getFullYear() === selectedYear;
  });

  const totalHoursWeek = weekEntries.reduce((sum, entry) => sum + entry.hours, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project || !formData.hours) return;

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      date: formData.date,
      project: formData.project,
      category: formData.category,
      hours: parseFloat(formData.hours),
      description: formData.description,
      materials: formData.materials
    };

    setHistory([newEntry, ...history]); // Add to top
    setSubmitted(true);
    
    // Reset form partially
    setFormData(prev => ({
      ...prev,
      project: '',
      hours: '',
      description: '',
      materials: ''
    }));

    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Ta bort denna post?')) {
        setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
        if (selectedWeek === 1) {
            setSelectedWeek(52);
            setSelectedYear(prev => prev - 1);
        } else {
            setSelectedWeek(prev => prev - 1);
        }
    } else {
        if (selectedWeek === 52) {
            setSelectedWeek(1);
            setSelectedYear(prev => prev + 1);
        } else {
            setSelectedWeek(prev => prev + 1);
        }
    }
  };

  // Export Logic
  const handleShare = async () => {
    if (weekEntries.length === 0) {
        alert("Ingen tid rapporterad för denna vecka.");
        return;
    }

    // 1. Create CSV content
    const csvHeader = "Datum,Projekt,Moment,Timmar,Beskrivning,Material\n";
    const csvRows = weekEntries.map(e => 
      `${e.date},"${e.project}","${e.category}",${e.hours},"${e.description || ''}","${e.materials || ''}"`
    ).join("\n");
    const csvContent = csvHeader + csvRows;

    // 2. Create Text Summary
    const textSummary = weekEntries.map(e => 
        `${e.date}: ${e.project} (${e.hours}h) - ${e.category}`
    ).join('\n') + `\n\nTOTALT VECKA ${selectedWeek}: ${totalHoursWeek} timmar`;

    const fileName = `Tidrapport_V${selectedWeek}_Hallgrens.csv`;

    try {
        // Check if Web Share API supports files
        if (navigator.canShare && navigator.canShare({ files: [new File([], fileName)] })) {
            const file = new File([csvContent], fileName, { type: 'text/csv' });
            await navigator.share({
                title: `Tidrapport Vecka ${selectedWeek}`,
                text: `Här kommer tidrapport för vecka ${selectedWeek}.\n\n${textSummary}`,
                files: [file]
            });
        } else if (navigator.share) {
            // Fallback to sharing text only
            await navigator.share({
                title: `Tidrapport Vecka ${selectedWeek}`,
                text: `TIDRAPPORT VECKA ${selectedWeek}\n------------------\n${textSummary}`
            });
        } else {
            // Fallback for desktop/unsupported browsers: Mailto
            window.location.href = `mailto:?subject=Tidrapport Vecka ${selectedWeek}&body=${encodeURIComponent(textSummary)}`;
        }
    } catch (error) {
        console.log('Sharing failed or cancelled', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Friday Reminder Banner */}
      {showReminder && totalHoursWeek < 40 && (
          <div className="bg-workshop-accent text-white p-4 mb-4 rounded-lg shadow-lg animate-bounce flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <span className="text-2xl">🔔</span>
                  <div>
                      <h3 className="font-bold">Fredagspåminnelse!</h3>
                      <p className="text-sm">Klockan är över 15:00. Glöm inte skicka in veckorapporten.</p>
                  </div>
              </div>
              <button onClick={() => setShowReminder(false)} className="text-white/80 hover:text-white font-bold px-3">OK</button>
          </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <button onClick={onBack} className="bg-workshop-surface p-3 rounded-md hover:bg-gray-600 mr-4 border border-gray-700 text-workshop-text">&larr; Tillbaka</button>
            <div>
            <h2 className="text-2xl font-bold text-workshop-text">Tidrapport</h2>
            <p className="text-sm text-workshop-secondary">Logga & Exportera</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FORM SECTION */}
        <div className="bg-workshop-surface p-6 rounded-lg border border-gray-700 shadow-xl order-2 lg:order-1">
          <h3 className="text-lg font-bold text-workshop-primary mb-4 border-b border-gray-700 pb-2">Ny Registrering</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-workshop-accent uppercase tracking-wider mb-1">Datum</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-workshop-bg border border-gray-600 rounded p-3 text-workshop-text focus:border-workshop-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-workshop-accent uppercase tracking-wider mb-1">Timmar</label>
                <input 
                  type="number" 
                  step="0.5"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  placeholder="0.0"
                  className="w-full bg-workshop-bg border border-gray-600 rounded p-3 text-workshop-text focus:border-workshop-accent focus:outline-none font-mono text-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-workshop-accent uppercase tracking-wider mb-1">Projekt / AO</label>
              <input 
                type="text" 
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                placeholder="T.ex. Kv. Eken"
                className="w-full bg-workshop-bg border border-gray-600 rounded p-3 text-workshop-text focus:border-workshop-accent focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-workshop-accent uppercase tracking-wider mb-1">Moment</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-workshop-bg border border-gray-600 rounded p-3 text-workshop-text focus:border-workshop-accent focus:outline-none"
              >
                {WORK_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-workshop-secondary uppercase tracking-wider mb-1">Beskrivning</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                placeholder="Vad har utförts?"
                className="w-full bg-workshop-bg border border-gray-600 rounded p-3 text-workshop-text focus:border-workshop-accent focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-workshop-secondary uppercase tracking-wider mb-1">Material</label>
              <textarea 
                name="materials"
                value={formData.materials}
                onChange={handleInputChange}
                rows={2}
                placeholder="T.ex. 2 rullar band..."
                className="w-full bg-workshop-bg border border-gray-600 rounded p-3 text-workshop-text focus:border-workshop-accent focus:outline-none text-sm"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-workshop-primary text-workshop-text font-bold text-lg py-4 rounded hover:bg-workshop-primary-hover transition-colors shadow-lg border border-red-900 mt-2"
            >
              Spara Post
            </button>
            
            {submitted && (
              <div className="bg-green-900/50 border border-green-600 text-green-200 p-3 rounded text-center animate-pulse">
                Sparat!
              </div>
            )}
          </form>
        </div>

        {/* WEEKLY SUMMARY SECTION */}
        <div className="space-y-4 order-1 lg:order-2">
          
          {/* Week Selector */}
          <div className="bg-stone-900 p-4 rounded-lg border border-stone-700 flex items-center justify-between shadow-lg">
             <button onClick={() => changeWeek('prev')} className="p-2 hover:bg-stone-800 rounded text-workshop-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
             </button>
             <div className="text-center">
                <span className="block text-xs text-workshop-secondary uppercase tracking-wider">Vecka {selectedWeek}</span>
                <span className="block text-xl font-bold text-white">{selectedYear}</span>
             </div>
             <button onClick={() => changeWeek('next')} className="p-2 hover:bg-stone-800 rounded text-workshop-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
             </button>
          </div>

          <div className="bg-workshop-surface border border-gray-700 rounded-lg p-4 flex justify-between items-center">
             <span className="text-workshop-secondary font-semibold">Totalt denna vecka:</span>
             <span className="text-2xl font-bold text-workshop-accent">{totalHoursWeek} h</span>
          </div>
          
          {weekEntries.length === 0 ? (
            <div className="text-workshop-secondary italic text-center py-10 opacity-50 bg-workshop-surface/50 rounded-lg border border-dashed border-gray-800">
              Ingenting rapporterat vecka {selectedWeek}.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {weekEntries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                <div key={entry.id} className="relative group bg-workshop-surface border-l-4 border-workshop-accent p-4 rounded shadow">
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Ta bort"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>

                  <div className="flex justify-between items-start mb-2 pr-4">
                    <span className="font-bold text-lg text-white">{entry.project}</span>
                    <span className="bg-workshop-bg px-2 py-1 rounded text-xs text-workshop-accent font-mono border border-gray-700 whitespace-nowrap">{entry.hours} h</span>
                  </div>
                  <div className="text-xs text-workshop-secondary uppercase tracking-wide mb-1 flex justify-between">
                      <span>{entry.category}</span>
                      <span>{entry.date}</span>
                  </div>
                  
                  {entry.description && (
                    <p className="text-sm text-gray-300 mb-2 border-l-2 border-gray-700 pl-2">{entry.description}</p>
                  )}
                  
                  {entry.materials && (
                    <div className="bg-workshop-bg p-2 rounded text-xs text-gray-400 mt-2 border border-gray-800">
                      <strong className="text-gray-500 block mb-1">Material:</strong>
                      {entry.materials}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Export Button */}
          {weekEntries.length > 0 && (
              <button 
                onClick={handleShare}
                className="w-full py-4 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold shadow-lg border border-green-800 flex items-center justify-center gap-3 transition-colors active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                Dela / Skicka Rapport (v.{selectedWeek})
              </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default TimeReport;
