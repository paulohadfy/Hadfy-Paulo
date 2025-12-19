
import React, { useState } from 'react';

interface MaterialOrderToolProps {
  onBack: () => void;
}

interface Supplier {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  coords: string; // for google maps
  webUrl: string;
  color: string;
}

const SUPPLIERS: Supplier[] = [
  // Linköping
  { 
    id: 'bev-lkp', 
    name: 'Bevego Linköping', 
    city: 'Linköping', 
    address: 'Torvingegatan 15', 
    phone: '013-242880', 
    coords: 'Torvingegatan+15+Linköping', 
    webUrl: 'https://www.bevego.se',
    color: '#005baa' // Blueish
  },
  { 
    id: 'ahl-lkp-rox', 
    name: 'Ahlsell Linköping (Roxtorp)', 
    city: 'Linköping', 
    address: 'Norra Roxtorpsgatan 9', 
    phone: '013-375400', 
    coords: 'Ahlsell+Roxtorp+Linköping', 
    webUrl: 'https://www.ahlsell.se',
    color: '#ffcc00' // Yellowish
  },
  { 
    id: 'lin-lkp', 
    name: 'Lindab Linköping', 
    city: 'Linköping', 
    address: 'Attorpsgatan 6', 
    phone: '013-246060', 
    coords: 'Lindab+Linköping', 
    webUrl: 'https://www.lindab.se',
    color: '#007ac3' 
  },
  
  // Norrköping
  { 
    id: 'bev-nkp', 
    name: 'Bevego Norrköping', 
    city: 'Norrköping', 
    address: 'Koppargatan 13', 
    phone: '011-368600', 
    coords: 'Bevego+Norrköping', 
    webUrl: 'https://www.bevego.se',
    color: '#005baa' 
  },
  { 
    id: 'ahl-nkp', 
    name: 'Ahlsell Norrköping', 
    city: 'Norrköping', 
    address: 'Exportgatan 38', 
    phone: '011-213500', 
    coords: 'Ahlsell+Norrköping', 
    webUrl: 'https://www.ahlsell.se',
    color: '#ffcc00' 
  },
   { 
    id: 'lin-nkp', 
    name: 'Lindab Norrköping', 
    city: 'Norrköping', 
    address: 'Malmgatan 16', 
    phone: '011-325260', 
    coords: 'Lindab+Norrköping', 
    webUrl: 'https://www.lindab.se',
    color: '#007ac3' 
  },

  // Övriga
  { 
    id: 'ahl-mot', 
    name: 'Ahlsell Motala', 
    city: 'Motala', 
    address: 'Vintergatan 16', 
    phone: '0141-209700', 
    coords: 'Ahlsell+Motala', 
    webUrl: 'https://www.ahlsell.se',
    color: '#ffcc00' 
  },
  { 
    id: 'ahl-mjo', 
    name: 'Ahlsell Mjölby', 
    city: 'Mjölby', 
    address: 'Stridslyckegatan 1', 
    phone: '0142-88600', 
    coords: 'Ahlsell+Mjölby', 
    webUrl: 'https://www.ahlsell.se',
    color: '#ffcc00' 
  },
];

const CITIES = ['Alla', 'Linköping', 'Norrköping', 'Övriga'];

const MaterialOrderTool: React.FC<MaterialOrderToolProps> = ({ onBack }) => {
  const [selectedCity, setSelectedCity] = useState('Alla');

  const filteredSuppliers = SUPPLIERS.filter(s => {
    if (selectedCity === 'Alla') return true;
    if (selectedCity === 'Övriga') return !['Linköping', 'Norrköping'].includes(s.city);
    return s.city === selectedCity;
  });

  const openMap = (query: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const openWeb = (url: string) => {
     window.open(url, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="bg-workshop-surface p-3 rounded-md hover:bg-gray-600 mr-4 border border-gray-700 text-workshop-text">&larr; Tillbaka</button>
        <div>
           <h2 className="text-2xl font-bold text-workshop-text">Materialbeställning</h2>
           <p className="text-sm text-workshop-secondary">Grossister i Östergötland</p>
        </div>
      </div>

      {/* City Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
        {CITIES.map(city => (
            <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors border
                    ${selectedCity === city 
                        ? 'bg-workshop-primary text-white border-red-900' 
                        : 'bg-workshop-surface text-workshop-secondary border-gray-700 hover:bg-gray-700'
                    }
                `}
            >
                {city}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSuppliers.map(supplier => (
            <div key={supplier.id} className="bg-workshop-surface border border-gray-700 p-5 rounded-xl shadow-md group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: supplier.color }}></span>
                            {supplier.name}
                        </h3>
                        <p className="text-workshop-secondary text-sm">{supplier.address}, {supplier.city}</p>
                    </div>
                    {/* Logo/Badge Placeholder if needed */}
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <button 
                        onClick={() => openWeb(supplier.webUrl)}
                        className="flex flex-col items-center justify-center p-3 bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors border border-stone-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mb-1 text-workshop-accent">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span className="text-xs font-bold text-gray-300">Webbshop</span>
                    </button>

                    <button 
                        onClick={() => openMap(supplier.coords)}
                        className="flex flex-col items-center justify-center p-3 bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors border border-stone-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mb-1 text-workshop-secondary">
                             <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                             <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="text-xs font-bold text-gray-300">Hitta hit</span>
                    </button>

                    <a 
                        href={`tel:${supplier.phone}`}
                        className="flex flex-col items-center justify-center p-3 bg-green-900/30 rounded-lg hover:bg-green-900/50 transition-colors border border-green-900"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mb-1 text-green-500">
                             <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span className="text-xs font-bold text-gray-300">Ring</span>
                    </a>
                </div>
            </div>
        ))}

        {filteredSuppliers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                Inga leverantörer hittades i detta område.
            </div>
        )}
      </div>
    </div>
  );
};

export default MaterialOrderTool;