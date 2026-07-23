import React, { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiX,
  FiTrendingUp,
  FiHeart,
  FiMessageCircle,
  FiEye,
  FiClock,
  FiArrowUpRight,
  FiZap,
  FiLoader,
  FiRefreshCw,
  FiBookmark,
  FiShare2,
  FiRotateCcw,
} from "react-icons/fi";
import InstagramIcon from "../assets/instagram.svg";
import LinkedinIcon from "../assets/linkedin.svg";

const TRENDING_TOPICS = [
  { tag: "#ProductivityHacks", posts: "2.4k posts", delta: "+18%" },
  { tag: "#ContentCreator", posts: "5.1k posts", delta: "+7%" },
  { tag: "#GrowthMindset", posts: "1.8k posts", delta: "+31%" },
  { tag: "#StartupLife", posts: "3.3k posts", delta: "+12%" },
  { tag: "#AITools", posts: "6.7k posts", delta: "+47%" },
  { tag: "#SocialMediaMarketing", posts: "4.2k posts", delta: "+9%" },
];

const RECENT_SEARCHES = [
  "#q4-strategy",
  "tiktok-hooks-v2",
  "brand-sentiment",
  "viral reel ideas",
  "engagement rate",
  "linkedin growth",
];

const MOCK_RESULTS = [
  {
    id: 1,
    platform: "instagram",
    title: "5 Micro Habits for 10x Focus",
    caption:
      "Small daily routines compound into massive productivity gains. Here is how I schedule my deep work blocks...",
    likes: 4820,
    comments: 312,
    views: 28400,
    date: "2h ago",
    shares: 892,
    category: "Productivity",
    accent: "text-blue-400",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&auto=format&fit=crop&q=80",
    tags: ["#productivity", "#habits", "#focus"],
    badge: "RISING",
  },
  {
    id: 2,
    platform: "linkedin",
    title: "Scaling a SaaS from 0 to 1,000 Users",
    caption:
      "The first 1,000 users taught us more than any investor meeting ever could. Here's what actually worked...",
    likes: 2340,
    comments: 187,
    views: 15900,
    date: "5h ago",
    shares: 412,
    category: "Business",
    accent: "text-cyan-400",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80",
    tags: ["#startup", "#saas", "#growth"],
    badge: "NEW",
  },
  {
    id: 3,
    platform: "instagram",
    title: "Morning Routine of Top Creators",
    caption:
      "Your morning is a blank canvas. Most creators waste it scrolling. Here's a 30-minute ritual that changes everything...",
    likes: 6710,
    comments: 540,
    views: 42300,
    date: "1d ago",
    shares: 634,
    category: "Lifestyle",
    accent: "text-orange-400",
    img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80",
    tags: ["#morning", "#routine", "#creators"],
  },
  {
    id: 4,
    platform: "instagram",
    title: "AI Tools That Replaced My Entire Workflow",
    caption:
      "I tested 47 AI tools so you don't have to. These 6 are the only ones worth paying for in 2030...",
    likes: 9120,
    comments: 784,
    views: 61000,
    date: "2d ago",
    shares: 1203,
    category: "Tech",
    accent: "text-purple-400",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80",
    tags: ["#ai", "#workflow", "#tools"],
  },
  {
    id: 5,
    platform: "linkedin",
    title: "The Real Cost of Poor Hiring Decisions",
    caption:
      "One bad hire cost us $180,000. Not just salary — morale, momentum, and months of recovery time...",
    likes: 3450,
    comments: 299,
    views: 21800,
    date: "3d ago",
    shares: 287,
    category: "Business",
    accent: "text-cyan-400",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=80",
    tags: ["#hiring", "#leadership", "#startup"],
  },
  {
    id: 6,
    platform: "instagram",
    title: "Daily Mindfulness for Busy Founders",
    caption:
      "You cannot pour from an empty cup. 10 minutes of intentional stillness unlocked my best quarter yet...",
    likes: 5310,
    comments: 420,
    views: 33700,
    date: "4d ago",
    shares: 519,
    category: "Wellness",
    accent: "text-emerald-400",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&auto=format&fit=crop&q=80",
    tags: ["#mindfulness", "#wellness", "#founders"],
  },
];

const LIVE_MARKET_TRENDS = [
  {
    rank: "01",
    name: "#NeuroScaling",
    sub: "Campaign Velocity",
    delta: "+142%",
    color: "text-emerald-400",
  },
  {
    rank: "02",
    name: "Autonomous SaaS",
    sub: "Tech Sector",
    delta: "+89%",
    color: "text-emerald-400",
  },
  {
    rank: "03",
    name: "Zero-Code Ads",
    sub: "Creative Suite",
    delta: "+67%",
    color: "text-emerald-400",
  },
];

const FILTERS = ["All", "Instagram", "LinkedIn", "Top Posts", "Recent"];
const SORT_OPTIONS = ["Relevance", "Most Liked", "Most Viewed", "Newest"];

function PlatformBadge({ platform }) {
  if (platform === "instagram") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-pink-400 bg-pink-500/10 px-3 py-1.5 rounded-full">
        <img src={InstagramIcon} alt="Instagram" className="w-3 h-3" />
        Instagram
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full">
      <img src={LinkedinIcon} alt="LinkedIn" className="w-3 h-3" />
      LinkedIn
    </span>
  );
}

function ResultCard({ result, highlight }) {
  const highlightText = (text) => {
    if (!highlight) return text;
    const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-purple-500/20 text-purple-300 rounded px-0.5 not-italic"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="group flex items-start justify-between gap-4 py-4 border-b border-neutral-800/60 hover:bg-neutral-900/30 transition-all duration-200 cursor-pointer px-2 rounded-lg">
      <div className="flex gap-4 flex-1 min-w-0">
        <img
          src={result.img}
          alt={result.title}
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 mt-0.5"
        />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-semibold text-neutral-100 leading-snug group-hover:text-white transition-colors">
              {highlightText(result.title)}
            </h3>
            {result.badge && (
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${result.badge === "RISING" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-blue-400 border-blue-500/30 bg-blue-500/10"}`}
              >
                {result.badge}
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-1">
            {highlightText(result.caption)}
          </p>
          <div className="flex items-center gap-3 pt-0.5">
            <span className="flex items-center gap-1 text-[10px] text-neutral-600">
              <FiClock className="w-3 h-3" />
              {result.date}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-neutral-600">
              <FiEye className="w-3 h-3" />
              {result.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1 text-[10px] text-neutral-600">
              <FiShare2 className="w-3 h-3" />
              {result.shares} shares
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 mt-1">
        <PlatformBadge platform={result.platform} />
        <button className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100">
          <FiBookmark className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function AiInsightCard({ query }) {
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const map = {
        productivity: `Productivity content peaks Tue–Thu mornings. Carousels outperform reels 2:1 for this niche. Your best post here hit 9.0k engagements.`,
        ai: `AI posts are trending +47% this month. Hooks under 8 words drive 2× saves. Pair with #FutureOfWork for cross-niche reach.`,
        wellness: `Wellness content gets highest saves on Sunday evenings. Storytelling captions average 4.8% engagement vs 2.1% for list posts.`,
      };
      const key = Object.keys(map).find((k) => query.toLowerCase().includes(k));
      setInsight(
        map[key] ||
          `Posts about "${query}" perform best on Wednesdays at 10 AM. Reels get 3.2× more reach than static images. Try pairing with #CreatorEconomy for +18% impressions.`,
      );
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="bg-purple-950/30 rounded-2xl p-4 flex gap-3">
      <span className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
        <FiZap className="w-4 h-4 text-purple-400" />
      </span>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-purple-300">
            AI Insight
          </span>
          {loading && (
            <FiLoader className="w-3 h-3 text-purple-500 animate-spin" />
          )}
        </div>
        {loading ? (
          <div className="space-y-1.5">
            <div className="h-2 bg-purple-900/40 rounded-full w-full animate-pulse" />
            <div className="h-2 bg-purple-900/40 rounded-full w-4/5 animate-pulse" />
          </div>
        ) : (
          <p className="text-[12px] text-neutral-400 leading-relaxed">
            {insight}
          </p>
        )}
      </div>
    </div>
  );
}

function RightPanel({ onTagClick }) {
  const [insightApplied, setInsightApplied] = useState(false);

  const searchInsight = `Search velocity for #AutonomousSaaS has reached a 12-month peak. Consider pivoting Q4 creatives to focus on speed-to-market metrics.`;

  return (
    <div className="w-72 flex-shrink-0 space-y-4">
      {/* Live Market Trends */}
      <div className="bg-neutral-900 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-white">
            Live Market Trends
          </h3>
          <button className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors">
            <FiRotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {LIVE_MARKET_TRENDS.map((t) => (
            <button
              key={t.name}
              onClick={() => onTagClick(t.name)}
              className="w-full flex items-center gap-3 text-left group"
            >
              <span className="text-[12px] text-neutral-600 font-bold w-5 flex-shrink-0">
                {t.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-neutral-200 group-hover:text-white transition-colors truncate">
                  {t.name}
                </p>
                <p className="text-[12px] text-neutral-600 mt-0.5">{t.sub}</p>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span className={`text-[12px] font-semibold ${t.color}`}>
                  {t.delta}
                </span>
                <span className="text-[12px] text-neutral-600 mt-0.5">
                  Growth
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search Insight */}
      <div className="bg-neutral-900 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-semibold text-white">
            Search Insight
          </h3>
        </div>

        <p className="text-[12px] text-neutral-400 leading-relaxed italic">
          "{searchInsight}"
        </p>

        <button
          onClick={() => {
            setInsightApplied(true);
            onTagClick("#AutonomousSaaS");
          }}
          className={`w-full py-3 px-3 rounded-full text-[12px] font-semibold transition-all ${
            insightApplied
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
          }`}
        >
          {insightApplied ? "Insight Applied" : "Apply Insight to Search"}
        </button>
      </div>

      {/* Trending Topics */}
      <div className="bg-neutral-900 rounded-2xl p-5 space-y-3">
        <h3 className="text-[14px] font-semibold text-white flex items-center gap-1.5">
          Trending
        </h3>
        <div className="space-y-0.5">
          {TRENDING_TOPICS.slice(0, 4).map((t, i) => (
            <button
              key={t.tag}
              onClick={() => onTagClick(t.tag)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-neutral-800 transition-all group text-left"
            >
              <span className="text-[12px] text-neutral-600 font-bold w-4 flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-neutral-300 group-hover:text-white transition-colors truncate">
                  {t.tag}
                </p>
                <p className="text-[12px] text-neutral-600">{t.posts}</p>
              </div>
              <span className="text-[12px] font-semibold text-emerald-400 flex-shrink-0">
                {t.delta}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AISuggestedVectors({ onTagClick }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div>
            <p className="text-[14px] font-semibold text-neutral-200">
              AI Suggested Vectors
            </p>
            <p className="text-[12px] text-neutral-600">
              Smart insights based on your current search history
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => onTagClick("trending hooks")}
          className="bg-neutral-900 rounded-2xl p-5 space-y-3 cursor-pointer hover:bg-neutral-800/70 transition-all group"
        >
          <div className="flex items-start justify-between">
            <span className="w-10 h-10 rounded-xl bg-neutral-800 group-hover:bg-neutral-700 flex items-center justify-center transition-colors">
              <FiZap className="w-4.5 h-4.5 text-neutral-300" />
            </span>
            <span className="text-[9px] font-semibold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 uppercase tracking-wider">
              High Growth
            </span>
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-white">
              Trending Hooks
            </h4>
            <p className="text-[12px] text-neutral-500 mt-1 leading-relaxed">
              Short-form video hooks with &gt;20% average engagement retention.
            </p>
          </div>
        </div>

        <div
          onClick={() => onTagClick("brand voice")}
          className="bg-neutral-900 rounded-2xl p-5 space-y-3 cursor-pointer hover:bg-neutral-800/70 transition-all group"
        >
          <div className="flex items-start justify-between">
            <span className="w-10 h-10 rounded-xl bg-neutral-800 group-hover:bg-neutral-700 flex items-center justify-center transition-colors">
              <FiMessageCircle className="w-4 h-4 text-neutral-300" />
            </span>
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-white">
              Brand Voice Sync
            </h4>
            <p className="text-[12px] text-neutral-500 mt-1 leading-relaxed">
              Aligning agent persona with latest PR releases and social
              sentiment.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-purple-500 border-2 border-neutral-900" />
              <div className="w-5 h-5 rounded-full bg-fuchsia-600 border-2 border-neutral-900" />
            </div>
            <span className="text-[11px] font-semibold text-neutral-400">
              98% Alignment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Search({ setActiveView, isSyncing, syncData }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Relevance");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const [aiPowerOn, setAiPowerOn] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (q = query) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setIsSearching(true);
    setHasSearched(false);
    if (!recentSearches.includes(trimmed)) {
      setRecentSearches((prev) => [trimmed, ...prev].slice(0, 6));
    }
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 650);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") clearSearch();
  };

  const clearSearch = () => {
    setQuery("");
    setHasSearched(false);
    setIsSearching(false);
    inputRef.current?.focus();
  };

  const filteredResults = MOCK_RESULTS.filter((r) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.caption.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q)) ||
      r.category.toLowerCase().includes(q) ||
      r.platform.toLowerCase().includes(q);
    const matchesFilter =
      activeFilter === "All"
        ? true
        : activeFilter === "Instagram"
          ? r.platform === "instagram"
          : activeFilter === "LinkedIn"
            ? r.platform === "linkedin"
            : activeFilter === "Top Posts"
              ? r.likes > 4000
              : true;
    return matchesQuery && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === "Most Liked") return b.likes - a.likes;
    if (sortBy === "Most Viewed") return b.views - a.views;
    if (sortBy === "Newest") return new Date(b.date) - new Date(a.date);
    return 0;
  });

  return (
    <div className="flex-1 bg-neutral-950 text-neutral-200 overflow-hidden font-sans flex flex-col h-full">
      {/* Header */}
      <header className="w-full px-8 pt-6 pb-6 flex items-center border-b border-neutral-800 justify-between z-30 flex-shrink-0">
        <div>
          <h2 className="text-[18px] font-semibold text-white tracking-tight">
            Search
          </h2>
          <p className="text-[14px] text-neutral-500 mt-0.5">
            Find posts, topics, and performance insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
            <input
              type="text"
              placeholder="Search now"
              className="bg-neutral-900 text-[12px] text-neutral-300 placeholder-neutral-400 rounded-full pl-8 pr-4 py-2.5 w-48 focus:outline-none transition-all"
            />
          </div>
          <button
            onClick={syncData}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-[12px] font-medium transition-colors disabled:opacity-50"
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

      {/* Body — flex-1 + overflow-y-auto mirrors Dashboard exactly */}
      <div className="flex flex-1 overflow-y-auto">
        {/* ↓ Only change: removed max-w-7xl mx-auto, kept flex-1 + gap + padding */}
        <div className="flex flex-1 gap-8 px-8 pt-8 pb-10">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-6">
            <div className="space-y-4">
              <div className="relative bg-neutral-900 rounded-full flex items-center px-4 gap-3 hover:border-neutral-700 transition-colors focus-within:border-purple-500/40">
                <div className="flex-shrink-0">
                  {isSearching ? (
                    <FiLoader className="w-5 h-5 text-purple-400 animate-spin" />
                  ) : (
                    <FiSearch className="w-5 h-5 text-neutral-500" />
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search brand voice, campaign metrics, or trending hooks..."
                  className="flex-1 bg-transparent text-[14px] text-neutral-200 placeholder-neutral-600 py-4 focus:outline-none"
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                  {query && (
                    <button
                      onClick={clearSearch}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setAiPowerOn((v) => !v)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-semibold transition-all ${
                      aiPowerOn
                        ? "bg-purple-600/20 text-purple-300"
                        : "bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    AI Power
                    <span
                      className={`w-7 h-4 rounded-full relative transition-colors ${aiPowerOn ? "bg-purple-500" : "bg-neutral-600"}`}
                    >
                      <span
                        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${aiPowerOn ? "left-3.5" : "left-0.5"}`}
                      />
                    </span>
                  </button>
                </div>
              </div>

              {/* Recently used chips */}
              {!hasSearched && (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[12px] font-medium text-neutral-600 flex-shrink-0">
                    Recently Used:
                  </span>
                  {recentSearches.slice(0, 3).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setQuery(s);
                        handleSearch(s);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 rounded-full text-[12px] text-neutral-400 hover:text-neutral-200 hover:border-neutral-600 transition-all"
                    >
                      <FiClock className="w-3 h-3 text-neutral-400" />
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Filter bar */}
              {hasSearched && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {FILTERS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-3.5 py-2.5 rounded-full text-[12px] font-medium transition-all ${
                          activeFilter === f
                            ? "bg-neutral-800 text-white"
                            : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/40"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-neutral-900 text-[12px] text-neutral-400 rounded-xl px-3 py-2.5 focus:outline-none"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        Sort: {o}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Default state */}
            {!hasSearched && !isSearching && (
              <div className="space-y-6">
                <AISuggestedVectors
                  onTagClick={(t) => {
                    setQuery(t);
                    handleSearch(t);
                  }}
                />

                <div className="space-y-3">
                  <div>
                    <p className="text-[14px] font-semibold text-neutral-200">
                      Trending Now
                    </p>
                    <p className="text-[12px] text-neutral-600">
                      What's gaining traction in your industry vertical
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    {MOCK_RESULTS.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setQuery(r.category.toLowerCase());
                          handleSearch(r.category.toLowerCase());
                        }}
                        className="flex items-start justify-between gap-4 py-4 border-b border-neutral-800/50 hover:bg-neutral-900/40 transition-all cursor-pointer group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[14px] font-medium text-neutral-200 group-hover:text-white transition-colors">
                              {r.title}
                            </h4>
                            {r.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${r.badge === "RISING" ? "text-emerald-400 bg-emerald-500/10" : "text-blue-400 bg-blue-500/10"}`}
                              >
                                {r.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-neutral-500 line-clamp-1 leading-relaxed">
                            {r.caption}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-[11px] text-neutral-600">
                              <FiClock className="w-3 h-3" />
                              {r.date}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-neutral-600">
                              <FiEye className="w-3 h-3" />
                              {r.views.toLocaleString()} views
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-neutral-600">
                              <FiShare2 className="w-3 h-3" />
                              {r.shares} shares
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                          <PlatformBadge platform={r.platform} />
                          <button className="px-2 py-6 text-neutral-600 hover:text-neutral-300 hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100">
                            <FiBookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results state */}
            {hasSearched && (
              <div className="space-y-4">
                <AiInsightCard query={query} />

                <p className="text-[12px] text-neutral-500">
                  {filteredResults.length > 0 ? (
                    <>
                      <span className="text-white font-semibold">
                        {filteredResults.length}
                      </span>{" "}
                      result{filteredResults.length !== 1 ? "s" : ""} for{" "}
                      <span className="text-purple-400">"{query}"</span>
                    </>
                  ) : (
                    "No results found"
                  )}
                </p>

                {filteredResults.length > 0 ? (
                  <div className="space-y-0">
                    {filteredResults.map((r) => (
                      <ResultCard key={r.id} result={r} highlight={query} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center">
                      <FiSearch className="w-5 h-5 text-neutral-600" />
                    </div>
                    <p className="text-[14px] font-semibold text-neutral-400">
                      No results for "{query}"
                    </p>
                    <p className="text-[12px] text-neutral-600 max-w-xs">
                      Try a different keyword or remove filters.
                    </p>
                    <button
                      onClick={clearSearch}
                      className="mt-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[12px] font-medium rounded-xl transition-all"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel */}
          <RightPanel
            onTagClick={(t) => {
              setQuery(t);
              handleSearch(t);
            }}
          />
        </div>
      </div>
    </div>
  );
}
