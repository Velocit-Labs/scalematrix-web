import React, { useState, useEffect } from 'react';
import { FiLayers, FiAlertCircle, FiCheckCircle, FiLoader, FiRefreshCw, FiTrendingUp } from 'react-icons/fi';

export default function Audit({ settings }) {
  const [onboardingProfile, setOnboardingProfile] = useState(null);
  const [auditReport, setAuditReport] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState('');

  // Load from localStorage
  useEffect(() => {
    const profileStr = localStorage.getItem('scalematrix_profile');
    const auditStr = localStorage.getItem('scalematrix_audit');
    if (profileStr) {
      setOnboardingProfile(JSON.parse(profileStr));
    }
    if (auditStr) {
      setAuditReport(auditStr);
    }
  }, []);

  const triggerAudit = async () => {
    if (!onboardingProfile) {
      setAuditError('No onboarding profile found. Please configure settings first.');
      return;
    }

    setIsAuditing(false);
    setAuditError('');
    // Removed API call
  };

  // Safe extract score
  const getHealthScore = () => {
    if (!auditReport) return 65; // default fallback
    const scoreMatch = auditReport.match(/(\d+)\s*\/\s*100/) || auditReport.match(/Score:\s*(\d+)/i) || auditReport.match(/Health Score:\s*(\d+)/i);
    if (scoreMatch) {
      return parseInt(scoreMatch[1], 10);
    }
    const generalMatch = auditReport.match(/health[\s\S]{0,30}(\d{2})/i);
    return generalMatch ? parseInt(generalMatch[1], 10) : 75;
  };

  const healthScore = getHealthScore();

  return (
    <div className="flex-1 p-8 bg-neutral-950 text-neutral-200 overflow-y-auto font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Summary Header (borderless) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-neutral-900 p-6 rounded-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-400">
              <FiLayers className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Social Presence Audit</span>
            </div>
            <h3 className="text-sm font-extrabold text-white">Workspace Health Diagnostics</h3>
            <p className="text-xs text-neutral-400">
              Comprehensive audit of posting consistency, content pillars, and competitor alignment.
            </p>
          </div>
          <button
            onClick={triggerAudit}
            disabled={isAuditing || !onboardingProfile}
            className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <FiLoader className="w-3.5 h-3.5 animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                <FiRefreshCw className="w-3.5 h-3.5" />
                Re-Run Audit
              </>
            )}
          </button>
        </div>

        {/* Health Meter & Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Health Score Gauge (borderless) */}
          <div className="bg-neutral-900 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Presence Health Score</span>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="#262626"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="#a855f7"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - healthScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">{healthScore}</span>
                <span className="text-[9px] text-neutral-500 font-bold">OUT OF 100</span>
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed px-4">
              Your score ranks {healthScore > 80 ? 'Excellent' : healthScore > 60 ? 'Moderate' : 'Needs Optimization'} compared to target sector averages.
            </p>
          </div>

          {/* Consistency Checklist (borderless) */}
          <div className="bg-neutral-900 p-6 rounded-2xl col-span-2 space-y-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Consistency Checklist</span>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-white">Instagram Connection</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-white">Brand Voice Definition</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-bold">{onboardingProfile?.brandVoice || 'Defined'}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-white">Instagram Posting Frequency</span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold">2/wk (Goal: 5)</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-white">Competitor Benchmarking</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-bold">Needs SWOT Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Details (borderless) */}
        <div className="bg-neutral-900 rounded-3xl shadow-md overflow-hidden">
          <div className="px-8 py-4 bg-neutral-900">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Detailed AI Analysis Report</span>
          </div>

          {auditError && (
            <div className="m-6 p-4 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
              <FiAlertCircle className="w-4.5 h-4.5" />
              <span>{auditError}</span>
            </div>
          )}

          <div className="p-8">
            {isAuditing ? (
              <div className="p-12 text-center space-y-3">
                <FiLoader className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                <p className="text-xs text-neutral-500">Consulting Presence Audit Agent...</p>
              </div>
            ) : auditReport ? (
              <div className="prose prose-invert max-w-none text-xs text-neutral-300 leading-relaxed font-mono">
                <AuditMarkdownViewer content={auditReport} />
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs text-neutral-500">No report loaded.</p>
                <button
                  onClick={triggerAudit}
                  className="py-1.5 px-3 bg-neutral-950 text-xs font-bold rounded-lg text-white hover:bg-neutral-800"
                >
                  Generate Now
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function AuditMarkdownViewer({ content }) {
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
