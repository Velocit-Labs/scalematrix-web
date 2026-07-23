import React, { useState, useEffect, useRef } from 'react';
import {
  FiCpu,
  FiSend,
  FiLoader,
  FiAlertCircle,
  FiMessageSquare,
  FiChevronRight,
  FiZap,
  FiPlusCircle,
  FiEye,
  FiHeart,
  FiMessageCircle,
} from 'react-icons/fi';

const PROMPT_SUGGESTIONS = [
  "Write a viral Instagram reel about sustainable fashion trends",
  "Create a LinkedIn post on scaling a startup from 0 to 1000 users",
  "Draft a Twitter thread on AI tools that replaced my entire workflow",
  "Write a hook for a short-form video about morning productivity habits",
  "Create a carousel post breaking down our product launch results",
  "Draft a behind-the-scenes story on how we built our remote team",
  "Write engaging post about the biggest mistake founders make",
  "Create a reel script comparing our product to the competition",
];

const FEATURE_CARDS = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: "Analytics",
    title: "Run Analytics. Increase Engagement",
    description: "Understand and double down on high-performing content.",
    buttonLabel: "Analyze Post",
    buttonView: "analytics",
    stats: { reach: "24.5k", likes: "1.2k", comments: "143" },
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    badge: "AI Models",
    title: "Switch between models.",
    description:
      "Experiment with different AI models to generate content variants.",
    buttonLabel: "Try Models",
    buttonView: "studio",
    stats: { reach: "82.1k", likes: "4.8k", comments: "392" },
  },
];

function PromptBox({ setActiveView, setTopicForScript }) {
  const [prompt, setPrompt] = useState("");
  const [idx, setIdx] = useState(0);

  const shuffle = () => {
    const next = (idx + 1) % PROMPT_SUGGESTIONS.length;
    setIdx(next);
    setPrompt(PROMPT_SUGGESTIONS[next]);
  };

  const generate = () => {
    if (!prompt.trim()) return;
    setTopicForScript(prompt.trim());
    setActiveView("studio");
  };

  return (
    <div
      className="w-full max-w-2xl rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Input row */}
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && generate()}
        placeholder="Ask anything you can possibly think of"
        className="w-full bg-transparent text-[14px] text-white placeholder-neutral-500 focus:outline-none leading-relaxed"
      />

      {/* Actions row */}
      <div className="flex items-center justify-between">
        {/* Left: Upload */}
        <label
          title="Upload media"
          className="w-8 h-8 rounded-full bg-neutral-600 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
        >
          <input type="file" accept="image/*,video/*" className="hidden" />
          <FiPlusCircle className="w-3.5 h-3.5" />
        </label>

        {/* Right: Shuffle + Generate */}
        <div className="flex items-center gap-2">
          {/* Shuffle / autoprompt */}
          <button
            type="button"
            onClick={shuffle}
            title="Suggest a prompt"
            className="w-8 h-8 rounded-full bg-neutral-600 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
            </svg>
          </button>

          {/* Generate */}
          <button
            type="button"
            onClick={generate}
            disabled={!prompt.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: prompt.trim()
                ? "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
                : "rgba(124,58,237,0.3)",
            }}
          >
            <FiZap className="w-3.5 h-3.5" />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Advisor({ settings, metrics, setActiveView, setTopicForScript }) {
  const [messages, setMessages] = useState([
    {
      id: 'init_1',
      sender: 'ai',
      message: 'Hello! I am your GrowthOS Strategy Advisor. I have analyzed your workspace metrics. How can I help you grow your brand presence today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (msgText) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim()) return;

    setErrorMsg('');
    if (!msgText) {
      setInputMessage('');
    }

    const userMsg = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      message: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsSending(false);

    // Removed API call
  };

  const handleSuggestion = (promptText) => {
    handleSendMessage(promptText);
  };

  return (
    <div className="flex-1 bg-neutral-950 text-neutral-200 overflow-y-auto font-sans relative flex flex-col h-full">
      {/* Ambient glow in background */}
      <div
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 28%, rgba(124,58,237,0.28) 0%, rgba(10,10,10,0.02) 60%, transparent 100%)",
        }}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-8 pt-9 pb-4 border-b border-neutral-900/60 flex-shrink-0 z-10 relative">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-500">
            GrowthOS AI
          </span>
          <FiChevronRight className="w-3.5 h-3.5 text-neutral-700" />
          <span className="text-sm font-semibold text-white">
            AI Strategy Advisor
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-semibold bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-850/60">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          Grounded on custom workspace metrics
        </div>
      </div>

      {/* Spacious Main Content Body */}
      <main className="px-12 py-6 lg:px-20 relative z-10 flex-1">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Hero Prompt Section */}
          <div className="relative px-8 pt-4 pb-6 flex flex-col items-center gap-6">
            {/* Headline */}
            <h1 className="text-3xl font-semibold text-white text-center tracking-tight leading-tight max-w-lg">
              Grow your brand like{" "}
              <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                never before
              </span>
            </h1>

            {/* Prompt box */}
            <PromptBox
              setActiveView={setActiveView}
              setTopicForScript={setTopicForScript}
            />
          </div>

          {/* ── Feature Showcase Section ── */}
          <div className="space-y-8 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  What GrowthOS can do
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Powerful tools to create, analyze, and optimize your social
                  media presence.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FEATURE_CARDS.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setActiveView(card.buttonView)}
                  className="relative h-56 rounded-3xl overflow-hidden group cursor-pointer border border-neutral-900 bg-neutral-950"
                >
                  {/* Image */}
                  <img
                    src={card.imageUrl}
                    alt={card.badge}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Dark overlay for text readability */}
                  <div
                    className="absolute inset-0 z-10"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.10) 100%)",
                    }}
                  />

                  {/* Top Badge Tag */}
                  <div className="absolute top-4 left-4 bg-purple-500 text-white text-[9px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full z-20">
                    {card.badge}
                  </div>

                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 z-20">
                    {/* Spacer to push text down */}
                    <div className="h-20" />

                    {/* Text block */}
                    <div className="space-y-1 max-w-md">
                      <h4 className="text-[15px] font-medium text-white leading-tight">
                        {card.title}
                      </h4>
                      <p className="text-[13px] text-neutral-400 leading-relaxed line-clamp-2">
                        {card.description}
                      </p>
                    </div>

                    {/* Actions and Metrics Row */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveView(card.buttonView);
                        }}
                        className="px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 text-[12px] font-medium transition-all"
                      >
                        {card.buttonLabel}
                      </button>

                      {/* Metrics on Right */}
                      <div className="flex items-center gap-3.5 text-neutral-400 text-[10px] font-bold">
                        <span
                          className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                          title="Reach"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          {card.stats.reach}
                        </span>
                        <span
                          className="flex items-center gap-1 hover:text-red-400 transition-colors"
                          title="Likes"
                        >
                          <FiHeart className="w-3.5 h-3.5" />
                          {card.stats.likes}
                        </span>
                        <span
                          className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                          title="Comments"
                        >
                          <FiMessageCircle className="w-3.5 h-3.5" />
                          {card.stats.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Explore All Features Pill ── */}
          <div className="pt-4 pb-10 flex justify-center">
            <button
              onClick={() => setActiveView("studio")}
              className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Stacked thumbnails */}
              <div className="relative flex-shrink-0 w-10 h-8">
                {FEATURE_CARDS.slice(0, 2).map((c, i) => (
                  <img
                    key={c.id}
                    src={c.imageUrl}
                    alt=""
                    className="absolute w-8 h-8 rounded-lg object-cover border-2 border-neutral-900"
                    style={{
                      left: `${i * 10}px`,
                      zIndex: 2 - i,
                    }}
                  />
                ))}
              </div>

              {/* Label */}
              <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors whitespace-nowrap">
                Explore all features
              </span>

              {/* Chevron */}
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-neutral-550 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdvisorMarkdownViewer({ content }) {
  if (!content) return null;
  const lines = content.split('\n');
  const rendered = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      rendered.push(
        <h6 key={idx} className="text-xs font-bold text-white mt-3 mb-1" >
          {trimmed.slice(4)}
        </h6>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const parsed = trimmed.slice(2)
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      rendered.push(
        <li key={idx} className="list-disc ml-4 mb-1 text-[11px] text-neutral-300" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    } else if (trimmed !== '') {
      const parsed = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      rendered.push(
        <p key={idx} className="mb-2 text-[11px] text-neutral-350" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    }
  });

  return <div className="space-y-0.5">{rendered}</div>;
}
