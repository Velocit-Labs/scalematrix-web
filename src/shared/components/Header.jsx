import React, { useState } from 'react';
import { FiRefreshCw, FiSearch, FiBell, FiChevronDown, FiUser, FiInfo } from 'react-icons/fi';

export default function Header({ 
  activeView, 
  instagramConnected, 
  ollamaConnected, 
  syncData, 
  isSyncing, 
  username 
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('Acme Workspace (Default)');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const getTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Growth Dashboard';
      case 'analytics':
        return 'Metric Analytics';
      case 'audit':
        return 'Social Presence Audit';
      case 'strategy':
        return 'Growth Strategy';
      case 'planner':
        return 'Content Calendar & Planner';
      case 'studio':
        return 'Content Creator Studio';
      case 'publishing':
        return 'Publishing & Queue Center';
      case 'competitors':
        return 'Competitor Intelligence';
      case 'advisor':
        return 'AI Advisor Space';
      case 'reports':
        return 'Performance Reports';
      case 'settings':
        return 'Workspace Settings';
      default:
        return 'Workspace Console';
    }
  };

  const notificationList = [
    { id: 1, title: 'Engagement Alert', desc: 'Slight engagement drop on Instagram. Ask the Advisor.', time: '10m ago' },
    { id: 2, title: 'Schedule Success', desc: 'Scheduled Reel published successfully to Instagram.', time: '1h ago' }
  ];

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-neutral-950 font-sans z-25 sticky top-0 select-none">
      
      {/* Left: Workspace Selector & View Title */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
          >
            <span>{selectedWorkspace}</span>
            <FiChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute left-0 mt-2 w-56 bg-neutral-900 rounded-xl shadow-xl py-1.5 z-40">
              {['Acme Workspace (Default)', 'Sandbox Workspace', 'Indie Growth Team'].map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    setSelectedWorkspace(ws);
                    setShowWorkspaceMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-850 hover:text-white"
                >
                  {ws}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-neutral-900 hidden sm:block"></div>
        <h2 className="text-sm font-extrabold text-neutral-450 uppercase tracking-wider hidden sm:block">
          {getTitle()}
        </h2>
      </div>

      {/* Middle/Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Search simulation */}
        <div className="relative max-w-[180px] md:max-w-[240px] hidden md:block">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-3.5 h-3.5" />
          <input 
            type="text" 
            placeholder="Search workspace..."
            className="w-full bg-neutral-900 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white placeholder-neutral-600 focus:outline-none focus:bg-neutral-850 transition-colors"
          />
        </div>

        {/* Sync trigger */}
        <button
          onClick={syncData}
          disabled={isSyncing}
          className={`flex items-center justify-center p-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-neutral-300 transition-all ${
            isSyncing ? 'cursor-wait text-neutral-500' : ''
          }`}
          title="Sync workspace metrics"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>

        {/* Notifications badge */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-neutral-300 relative"
          >
            <FiBell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-neutral-900 rounded-xl shadow-xl py-3 z-40 px-4 space-y-3">
              <h4 className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Workspace Alerts</h4>
              <div className="divide-y divide-neutral-850">
                {notificationList.map(n => (
                  <div key={n.id} className="py-2.5 space-y-1 border-neutral-850">
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>{n.title}</span>
                      <span className="text-[9px] text-neutral-500 font-medium">{n.time}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-normal">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Platform connections status pills */}
        <div className="flex gap-2 items-center text-[9px] font-bold text-neutral-500 tracking-wide uppercase">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900">
            <span className={`w-1.5 h-1.5 rounded-full ${ollamaConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            <span className="hidden md:inline">Ollama</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900">
            <span className={`w-1.5 h-1.5 rounded-full ${instagramConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            <span className="hidden md:inline">{instagramConnected ? `@${username}` : 'Instagram'}</span>
          </div>
        </div>

        {/* User profile dropdown selector */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-900 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">
              S
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-900 rounded-xl shadow-xl py-1.5 z-40">
              <div className="px-4 py-2 border-b border-neutral-850">
                <span className="text-xs font-bold text-white block">Saugat Shahi</span>
                <span className="text-[10px] text-neutral-500 block">Role: Owner / Admin</span>
              </div>
              <button 
                onClick={() => {
                  alert('GrowthOS Workspace logout simulated.');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-neutral-800 hover:text-red-300"
              >
                Logout Account
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
