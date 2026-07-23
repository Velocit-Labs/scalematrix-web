import React, { useState } from 'react';
import Strategy from './Strategy';
import Audit from '../analytics/Audit';
import Competitors from '../analytics/Competitors';

export default function StrategyConsole({ settings }) {
  const [activeTab, setActiveTab] = useState('strategy'); // 'strategy', 'audit', 'competitors'

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-950">
      
      {/* Sleek top navigation tabs (text-sm) */}
      <div className="px-8 py-3 bg-neutral-950 flex items-center justify-between">
        <div className="flex gap-2">
          {[
            { id: 'strategy', label: 'Strategy Charter' },
            { id: 'audit', label: 'Presence Audit' },
            { id: 'competitors', label: 'Competitor Intel' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 px-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white shadow-inner'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render active sub-view */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'strategy' && (
          <Strategy 
            settings={settings} 
          />
        )}
        {activeTab === 'audit' && (
          <Audit 
            settings={settings} 
          />
        )}
        {activeTab === 'competitors' && (
          <Competitors 
            settings={settings} 
          />
        )}
      </div>

    </div>
  );
}
