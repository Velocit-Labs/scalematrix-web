import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTarget, FiEdit3, FiLoader, FiRefreshCw, FiBookOpen, FiSave } from 'react-icons/fi';

export default function Strategy({ settings }) {
  const [profile, setProfile] = useState(null);
  const [strategyReport, setStrategyReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableReport, setEditableReport] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load profile and saved strategy
  useEffect(() => {
    const profileStr = localStorage.getItem('scalematrix_profile');
    const strategyStr = localStorage.getItem('scalematrix_strategy');
    if (profileStr) {
      setProfile(JSON.parse(profileStr));
    }
    if (strategyStr) {
      setStrategyReport(strategyStr);
      setEditableReport(strategyStr);
    }
  }, []);

  const generateStrategy = async () => {
    if (!profile) {
      setErrorMsg('Please complete onboarding setup first.');
      return;
    }
    setIsGenerating(false);
    setErrorMsg('');
    // Removed API call
  };

  const handleSave = () => {
    setStrategyReport(editableReport);
    localStorage.setItem('scalematrix_strategy', editableReport);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 p-8 bg-neutral-950 text-neutral-200 overflow-y-auto font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header bar (borderless) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-neutral-900 p-6 rounded-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-400">
              <FiTarget className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Strategy & Roadmap</span>
            </div>
            <h3 className="text-sm font-extrabold text-white">Brand Growth Pillars</h3>
            <p className="text-xs text-neutral-400">
              Review brand positioning targets, OKRs, and weekly themes.
            </p>
          </div>
          <div className="flex gap-3">
            {strategyReport && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="py-2 px-3 bg-neutral-950 text-xs font-bold rounded-xl text-neutral-300 hover:text-white flex items-center gap-1.5"
              >
                <FiEdit3 className="w-3.5 h-3.5" />
                Edit Plan
              </button>
            )}
            <button
              onClick={generateStrategy}
              disabled={isGenerating || !profile}
              className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <FiLoader className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FiRefreshCw className="w-3.5 h-3.5" />
                  {strategyReport ? 'Re-Generate' : 'Initialize Strategy'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick OKR Tracker Panel (borderless) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 p-5 rounded-2xl space-y-2">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Audience Reach Goal</span>
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-extrabold text-white">50,000 / mo</span>
              <span className="text-[10px] text-purple-400 font-bold">97% achieved</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: '97%' }} />
            </div>
          </div>

          <div className="bg-neutral-900 p-5 rounded-2xl space-y-2">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Content Velocity Goal</span>
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-extrabold text-white">12 posts / mo</span>
              <span className="text-[10px] text-amber-500 font-bold">58% achieved</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '58%' }} />
            </div>
          </div>

          <div className="bg-neutral-900 p-5 rounded-2xl space-y-2">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Avg Engagement Target</span>
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-extrabold text-white">5.5% avg</span>
              <span className="text-[10px] text-emerald-400 font-bold">112% achieved</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Strategy Document (borderless) */}
        <div className="bg-neutral-900 rounded-3xl shadow-md overflow-hidden">
          <div className="px-8 py-4 bg-neutral-900 flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Workspace Growth Charter</span>
            {isEditing && (
              <button
                onClick={handleSave}
                className="py-1 px-3 bg-purple-600 hover:bg-purple-500 text-xs font-bold rounded-lg text-white flex items-center gap-1.5"
              >
                <FiSave className="w-3.5 h-3.5" />
                Save Changes
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="m-6 p-4 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
              <FiAlertCircle className="w-4.5 h-4.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-8">
            {isGenerating ? (
              <div className="p-12 text-center space-y-3">
                <FiLoader className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                <p className="text-xs text-neutral-500">Drafting Growth Pillars with Strategy Agent...</p>
              </div>
            ) : isEditing ? (
              <textarea
                value={editableReport}
                onChange={(e) => setEditableReport(e.target.value)}
                rows={20}
                className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl p-5 text-xs text-neutral-200 font-mono focus:outline-none focus:bg-neutral-900 resize-none leading-relaxed"
              />
            ) : strategyReport ? (
              <div className="prose prose-invert max-w-none text-xs text-neutral-300 leading-relaxed font-mono">
                <StrategyMarkdownViewer content={strategyReport} />
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <FiBookOpen className="w-10 h-10 text-neutral-700 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Growth Strategy Configured</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Click the button above to run the Strategy Agent. It will analyze your niche details and output quarterly plans.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function StrategyMarkdownViewer({ content }) {
  if (!content) return null;
  const lines = content.split('\n');
  const rendered = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      rendered.push(
        <h5 key={idx} className="text-xs font-bold text-white mt-5 mb-2 border-b border-neutral-850 pb-1" >
          {trimmed.slice(4)}
        </h5>
      );
    } else if (trimmed.startsWith('## ')) {
      rendered.push(
        <h4 key={idx} className="text-sm font-bold text-purple-400 mt-6 mb-3 border-l-2 border-purple-500 pl-2" >
          {trimmed.slice(3)}
        </h4>
      );
    } else if (trimmed.startsWith('# ')) {
      rendered.push(
        <h3 key={idx} className="text-base font-extrabold text-white mt-8 mb-4 pb-1 border-b border-neutral-800" >
          {trimmed.slice(2)}
        </h3>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const parsed = trimmed.slice(2)
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(/`(.*?)`/g, '<code class="bg-neutral-950 py-0.5 px-1 rounded text-purple-400 font-mono text-[10px]">$1</code>');
      rendered.push(
        <li key={idx} className="list-disc ml-4 mb-2" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    } else if (trimmed !== '') {
      const parsed = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(/`(.*?)`/g, '<code class="bg-neutral-950 py-0.5 px-1 rounded text-purple-400 font-mono text-[10px]">$1</code>');
      rendered.push(
        <p key={idx} className="mb-3" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    }
  });

  return <div className="space-y-1">{rendered}</div>;
}
