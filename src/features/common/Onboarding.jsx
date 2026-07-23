import React, { useState, useRef, useEffect } from 'react';
import { 
  FiBriefcase, 
  FiLoader, 
  FiZap, 
  FiArrowRight 
} from 'react-icons/fi';
import AuthModal from './AuthModal';
import { apiCall } from '../../shared/utils/api';

const defaultPersonaSuggestions = [
  'Decision Makers (CEOs/Managers)',
  'Industry Professionals',
  'End Consumers (DTC Buyers)',
  'Freelancers & Solopreneurs',
  'Tech-savvy Early Adopters',
  'Small Business Owners'
];

const defaultGoalSuggestions = [
  'Scale organic brand reach & views',
  'Generate leads & book demo calls',
  'Build email newsletter list',
  'Boost community engagement',
  'Promote new product launch',
  'Improve customer retention',
  'Drive website traffic',
  'Establish thought leadership',
  'Grow social media following',
  'Launch affiliate / referral program',
  'Increase e-commerce conversions',
  'Build brand awareness & credibility'
];

export default function Onboarding({ 
  onComplete, 
  settings, 
  connectInstagram, 
  isConnecting, 
  instagramConnected, 
  username 
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  
  // Setup Wizard Steps (1: Profile, 2: Goals)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Interactive tag lists pre-seeded with standard high-value defaults
  const [selectedPersonas, setSelectedPersonas] = useState([
    'Decision Makers (CEOs/Managers)',
    'Industry Professionals',
    'End Consumers (DTC Buyers)'
  ]);
  const [newPersonaInput, setNewPersonaInput] = useState('');

  const [selectedGoals, setSelectedGoals] = useState([
    'Scale organic brand reach & views',
    'Generate leads & book demo calls'
  ]);

  const [personasFocused, setPersonasFocused] = useState(false);
  const personasContainerRef = useRef(null);

  useEffect(() => {
    if (personasContainerRef.current) {
      const el = personasContainerRef.current;
      setTimeout(() => {
        el.scrollLeft = el.scrollWidth;
      }, 0);
    }
  }, [selectedPersonas]);

  // Add & Remove handlers for audience persona tags
  const handleAddPersona = () => {
    if (!newPersonaInput.trim()) return;
    const clean = newPersonaInput.trim();
    if (!selectedPersonas.includes(clean)) {
      setSelectedPersonas(prev => [...prev, clean]);
    }
    setNewPersonaInput('');
  };

  const handleRemovePersona = (tag) => {
    setSelectedPersonas(prev => prev.filter(t => t !== tag));
  };

  // Save profile and launch workspace
  const launchWorkspace = async () => {
    const activeNiche = industry === 'Other' ? customIndustry : industry;
    const payload = {
      businessName,
      industry: activeNiche,
      customIndustry: industry === 'Other' ? customIndustry : '',
      targetAudience: selectedPersonas,
      businessGoals: selectedGoals,
    };

    setLoading(true);
    try {
      await apiCall('/onboarding/complete', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Backend onboarding complete sync error, saving locally:', err.message);
    } finally {
      localStorage.setItem('scalematrix_onboarded', 'true');
      localStorage.setItem('scalematrix_profile', JSON.stringify(payload));
      setLoading(false);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans select-none overflow-y-auto">
      
      {/* 1. Decoupled Authentication Modal */}
      {!authenticated ? (
        <AuthModal onAuthenticated={(user) => setAuthenticated(true)} />
      ) : (
        /* 2. Business Workspace Setup Wizard */
        <div className="w-full max-w-xl bg-[#121214] rounded-3xl p-8 shadow-2xl space-y-6 my-4 border border-neutral-900">
          
          <div className="border-b border-neutral-900 pb-4">
            <h1 className="text-lg font-extrabold text-white tracking-tight">ScaleMatrix Workspace Setup</h1>
            <p className="text-neutral-500 text-xs mt-1">
              {step === 1 
                ? "Step 1 of 2: Let's identify your business profile & target audience." 
                : "Step 2 of 2: Define your core business growth goals."}
            </p>
          </div>

          <div className="space-y-5">
              {step === 1 ? (
                /* STEP 1: BUSINESS PROFILE & AUDIENCE */
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Business Name</label>
                    <input 
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Acme Tech"
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-xl py-3 px-4 text-xs text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-purple-600 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Select Industry / Niche</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'SaaS', 
                        'E-commerce', 
                        'Fitness', 
                        'Education', 
                        'Creator', 
                        'Real Estate', 
                        'Healthcare', 
                        'Travel', 
                        'Food & Beverage', 
                        'Finance', 
                        'Other'
                      ].map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setIndustry(preset)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            industry === preset 
                              ? 'bg-purple-600 text-white shadow-md' 
                              : 'bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {industry === 'Other' && (
                    <div className="space-y-2 pt-1 animate-fadeIn">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Enter Custom Niche</label>
                      <input 
                        type="text"
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        placeholder="e.g. Sustainable Fashion, AI Biotech"
                        className="w-full bg-neutral-950 border border-neutral-900 rounded-xl py-3 px-4 text-xs text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-purple-600 transition-all"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5 pt-2 border-t border-neutral-900">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Target Audience Personas</label>
                    
                    <div className="flex items-center gap-2 relative">
                      <div 
                        ref={personasContainerRef}
                        className="flex-1 bg-neutral-950 border border-neutral-900 rounded-xl px-3 flex items-center gap-1.5 overflow-x-auto h-[42px] focus-within:ring-1 focus-within:ring-purple-600 transition-all scrollbar-none"
                      >
                        {selectedPersonas.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 py-1 px-2.5 bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-white rounded-lg flex-shrink-0"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePersona(tag)}
                              className="text-neutral-500 hover:text-red-400 transition-colors font-bold cursor-pointer text-[10px] leading-none"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                        
                        <input
                          type="text"
                          value={newPersonaInput}
                          onChange={(e) => setNewPersonaInput(e.target.value)}
                          onFocus={() => setPersonasFocused(true)}
                          onBlur={() => {
                            setTimeout(() => setPersonasFocused(false), 200);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddPersona();
                            } else if (e.key === 'Backspace' && !newPersonaInput) {
                              if (selectedPersonas.length > 0) {
                                handleRemovePersona(selectedPersonas[selectedPersonas.length - 1]);
                              }
                            }
                          }}
                          placeholder={selectedPersonas.length > 0 ? "Type & press Enter..." : "Type persona & press Enter..."}
                          className="flex-1 min-w-[170px] bg-transparent border-none text-xs text-neutral-300 placeholder-neutral-700 focus:outline-none h-full py-2 pl-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-neutral-900">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!businessName.trim() || !industry.trim() || (industry === 'Other' && !customIndustry.trim()) || selectedPersonas.length === 0}
                      className="py-3.5 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-md w-full sm:w-auto justify-center cursor-pointer"
                    >
                      <span>Continue to Growth Goals</span>
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* STEP 2: BUSINESS GROWTH GOALS */
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Business Growth Goals</label>
                    <div className="flex flex-wrap gap-2">
                      {defaultGoalSuggestions.map(goal => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() =>
                            setSelectedGoals(prev =>
                              prev.includes(goal)
                                ? prev.filter(g => g !== goal)
                                : [...prev, goal]
                            )
                          }
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedGoals.includes(goal)
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-neutral-900 gap-3">
                    <button 
                      onClick={() => setStep(1)}
                      className="py-3 px-6 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded-xl text-xs font-bold transition-colors border border-neutral-900 inline-flex items-center gap-2 shadow-md justify-center cursor-pointer"
                    >
                      Back to details
                    </button>
                    <button 
                      onClick={launchWorkspace}
                      disabled={selectedGoals.length === 0 || loading}
                      className="py-3 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-md w-full sm:w-auto justify-center cursor-pointer"
                    >
                      {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <span>Launch ScaleMatrix Workspace</span>}
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

    </div>
  );
}
