import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiInstagram } from 'react-icons/fi';

export default function Settings({ 
  settings, 
  setSettings, 
  instagramConnected, 
  username, 
  authError,
  connectInstagram, 
  disconnectInstagram, 
  isConnecting
}) {
  const [showKey, setShowKey] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(settings.composioApiKey || '');
  const [localOllamaUrl, setLocalOllamaUrl] = useState(settings.ollamaUrl || 'http://localhost:11434');
  const [localOllamaModel, setLocalOllamaModel] = useState(settings.ollamaModel || 'llama3.1');

  const handleSave = (e) => {
    e.preventDefault();
    setSettings({
      composioApiKey: localApiKey,
      ollamaUrl: localOllamaUrl,
      ollamaModel: localOllamaModel
    });
    alert('Settings saved locally and synced with backend!');
  };

  return (
    <div className="flex-1 p-10 bg-neutral-950 text-neutral-200 overflow-y-auto font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Connection status card */}
        <div className="bg-neutral-900/60 rounded-3xl p-8 border border-neutral-800 backdrop-blur-md shadow-md">
          <h3 className="text-lg font-bold text-white mb-2">Instagram Integration Status</h3>
          <p className="text-neutral-400 text-sm mb-6">
            Connecting your Instagram account via Composio allows the AI model to fetch your actual metrics, comments, and post history for tailored growth advice.
          </p>

          {instagramConnected ? (
            <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white shadow-md text-lg">
                  {username ? username[0].toUpperCase() : 'I'}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    @{username || 'instagram_user'}
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">Connected via Composio OAuth</div>
                </div>
              </div>
              <button
                onClick={disconnectInstagram}
                className="py-2.5 px-5 rounded-xl text-xs font-bold transition-all duration-300 border bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white"
              >
                Disconnect Account
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 text-center">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <FiInstagram className="w-6 h-6 text-neutral-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">No Instagram Account Connected</h4>
              <p className="text-neutral-500 text-xs max-w-sm mx-auto mb-5 leading-relaxed">
                Connect your business/creator page to fetch media feeds and analytics.
              </p>
              
              <button
                onClick={connectInstagram}
                disabled={isConnecting}
                className={`py-3 px-6 rounded-xl text-xs font-bold transition-all duration-300 shadow-md ${
                  isConnecting
                    ? 'bg-purple-900/40 text-purple-400 border border-purple-800/50 cursor-wait'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {isConnecting ? 'Redirecting to OAuth...' : 'Connect Instagram Account'}
              </button>

              {authError && (
                <div className="mt-4 text-xs font-semibold text-red-400 bg-red-950/20 border border-red-500/20 rounded-xl p-3 max-w-lg mx-auto">
                  ⚠️ {authError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Configuration settings form */}
        <div className="bg-neutral-900/60 rounded-3xl p-8 border border-neutral-800 backdrop-blur-md shadow-md">
          <h3 className="text-lg font-bold text-white mb-6">Local LLM & Integration Configuration</h3>
          
          <form onSubmit={handleSave} className="space-y-6">
            {/* Composio API Key */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Composio API Key</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  placeholder="Enter your Composio API Key (e.g. comp_...)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showKey ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <span className="block text-[10px] text-neutral-500 leading-normal">
                Your key is stored safely in your browser's local storage and is only sent to your local server. Get yours at <a href="https://composio.dev" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">composio.dev</a>.
              </span>
            </div>

            {/* Ollama configurations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ollama URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Ollama API URL</label>
                <input
                  type="text"
                  value={localOllamaUrl}
                  onChange={(e) => setLocalOllamaUrl(e.target.value)}
                  placeholder="e.g. http://localhost:11434"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all duration-300"
                />
                <span className="block text-[10px] text-neutral-500">
                  Standard endpoint for local Ollama deployments.
                </span>
              </div>

              {/* Ollama Model */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Ollama Model</label>
                <input
                  type="text"
                  value={localOllamaModel}
                  onChange={(e) => setLocalOllamaModel(e.target.value)}
                  placeholder="e.g. llama3.1"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all duration-300"
                />
                <span className="block text-[10px] text-neutral-500">
                  Must match the pulled model name. Recommend <code>llama3.1</code>.
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 transition-all duration-300 shadow-md"
            >
              Save Configuration
            </button>
          </form>
        </div>

        {/* Prerequisites guide */}
        <div className="bg-neutral-900/40 rounded-3xl p-8 border border-neutral-850">
          <h4 className="text-sm font-bold text-white mb-3">Setup Checklist</h4>
          <ul className="space-y-2.5 text-xs text-neutral-400 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="text-purple-400 font-bold">1.</span>
              <span>Install and start <strong>Ollama</strong> on your local machine.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-purple-400 font-bold">2.</span>
              <span>Pull the model from your command line: <code className="bg-neutral-900 py-0.5 px-1.5 rounded text-neutral-300 border border-neutral-800">ollama pull llama3.1</code></span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-purple-400 font-bold">3.</span>
              <span>For real connections, verify your Instagram account is set to **Business** or **Creator** mode and linked to a Facebook Page (Instagram constraint).</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
