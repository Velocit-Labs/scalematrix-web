import React, { useState, useRef, useEffect } from "react";
import {
  FiLoader,
  FiFileText,
  FiCopy,
  FiCheck,
  FiSend,
  FiPlay,
  FiLayout,
  FiChevronRight,
  FiZap,
  FiEdit3,
  FiRefreshCw,
  FiSearch,
  FiCalendar,
  FiChevronLeft,
  FiSliders,
  FiShare,
  FiThumbsUp,
  FiThumbsDown,
  FiShare2,
  FiTrash2,
  FiChevronDown,
  FiClock,
  FiRepeat,
  FiList,
  FiZap as FiBolt,
  FiToggleRight,
  FiBarChart2,
  FiUsers,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";

function PublishDrawer() {
  const [state, setState] = useState("collapsed");
  const drawerRef = useRef(null);

  const isExpanded = state === "expanded";
  const isHovered = state === "hovered";

  const sections = [
    {
      label: "Schedule",
      items: [
        { icon: FiCalendar, label: "Schedule post", badge: null },
        { icon: FiRepeat, label: "Recurring series", badge: null },
        { icon: FiClock, label: "Draft & save", badge: null },
      ],
    },
    {
      label: "Queue",
      items: [
        {
          icon: FiList,
          label: "Add to queue",
          badge: { text: "3", color: "purple" },
        },
        {
          icon: FiClock,
          label: "Best time AI",
          badge: { text: "ON", color: "green" },
        },
        { icon: FiSliders, label: "Queue manager", badge: null },
      ],
    },
    {
      label: "Automation",
      items: [
        { icon: FiBolt, label: "Auto-publish", badge: null },
        { icon: FiToggleRight, label: "Approval flow", badge: null },
        { icon: FiRepeat, label: "Content recycler", badge: null },
        { icon: FiAlertCircle, label: "Failure alerts", badge: null },
      ],
    },
    {
      label: "Analytics",
      items: [
        { icon: FiBarChart2, label: "Post performance", badge: null },
        { icon: FiUsers, label: "Audience insights", badge: null },
        {
          icon: FiShare2,
          label: "Multi-platform",
          badge: { text: "PRO", color: "purple" },
        },
      ],
    },
  ];

  const collapsedIcons = [FiCalendar, FiList, FiClock, FiBolt];

  return (
    <div
      ref={drawerRef}
      onMouseEnter={() => setState((s) => (s === "collapsed" ? "hovered" : s))}
      onMouseLeave={() => setState((s) => (s === "hovered" ? "collapsed" : s))}
      className={`
        sticky top-0 self-start h-screen flex-shrink-0 flex flex-col overflow-hidden z-10
        transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
        ${isExpanded ? "w-68" : isHovered ? "w-16" : "w-10"}
        ${isExpanded ? "bg-[#111111]" : "bg-[#111111] rounded-tl-3xl rounded-bl-3xl"}
      `}
    >
      {!isExpanded && (
        <div
          onClick={() => setState("expanded")}
          className="flex flex-col items-center justify-center h-full cursor-pointer group"
        >
          <FiChevronLeft className="w-6 h-6 text-neutral-500 group-hover:text-white transition-colors duration-200" />
        </div>
      )}

      {/* Expanded panel */}
      {isExpanded && (
        <div className="w-68 px-5 pt-8 pb-5 flex flex-col h-full overflow-y-auto bg-neutral-950 border-l border-l-neutral-800">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setState("collapsed")}
              className="p-1 text-neutral-500 hover:text-white flex items-center transition-colors"
            >
              <FiChevronRight className="w-5 h-5 cursor-pointer" />
            </button>
            <span className="text-sm font-semibold text-white">
              Publish Tools
            </span>
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <div key={section.label} className="mt-1">
              <div className="text-[10px] font-medium tracking-widest text-neutral-500 uppercase px-[18px] pt-5 pb-1.5">
                {section.label}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 px-[18px] py-2 cursor-pointer text-[13px] text-neutral-300 hover:text-white hover:bg-[#1a1a1a] transition-all duration-150"
                  >
                    <Icon className="w-3.5 h-3.5 text-neutral-300 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badge.color === "green"
                            ? "bg-emerald-950 text-emerald-400"
                            : "bg-violet-950/60 text-violet-400"
                        }`}
                      >
                        {item.badge.text}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Studio({
  topic,
  setTopic,
  generatedScript,
  setGeneratedScript,
  isGeneratingScript,
  triggerGenerateScript,
  settings,
  setSharedCaption,
  setSharedMediaUrl,
  setActiveView,
  scriptHistory = [],
  setScriptHistory,
  isSyncing,
  syncData,
}) {
  const [contentType, setContentType] = useState("video");
  const [tone, setTone] = useState("Conversational & Engaging");
  const [duration, setDuration] = useState("30-45 seconds");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(null);

  const [historySearch, setHistorySearch] = useState("");
  const [historyTypeFilter, setHistoryTypeFilter] = useState("all");
  const [historySort, setHistorySort] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [likedItems, setLikedItems] = useState({});
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 10);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target)
      )
        setShowSortDropdown(false);
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target)
      )
        setShowFilterDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [currentSubView, setCurrentSubView] = useState("script");
  const [expandedSlides, setExpandedSlides] = useState([]);

  const toggleExpanded = (slideNumber) => {
    setExpandedSlides((prev) =>
      prev.includes(slideNumber)
        ? prev.filter((n) => n !== slideNumber)
        : [...prev, slideNumber],
    );
  };

  const [lastGeneratedScript, setLastGeneratedScript] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleSelect = (id) =>
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentSubView("script");
    triggerGenerateScript({
      topic,
      format:
        contentType === "video"
          ? "Instagram Reel (Vertical Video)"
          : "Instagram Feed Image (Carousel Draft)",
      tone,
      duration,
      additionalNotes,
    }).then((res) => {
      if (generatedScript) {
        setLastGeneratedScript({
          topic,
          contentType,
          tone,
          duration,
          additionalNotes,
          script: generatedScript,
        });
      }
    });
  };

  React.useEffect(() => {
    if (generatedScript) {
      setCurrentSubView("script");
      setLastGeneratedScript({
        topic,
        contentType,
        tone,
        duration,
        additionalNotes,
        script: generatedScript,
      });
    }
  }, [generatedScript]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToPublisher = () => {
    let captionText = "";
    const captionMatch =
      generatedScript.match(/Caption Draft:[\s\S]*?(?=$)/i) ||
      generatedScript.match(
        /#### ✍️ 4. Optimized Instagram Caption & Hashtags[\s\S]*?(?=$)/i,
      ) ||
      generatedScript.match(/\* \*\*Caption Draft:\*\*[\s\S]*?(?=$)/i);

    if (captionMatch) {
      captionText = captionMatch[0]
        .replace(/#### ✍️ 4. Optimized Instagram Caption & Hashtags/i, "")
        .replace(/\* \*\*Caption Draft:\*\*/i, "")
        .trim();
    } else {
      captionText = `Script Topic: ${topic}\n\n${generatedScript}`;
    }

    setSharedCaption(captionText);
    setSharedMediaUrl(
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    );
    setActiveView("publishing");
  };

  const getCarouselSlides = () => {
    if (!generatedScript || contentType !== "carousel") return [];
    const slides = [];
    const sections = generatedScript.split(/Slide \d/i);
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];
      const titleMatch =
        section.match(/\*\*Title\*\*:\s*([^\n]+)/i) ||
        section.match(/\*\*Text\*\*:\s*([^\n]+)/i) ||
        section.match(/:\s*([^\n]+)/);
      const title = titleMatch ? titleMatch[1].trim() : `Slide ${i} Details`;
      const descMatch =
        section.match(/\*\*Visual\*\*:\s*([^\n]+)/i) ||
        section.match(/\*\*Idea\*\*:\s*([^\n]+)/i);
      const desc = descMatch
        ? descMatch[1].trim()
        : "Visual composition guidelines";
      slides.push({ number: i, text: title, visual: desc });
    }
    if (slides.length === 0) {
      return [
        {
          number: 1,
          text: "Hook/Intro: Why traditional scaling fails",
          visual: "Solid dark bg, bold centered typography",
        },
        {
          number: 2,
          text: "The Problem: Token dependencies scale with volume",
          visual: "Contrast highlights on dependency chart",
        },
        {
          number: 3,
          text: "The Solution: Compact context buffer caching",
          visual: "Code block showing caching functions",
        },
        {
          number: 4,
          text: "The Result: 85% reduced token consumption costs",
          visual: "Stat metric card with solid border outlines",
        },
        {
          number: 5,
          text: "CTA: Comment 'GROWTH' to download template",
          visual: "Arrow symbol pointing to comment section",
        },
      ];
    }
    return slides;
  };

  const slides = getCarouselSlides();

  const handleLoadHistoryItem = (item) => {
    setTopic(item.topic);
    setContentType(item.contentType);
    setTone(item.tone);
    setDuration(item.duration);
    setAdditionalNotes(item.additionalNotes || "");
    setGeneratedScript(item.script);
    setLastGeneratedScript({
      topic: item.topic,
      contentType: item.contentType,
      tone: item.tone,
      duration: item.duration,
      additionalNotes: item.additionalNotes || "",
      script: item.script,
    });
    setCurrentSubView("script");
  };

  const filteredHistory = (scriptHistory || [])
    .filter((item) => {
      const matchesSearch =
        item.topic.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.script.toLowerCase().includes(historySearch.toLowerCase());
      const matchesType =
        historyTypeFilter === "all" || item.contentType === historyTypeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (historySort === "newest") return new Date(b.date) - new Date(a.date);
      if (historySort === "oldest") return new Date(a.date) - new Date(b.date);
      const score = (id) =>
        likedItems[id] === "up" ? 1 : likedItems[id] === "down" ? -1 : 0;
      if (historySort === "most_liked") return score(b.id) - score(a.id);
      if (historySort === "least_liked") return score(a.id) - score(b.id);
      return 0;
    });

  const allSelected =
    filteredHistory.length > 0 &&
    filteredHistory.every((item) => selectedItems.has(item.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredHistory.map((i) => i.id)));
    }
  };

  const deleteSelected = () => {
    setScriptHistory((prev) => prev.filter((h) => !selectedItems.has(h.id)));
    setSelectedItems(new Set());
  };

  return (
    <div className="flex-1 bg-neutral-950 text-neutral-200 overflow-hidden font-sans relative flex flex-col h-full">
      {/* ── Full-width Top Navbar (mirrors Dashboard header exactly) ── */}
      <header
        className="w-full px-8 pt-6 pb-6 flex items-center border-b border-neutral-800 justify-between z-30 flex-shrink-0 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,10,0.85)" : "rgba(9,9,9,0.6)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
        }}
      >
        <div>
          <h2 className="text-[18px] font-semibold text-white tracking-tight">
            Content Studio
          </h2>
          <p className="text-[14px] text-neutral-500 mt-0.5">
            Generate scripts, carousels, and publish-ready content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
            <input
              type="text"
              placeholder="Search now"
              className="bg-neutral-900 text-[12px] text-neutral-300 placeholder-neutral-400 rounded-full pl-8 pr-4 py-2.5 w-48 focus:outline-none transition-all"
            />
          </div>

          {/* Sync button */}
          <button
            onClick={syncData}
            disabled={isSyncing}
            title="Sync workspace data"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white text-[12px] font-medium transition-colors disabled:opacity-50"
          >
            {isSyncing ? (
              <FiLoader className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FiRefreshCw className="w-3.5 h-3.5" />
            )}
            <span>{isSyncing ? "Syncing…" : "Sync"}</span>
          </button>
        </div>
      </header>

      {/* ── Body: left config panel + right preview, both within a shared scroll ref ── */}
      <div ref={scrollRef} className="flex flex-1 overflow-hidden">
        {/* Left Config Panel */}
        <div className="w-full md:w-96 p-8 flex flex-col justify-between bg-neutral-950 overflow-y-auto border-r border-r-neutral-800 flex-shrink-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-900 rounded-full">
                <button
                  type="button"
                  onClick={() => setContentType("video")}
                  className={`py-3 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    contentType === "video"
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <FiPlay className="w-3.5 h-3.5" />
                  Video Reel
                </button>
                <button
                  type="button"
                  onClick={() => setContentType("carousel")}
                  className={`py-3 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    contentType === "carousel"
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <FiLayout className="w-3.5 h-3.5" />
                  Carousel Slide
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-neutral-455">
                Content Topic / Prompt
              </label>
              <div className="relative">
                <textarea
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    contentType === "video"
                      ? "e.g. 3 coding tricks every javascript developer needs to know about to write clean loops"
                      : "e.g. Simple guide on how we reduced LLM token cost by 85% using context caching."
                  }
                  rows={4}
                  className="w-full bg-neutral-900 rounded-xl py-3 px-4 pr-14 text-xs text-white placeholder-neutral-600 focus:outline-none focus:bg-neutral-850 transition-colors resize-none leading-relaxed"
                />
                <button
                  type="button"
                  title="Improve prompt"
                  className="absolute bottom-3.5 right-2.5 w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-all"
                >
                  <FiZap className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-neutral-455">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-neutral-900 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:bg-neutral-855 transition-colors"
              >
                <option>Conversational & Engaging</option>
                <option>Educational & Explainer</option>
                <option>Energetic & Hype</option>
                <option>Professional & Authoritative</option>
                <option>Storytelling & Relatable</option>
              </select>
            </div>

            {contentType === "video" && (
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-455">
                  Est. Duration
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      value: "15 seconds (Super punchy)",
                      label: "15s · Punchy",
                    },
                    {
                      value: "30-45 seconds (Optimal engagement)",
                      label: "30–45s · Optimal",
                    },
                    {
                      value: "60 seconds (Deep dive explainer)",
                      label: "60s · Deep dive",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDuration(option.value)}
                      className={`px-3.5 py-2 rounded-full text-[11px] font-semibold transition-colors ${
                        duration === option.value
                          ? "bg-neutral-100 text-neutral-950"
                          : "bg-neutral-900 text-neutral-450 hover:text-white hover:bg-neutral-850"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-neutral-455">
                Specific CTA / Extra Notes
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Comment 'CLEAN' to receive source code"
                className="w-full bg-neutral-900 rounded-xl py-3 px-4 text-xs text-white placeholder-neutral-600 focus:outline-none focus:bg-neutral-855 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isGeneratingScript || !topic.trim()}
              className={`w-full py-3.5 px-4 rounded-full text-xs font-medium transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                isGeneratingScript
                  ? "bg-neutral-900 text-neutral-500 cursor-wait"
                  : "bg-purple-600 hover:bg-purple-500 text-white active:scale-98"
              }`}
            >
              {isGeneratingScript ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Drafting layout...
                </>
              ) : (
                <>
                  <FiFileText className="w-4 h-4" />
                  Generate Content
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-neutral-550 text-center leading-normal mt-6 border-t border-neutral-800 pt-9">
            Drafted scripts are optimized for high organic hook rates.
          </p>
        </div>

        {/* Right Preview/Viewer Panel */}
        <div
          className="flex-1 bg-neutral-950 h-full flex flex-row overflow-hidden"
          style={{ position: "relative" }}
        >
          {/* Inner scroll container */}
          <div className="flex-1 px-8 py-8 overflow-y-auto h-full flex flex-col min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between mb-2 px-1 pb-4">
              <div className="flex items-center gap-2">
                {currentSubView === "library" ? (
                  <button
                    onClick={() => {
                      setCurrentSubView("script");
                      setSelectedItems(new Set());
                    }}
                    className="text-sm font-medium text-neutral-500 hover:text-white transition-colors"
                  >
                    Studio
                  </button>
                ) : (
                  <span className="text-sm font-medium text-neutral-500">
                    Studio
                  </span>
                )}
                <FiChevronRight className="w-3.5 h-3.5 text-neutral-700" />
                <span className="text-sm font-semibold text-white">
                  {currentSubView === "library"
                    ? "History"
                    : contentType === "video"
                      ? "Video Script"
                      : "Carousel Outline"}
                </span>
              </div>

              {currentSubView === "library" && selectedItems.size > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-medium">
                    {selectedItems.size} selected
                  </span>
                  <button
                    onClick={deleteSelected}
                    className="flex items-center gap-1.5 px-3 rounded-xl text-red-500 hover:text-red-700 text-[11px] font-medium transition-colors"
                  >
                    <FiTrash2 className="w-3 h-3" />
                    Delete{" "}
                    {selectedItems.size > 1
                      ? `${selectedItems.size} items`
                      : "item"}
                  </button>
                </div>
              ) : currentSubView !== "library" ? (
                <button
                  onClick={() => setCurrentSubView("library")}
                  className="text-xs text-neutral-450 hover:text-white flex items-center gap-1.5 transition-colors font-medium"
                >
                  <FiSliders className="w-3.5 h-3.5" />
                  Show History
                </button>
              ) : null}
            </div>

            {isGeneratingScript ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <FiLoader className="w-12 h-12 text-purple-500 animate-spin" />
                <h4 className="text-sm font-bold text-white">
                  Generating Studio Blueprint...
                </h4>
                <p className="text-neutral-500 text-xs max-w-sm leading-relaxed font-mono">
                  Analyzing hook alternatives, visual directions, audio notes,
                  and caption copy...
                </p>
              </div>
            ) : currentSubView === "script" && generatedScript ? (
              <div className="flex-1 flex flex-col space-y-6">
                <div className="bg-neutral-900 p-5 rounded-xl flex justify-between items-center gap-6">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {topic}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-[12px] bg-neutral-950 px-3 py-1.5 rounded-full font-medium text-neutral-400">
                        {contentType === "video" ? "Video Reel" : "Carousel"}
                      </span>
                      <span className="text-[12px] bg-neutral-950 px-3 py-1.5 rounded-full font-medium text-neutral-400">
                        {tone}
                      </span>
                      {contentType === "video" && (
                        <span className="text-[12px] bg-neutral-950 px-3 py-1.5 rounded-full font-medium text-neutral-400">
                          {duration}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleSendToPublisher}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-purple-950/20 transition-colors"
                    >
                      <FiSend className="w-3.5 h-3.5" />
                      Publish
                    </button>
                    <button
                      onClick={handleCopy}
                      className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      {copied ? (
                        <>
                          <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <FiCopy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {contentType === "carousel" && (
                  <div className="space-y-3">
                    <h4 className="text-[13px] font-semibold text-neutral-450">
                      Slide Layout Preview
                    </h4>
                    <div className="flex gap-4 overflow-x-auto scrollbar-thin">
                      {slides.map((slide) => {
                        const expanded = expandedSlides.includes(slide.number);
                        return (
                          <div
                            key={slide.number}
                            className="min-w-[240px] max-w-[240px] bg-neutral-900 p-5 rounded-xl flex flex-col justify-between shadow-inner shrink-0"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[12px] font-medium text-neutral-500">
                                Slide {slide.number}
                              </span>
                            </div>
                            <div className="my-2">
                              <p
                                className={`text-[13px] text-white font-semibold leading-normal${expanded ? "" : "line-clamp-3"}`}
                              >
                                {slide.text}
                              </p>
                              {(slide.text.length > 120 || expanded) && (
                                <button
                                  onClick={() => toggleExpanded(slide.number)}
                                  className="mt-2 text-[11px] text-blue-400 hover:text-blue-300"
                                >
                                  {expanded ? "View less" : "View more"}
                                </button>
                              )}
                            </div>
                            <div
                              className={`text-[10px] text-neutral-500 font-mono leading-normal ${expanded ? "" : "line-clamp-2"}`}
                            >
                              - {slide.visual}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="bg-neutral-900 rounded-xl p-6 prose prose-invert max-w-none">
                  <StudioMarkdownViewer content={generatedScript} />
                </div>
              </div>
            ) : currentSubView === "library" ? (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center gap-3 mb-5 flex-wrap px-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    title={allSelected ? "Deselect all" : "Select all"}
                    className="w-4 h-4 accent-purple-500 cursor-pointer shrink-0 rounded"
                  />
                  <div className="relative flex-1 min-w-[180px]">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300 w-5 h-5" />
                    <input
                      type="text"
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder="Search"
                      className="w-full bg-neutral-900 rounded-full py-3 pl-12 pr-4 text-[13px] text-white placeholder-neutral-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="relative" ref={filterDropdownRef}>
                    <button
                      onClick={() => {
                        setShowFilterDropdown((v) => !v);
                        setShowSortDropdown(false);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-3 rounded-full text-[12px] font-medium transition-all ${
                        historyTypeFilter !== "all"
                          ? "bg-purple-800 border-purple-800 text-purple-300"
                          : "bg-neutral-800 border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white"
                      }`}
                    >
                      <FiSliders className="w-3 h-3" />
                      Filters{historyTypeFilter !== "all" ? " (1)" : ""}
                      <FiChevronDown className="w-3 h-3" />
                    </button>
                    {showFilterDropdown && (
                      <div className="absolute top-full mt-2 left-0 z-50 bg-neutral-900 border border-neutral-800 rounded-2xl py-1.5 shadow-2xl min-w-[130px]">
                        {[
                          { id: "all", label: "All" },
                          { id: "video", label: "Reels" },
                          { id: "carousel", label: "Carousels" },
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={() => {
                              setHistoryTypeFilter(f.id);
                              setShowFilterDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-[12px] font-medium flex items-center justify-between gap-3 transition-colors ${
                              historyTypeFilter === f.id
                                ? "text-white bg-neutral-800"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                            }`}
                          >
                            {f.label}
                            {historyTypeFilter === f.id && (
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={sortDropdownRef}>
                    <button
                      onClick={() => {
                        setShowSortDropdown((v) => !v);
                        setShowFilterDropdown(false);
                      }}
                      className="flex items-center gap-1.5 px-4 py-3 rounded-full text-[12px] font-medium bg-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white transition-all"
                    >
                      <span>
                        {historySort === "newest"
                          ? "Newest"
                          : historySort === "oldest"
                            ? "Oldest"
                            : historySort === "most_liked"
                              ? "Most Liked"
                              : "Least Liked"}
                      </span>
                      <FiChevronDown className="w-3 h-3" />
                    </button>
                    {showSortDropdown && (
                      <div className="absolute top-full mt-2 right-0 z-50 bg-neutral-900 border border-neutral-800 rounded-2xl py-1.5 shadow-2xl min-w-[140px]">
                        {[
                          { id: "newest", label: "Newest" },
                          { id: "oldest", label: "Oldest" },
                          { id: "most_liked", label: "Most Liked" },
                          { id: "least_liked", label: "Least Liked" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setHistorySort(s.id);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-[11px] font-medium flex items-center justify-between gap-3 transition-colors ${
                              historySort === s.id
                                ? "text-white bg-neutral-800"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                            }`}
                          >
                            {s.label}
                            {historySort === s.id && (
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {filteredHistory.length > 0 ? (
                  <div className="flex-1 overflow-y-auto pr-1">
                    {filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleLoadHistoryItem(item)}
                        className={`flex items-center gap-4 py-6 px-2 border-b border-neutral-800/50 cursor-pointer transition-colors duration-150 group ${
                          selectedItems.has(item.id)
                            ? "bg-neutral-900"
                            : "hover:bg-neutral-900/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelect(item.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 accent-purple-500 cursor-pointer shrink-0 rounded"
                        />
                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-300 group-hover:text-purple-500 group-hover:bg-purple-900/40 transition-colors">
                          <FiFileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[11px] text-neutral-500 font-mono truncate">
                              {item.tone.split(" ")[0]}
                            </span>
                            <span
                              className={`text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded ${
                                item.contentType === "video"
                                  ? "bg-purple-950/50 text-purple-400"
                                  : "bg-blue-950/50 text-blue-400"
                              }`}
                            >
                              {item.contentType === "video"
                                ? "Reel"
                                : "Carousel"}
                            </span>
                          </div>
                          <p className="text-[13px] font-semibold text-neutral-200 group-hover:text-white truncate leading-snug">
                            {item.topic}
                          </p>
                        </div>
                        <span className="text-[10px] text-neutral-600 shrink-0 hidden sm:block">
                          {new Date(item.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <div
                          className="flex items-center gap-2 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              setLikedItems((prev) => ({
                                ...prev,
                                [item.id]: prev[item.id] === "up" ? null : "up",
                              }))
                            }
                            className={`p-2.5 rounded-full transition-colors ${
                              likedItems[item.id] === "up"
                                ? "text-purple-400 bg-purple-950/30"
                                : "text-neutral-500 bg-neutral-900 hover:text-white hover:bg-neutral-800"
                            }`}
                            title="Like"
                          >
                            <FiThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setLikedItems((prev) => ({
                                ...prev,
                                [item.id]:
                                  prev[item.id] === "down" ? null : "down",
                              }))
                            }
                            className={`p-2.5 rounded-full transition-colors ${
                              likedItems[item.id] === "down"
                                ? "text-red-400 bg-red-950/30"
                                : "text-neutral-500 bg-neutral-900 hover:text-white hover:bg-neutral-800"
                            }`}
                            title="Dislike"
                          >
                            <FiThumbsDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(
                                item.script || item.topic,
                              );
                            }}
                            className="p-2.5 rounded-full text-neutral-500 bg-neutral-900 hover:text-white hover:bg-neutral-800 transition-colors"
                            title="Share / Copy"
                          >
                            <FiShare className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-px h-4 bg-neutral-800 mx-0.5" />
                          <button
                            onClick={() =>
                              setScriptHistory((prev) =>
                                prev.filter((h) => h.id !== item.id),
                              )
                            }
                            className="p-2.5 rounded-full bg-red-950/90 hover:text-red-500 text-red-400 hover:bg-red-950/50 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 rounded-3xl bg-neutral-900/40">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center mb-4 text-neutral-600 shadow-md">
                      <FiSearch className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">
                      {scriptHistory.length === 0
                        ? "No scripts yet"
                        : "No scripts found"}
                    </h4>
                    <p className="text-neutral-500 text-xs max-w-sm leading-relaxed">
                      {scriptHistory.length === 0
                        ? "Generate your first script — it will appear here."
                        : "Try adjusting your search or filters."}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 rounded-3xl bg-neutral-900/40">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center mb-4 text-purple-400 shadow-md">
                  <FiFileText className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-2">
                  Configure Studio Assets
                </h4>
                <p className="text-neutral-500 text-xs max-w-sm leading-relaxed">
                  Fill in the topic, tone, and format on the left, then hit{" "}
                  <span className="text-neutral-300 font-semibold">
                    Generate Content
                  </span>{" "}
                  to create your script.
                </p>
              </div>
            )}
          </div>

          {/* ── Expandable Publish Drawer (right edge) ── */}
          <PublishDrawer />
        </div>
      </div>
    </div>
  );
}

function StudioMarkdownViewer({ content }) {
  if (!content) return null;
  const lines = content.split("\n");
  let inTable = false;
  let tableHeaders = [];
  let tableRows = [];
  const renderedElements = [];

  const flushTable = (key) => {
    if (tableRows.length > 0) {
      renderedElements.push(
        <div
          key={`table-wrapper-${key}`}
          className="overflow-x-auto my-4 rounded-xl bg-neutral-950/60"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900/40 text-neutral-450 font-semibold">
                {tableHeaders.map((th, index) => (
                  <th
                    key={index}
                    className="py-3 px-5"
                    dangerouslySetInnerHTML={{ __html: th }}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-950">
              {tableRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-neutral-900/10 text-neutral-350"
                >
                  {row.map((td, cIdx) => (
                    <td
                      key={cIdx}
                      className="py-3 px-5 leading-normal"
                      dangerouslySetInnerHTML={{ __html: td }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      tableRows = [];
      tableHeaders = [];
      inTable = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("|")) {
      const cols = line
        .split("|")
        .map((c) => c.trim())
        .filter((_, i, arr) => i > 0 && i < arr.length - 1);
      if (
        cols.every(
          (col) =>
            col.startsWith(":") || col.startsWith("-") || col.match(/^[-:]+$/),
        )
      )
        return;
      if (!inTable) {
        inTable = true;
        tableHeaders = cols.map((c) =>
          c.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
        );
      } else {
        tableRows.push(
          cols.map((c) => c.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")),
        );
      }
      return;
    } else {
      flushTable(idx);
    }

    if (trimmed.startsWith("### ")) {
      renderedElements.push(
        <h5
          key={idx}
          className="text-xs font-bold text-white mt-5 mb-2 border-b border-neutral-950 pb-1"
        >
          {trimmed.slice(4)}
        </h5>,
      );
    } else if (trimmed.startsWith("## ")) {
      renderedElements.push(
        <h4
          key={idx}
          className="text-sm font-bold text-purple-400 mt-6 mb-3 border-l-2 border-purple-500 pl-2"
        >
          {trimmed.slice(3)}
        </h4>,
      );
    } else if (trimmed.startsWith("# ")) {
      renderedElements.push(
        <h3
          key={idx}
          className="text-base font-semibold text-white mt-8 mb-4 pb-1 border-b border-neutral-800"
        >
          {trimmed.slice(2)}
        </h3>,
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const parsedText = trimmed
        .slice(2)
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(
          /`(.*?)`/g,
          '<code class="bg-neutral-950 py-0.5 px-1 rounded text-purple-400 font-mono text-[10px]">$1</code>',
        );
      renderedElements.push(
        <li
          key={idx}
          className="list-disc ml-4 mb-2 text-xs text-neutral-300"
          dangerouslySetInnerHTML={{ __html: parsedText }}
        />,
      );
    } else if (trimmed !== "") {
      const parsedText = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(
          /`(.*?)`/g,
          '<code class="bg-neutral-950 py-0.5 px-1 rounded text-purple-400 font-mono text-[10px]">$1</code>',
        );
      renderedElements.push(
        <p
          key={idx}
          className="text-[13px] text-neutral-355 leading-relaxed mb-3"
          dangerouslySetInnerHTML={{ __html: parsedText }}
        />,
      );
    }
  });

  flushTable("final");
  return <div className="space-y-1">{renderedElements}</div>;
}
