import React, { useState, useEffect } from 'react';
import { FiUsers, FiLoader, FiAlertTriangle, FiPlus, FiArrowUpRight, FiZap, FiRefreshCw, FiTrendingUp } from 'react-icons/fi';

export default function Competitors({ settings }) {
  const [profile, setProfile] = useState(null);
  const [swotReport, setSwotReport] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Default mock list
  const [competitorList, setCompetitorList] = useState([
    { name: '@stripe_dev', platform: 'instagram', followers: 235000, frequency: '5/wk', engagement: '6.8%', format: 'Code Snippets' },
    { name: '@vercel', platform: 'instagram', followers: 489000, frequency: '12/wk', engagement: '4.2%', format: 'Video Demos' },
    { name: '@notionhq', platform: 'instagram', followers: 612000, frequency: '3/wk', engagement: '5.1%', format: 'Carousels' }
  ]);
  const [newCompetitor, setNewCompetitor] = useState('');

  useEffect(() => {
    const profileStr = localStorage.getItem('scalematrix_profile');
    const swotStr = localStorage.getItem('scalematrix_swot');
    if (profileStr) {
      const p = JSON.parse(profileStr);
      setProfile(p);
      if (p.competitors) {
        const list = p.competitors.split(',').map((c, idx) => {
          const name = c.trim();
          return {
            name: name.startsWith('@') ? name : `@${name}`,
            platform: 'instagram',
            followers: 12000 + Math.floor(Math.random() * 80000),
            frequency: '3/wk',
            engagement: '4.5%',
            format: 'Visual Posts'
          };
        });
        setCompetitorList(list);
      }
    }
    if (swotStr) {
      setSwotReport(swotStr);
    }
  }, []);

  const addCompetitor = (e) => {
    e.preventDefault();
    if (!newCompetitor.trim()) return;
    const name = newCompetitor.trim();
    setCompetitorList(prev => [
      ...prev,
      {
        name: name.startsWith('@') ? name : `@${name}`,
        platform: 'instagram',
        followers: 15000,
        frequency: '2/wk',
        engagement: '3.8%',
        format: 'Unspecified'
      }
    ]);
    setNewCompetitor('');
  };

  const runSwotAnalysis = async () => {
    setIsAnalyzing(false);
    setErrorMsg('');
  };

  return (
    <div className="flex-1 bg-neutral-950 p-8 text-neutral-200 overflow-y-auto font-sans flex flex-col space-y-6">
      
      {/* Top Header (borderless) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-neutral-900 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400">
            <FiUsers className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Competitor Intelligence</span>
          </div>
          <h3 className="text-sm font-extrabold text-white">Market Positioning Gaps</h3>
          <p className="text-xs text-neutral-400">
            Audit competitor posting channels and leverage SWOT matrices to capture content opportunities.
          </p>
        </div>
        <button
          onClick={runSwotAnalysis}
          disabled={isAnalyzing || competitorList.length === 0}
          className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <FiLoader className="w-3.5 h-3.5 animate-spin" />
              Scanning SWOT...
            </>
          ) : (
            <>
              <FiRefreshCw className="w-3.5 h-3.5" />
              Generate SWOT Map
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Competitor Track List & Add form (borderless) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 rounded-3xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-neutral-900 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Tracked Competitors Matrix</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-900/60 text-neutral-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-6">Competitor Account</th>
                    <th className="py-3 px-6">Platform</th>
                    <th className="py-3 px-6">Audience Size</th>
                    <th className="py-3 px-6">Posting Rate</th>
                    <th className="py-3 px-6">Avg Engagement</th>
                    <th className="py-3 px-6">Top Format</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-950">
                  {competitorList.map(comp => (
                    <tr key={comp.name} className="hover:bg-neutral-950/20 text-neutral-300 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-white">{comp.name}</td>
                      <td className="py-3.5 px-6 capitalize">{comp.platform}</td>
                      <td className="py-3.5 px-6">{comp.followers.toLocaleString()}</td>
                      <td className="py-3.5 px-6 font-mono text-[10px]">{comp.frequency}</td>
                      <td className="py-3.5 px-6 font-mono text-[10px] text-purple-400">{comp.engagement}</td>
                      <td className="py-3.5 px-6">
                        <span className="px-2 py-0.5 rounded bg-neutral-950 text-[9px] font-bold text-neutral-400">
                          {comp.format}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Competitor */}
          <form onSubmit={addCompetitor} className="flex flex-col sm:flex-row items-end gap-4 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800/50">
            <div className="space-y-2 flex-1 w-full">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Instagram Competitor Handle</label>
              <input
                type="text"
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                placeholder="e.g. @stripe"
                className="w-full bg-neutral-950 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:bg-neutral-900 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 transition-colors h-[34px] sm:h-auto"
            >
              <FiPlus className="w-4 h-4" />
              Add Handle
            </button>
          </form>
        </div>

        {/* Right: AI Market Gap SWOT Analysis report */}
        <div className="bg-neutral-900 p-6 rounded-3xl h-full flex flex-col justify-between space-y-4">
          <div className="space-y-4 flex-1 flex flex-col">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <FiZap className="w-4 h-4 text-purple-400" />
              AI SWOT Diagnostics
            </h4>
            
            {errorMsg && (
              <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl text-[10px] flex items-start gap-1.5">
                <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-12 bg-neutral-950/20 rounded-2xl">
                <FiLoader className="w-6 h-6 text-purple-500 animate-spin" />
                <span className="text-[10px] text-neutral-500 font-mono">Comparing frequencies and mapping SWOT gaps...</span>
              </div>
            ) : swotReport ? (
              <div className="bg-neutral-950 p-4 rounded-2xl text-[10px] text-neutral-300 font-mono space-y-2 overflow-y-auto leading-relaxed flex-1 max-h-[380px]">
                <SWOTMarkdownViewer content={swotReport} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-neutral-950/20">
                <FiUsers className="w-8 h-8 text-neutral-750 mb-2" />
                <p className="text-[10px] text-neutral-500 leading-normal">
                  Generate competitor matrix report highlighting market entry opportunities.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

function SWOTMarkdownViewer({ content }) {
  if (!content) return null;
  const lines = content.split('\n');
  const rendered = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      rendered.push(
        <h6 key={idx} className="text-[10px] font-bold text-white mt-3 mb-1" >
          {trimmed.slice(4)}
        </h6>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const parsed = trimmed.slice(2)
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      rendered.push(
        <li key={idx} className="list-disc ml-3 mb-1 text-[10px]" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    } else if (trimmed !== '') {
      const parsed = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      rendered.push(
        <p key={idx} className="mb-2 text-[10px]" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    }
  });

  return <div className="space-y-0.5">{rendered}</div>;
}
