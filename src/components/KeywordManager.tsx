import React, { useState } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';

// Simplified structure for the demo, 20x20x20 would be 800 items.
const generateData = () => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    const category = { id: `cat-${i}`, name: `Catégorie ${i + 1}`, subCategories: [] };
    for (let j = 0; j < 20; j++) {
      const subCat = { id: `sub-${i}-${j}`, name: `Sous-Cat ${j + 1}`, subSubCategories: [] };
      for (let k = 0; k < 20; k++) {
        subCat.subSubCategories.push({ id: `item-${i}-${j}-${k}`, name: `Mot ${k + 1}` });
      }
      category.subCategories.push(subCat);
    }
    data.push(category);
  }
  return data;
};

const KEYWORD_DATA = generateData();

export const KeywordManager: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeCat, setActiveCat] = useState<typeof KEYWORD_DATA[0] | null>(null);
  const [activeSubCat, setActiveSubCat] = useState<typeof KEYWORD_DATA[0]['subCategories'][0] | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleMouseDown = (item: { id: string, name: string }) => {
    setLongPressTimer(setTimeout(() => {
      setSelectedKeywords(prev => prev.includes(item.name) ? prev.filter(k => k !== item.name) : [...prev, item.name]);
    }, 500));
  };

  const handleMouseUp = () => {
    if (longPressTimer) clearTimeout(longPressTimer);
  };

  const handleItemClick = (item: { id: string, name: string }) => {
    if (longPressTimer) clearTimeout(longPressTimer);
    setSelectedKeywords(prev => prev.includes(item.name) ? prev.filter(k => k !== item.name) : [...prev, item.name]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gestionnaire de Mots-Clés</h2>
          <button onClick={onClose}><X /></button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Level 1 */}
          <div className="w-1/3 overflow-y-auto border-r">
            {KEYWORD_DATA.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCat(cat); setActiveSubCat(null); }} className={`block w-full text-left p-2 ${activeCat?.id === cat.id ? 'bg-blue-100' : ''}`}>
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Level 2 */}
          <div className="w-1/3 overflow-y-auto border-r">
            {activeCat?.subCategories.map(sub => (
              <button key={sub.id} onClick={() => setActiveSubCat(sub)} className={`block w-full text-left p-2 ${activeSubCat?.id === sub.id ? 'bg-blue-100' : ''}`}>
                {sub.name}
              </button>
            ))}
          </div>
          
          {/* Level 3 */}
          <div className="w-1/3 overflow-y-auto">
            {activeSubCat?.subSubCategories.map(item => (
              <button 
                key={item.id} 
                onMouseDown={() => handleMouseDown(item)}
                onMouseUp={handleMouseUp}
                onClick={() => handleItemClick(item)}
                className={`block w-full text-left p-2 ${selectedKeywords.includes(item.name) ? 'bg-green-100' : ''}`}>
                {item.name} {selectedKeywords.includes(item.name) && <Check size={16} className="inline"/>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
