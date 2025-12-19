
import React, { useState } from 'react';
import { Contact } from '../types.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

interface ProjectContactsToolProps {
  onBack: () => void;
}

const ProjectContactsTool: React.FC<ProjectContactsToolProps> = ({ onBack }) => {
  // Use localStorage instead of volatile useState
  // Default values only used if nothing exists in storage
  const [contacts, setContacts] = useLocalStorage<Contact[]>('hallgrens_contacts', [
    { id: '1', name: 'Arbetsledare Jocke', role: 'Arbetsledning', phone: '070-123 45 67' },
    { id: '2', name: 'Kontoret', role: 'Administration', phone: '08-555 123 45' },
    { id: '3', name: 'Bevego (Beställning)', role: 'Material', phone: '010-456 78 90' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleImportContacts = async () => {
    // Check if Contact Picker API is supported (Android/Chrome mainly)
    const isSupported = ('contacts' in navigator && 'ContactsManager' in window);

    if (!isSupported) {
        alert("Din enhet (t.ex. iPhone) tillåter tyvärr inte att webbappar hämtar kontakter direkt från telefonboken på grund av säkerhetsbegränsningar.\n\nVänligen använd 'Lägg till manuellt' istället.");
        return;
    }

    try {
        const props = ['name', 'tel'];
        const opts = { multiple: true };
        // @ts-ignore - Typescript might not accept navigator.contacts without specific config
        const results = await navigator.contacts.select(props, opts);
        
        if (results && results.length > 0) {
            const importedContacts: Contact[] = results.map((c: any) => ({
                id: Date.now().toString() + Math.random().toString().slice(2),
                name: c.name?.[0] || 'Namnlös Kontakt',
                role: 'Mobilkontakt',
                phone: c.tel?.[0] || ''
            }));
            
            setContacts(prev => [...prev, ...importedContacts]);
        }
    } catch (err) {
        console.error("Kunde inte importera kontakter", err);
        // User likely cancelled the picker, ignore error
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: newName,
      role: newRole || 'Övrigt',
      phone: newPhone,
    };

    setContacts([...contacts, newContact]);
    setNewName('');
    setNewRole('');
    setNewPhone('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Vill du ta bort kontakten "${name}"?`)) {
        setContacts(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
  };

  const handleSms = (phone: string) => {
    window.location.href = `sms:${phone.replace(/\s/g, '')}`;
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-6">
        <button onClick={onBack} className="bg-workshop-surface p-3 rounded-md hover:bg-gray-600 mr-4 border border-gray-700 text-workshop-text">&larr; Tillbaka</button>
        <div className="inline-block align-middle">
            <h2 className="text-2xl font-bold text-workshop-text">Projektkontakter</h2>
            <p className="text-sm text-workshop-secondary">Ring eller SMS:a direkt</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-workshop-surface border border-gray-700 p-4 rounded-xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 group">
            
            {/* Contact Info & Delete Button (Avatar) */}
            <div className="flex items-center gap-4">
               {/* Avatar as Delete Button */}
               <button 
                  onClick={() => handleDelete(contact.id, contact.name)}
                  className="relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all active:scale-95 bg-gray-800 text-workshop-secondary border border-gray-600 hover:bg-red-900 hover:text-white hover:border-red-700"
                  title="Klicka för att ta bort kontakt"
               >
                  {/* Initials */}
                  <span>{contact.name.charAt(0).toUpperCase()}</span>
                  
                  {/* Small Delete Badge - Visible always for better mobile UX */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center border-2 border-workshop-surface shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
               </button>

               <div className="flex-1">
                 <h3 className="text-lg font-bold text-white leading-tight">{contact.name}</h3>
                 <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                    <p className="text-xs text-workshop-accent uppercase tracking-wider">{contact.role}</p>
                    <p className="text-sm text-gray-400 font-mono">{contact.phone}</p>
                 </div>
               </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
               <button 
                 onClick={() => handleSms(contact.phone)}
                 className="flex-1 md:flex-none bg-stone-700 hover:bg-stone-600 text-white py-3 px-5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors border border-stone-600 shadow-sm active:scale-95"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                 </svg>
                 SMS
               </button>
               <button 
                 onClick={() => handleCall(contact.phone)}
                 className="flex-1 md:flex-none bg-green-700 hover:bg-green-600 text-white py-3 px-5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors border border-green-800 shadow-sm active:scale-95"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                 </svg>
                 Ring
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons Area */}
      <div className="mt-8 border-t border-gray-800 pt-6 space-y-3">
        
        {/* Import Button */}
        {!showAddForm && (
            <button
                onClick={handleImportContacts}
                className="w-full py-4 bg-workshop-surface border border-gray-600 text-workshop-text rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-semibold shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-workshop-accent">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <line x1="9" y1="10" x2="15" y2="10" />
                </svg>
                Importera från Telefonbok
            </button>
        )}

        {!showAddForm ? (
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 border-2 border-dashed border-gray-700 text-gray-500 rounded-xl hover:border-workshop-accent hover:text-workshop-accent transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Lägg till manuellt
          </button>
        ) : (
          <div className="bg-workshop-surface border border-gray-700 rounded-xl p-6 shadow-xl animate-fade-in">
             <h3 className="text-xl font-bold text-white mb-4">Ny Kontakt</h3>
             <form onSubmit={handleAddContact} className="space-y-4">
                <div>
                   <label className="block text-xs text-workshop-secondary uppercase font-bold mb-1">Namn</label>
                   <input 
                     type="text" 
                     value={newName}
                     onChange={(e) => setNewName(e.target.value)}
                     className="w-full bg-workshop-bg border border-gray-600 rounded p-3 text-white focus:border-workshop-accent focus:outline-none"
                     placeholder="T.ex. Elektriker Nisse"
                     required
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-workshop-secondary uppercase font-bold mb-1">Roll (Valfritt)</label>
                    <input 
                      type="text" 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full bg-workshop-bg border border-gray-600 rounded p-3 text-white focus:border-workshop-accent focus:outline-none"
                      placeholder="T.ex. UE El"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-workshop-secondary uppercase font-bold mb-1">Telefon</label>
                    <input 
                      type="tel" 
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-workshop-bg border border-gray-600 rounded p-3 text-white focus:border-workshop-accent focus:outline-none font-mono"
                      placeholder="070-XXX XX XX"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                   <button 
                     type="button" 
                     onClick={() => setShowAddForm(false)}
                     className="flex-1 py-3 bg-transparent border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-800 font-semibold"
                   >
                     Avbryt
                   </button>
                   <button 
                     type="submit" 
                     className="flex-1 py-3 bg-workshop-primary text-white border border-red-900 rounded-lg hover:bg-workshop-primary-hover font-semibold shadow-lg"
                   >
                     Spara Kontakt
                   </button>
                </div>
             </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectContactsTool;
