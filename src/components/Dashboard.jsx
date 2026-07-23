import React, { useState, useRef, useEffect } from "react";
import NepalReachMap from "./NepalReachMap";
import {
  FiZap,
  FiSearch,
  FiCpu,
  FiRefreshCw,
  FiLoader,
  FiHeart,
  FiMessageCircle,
  FiPlusCircle,
  FiEye,
  FiUsers,
  FiTrendingUp,
  FiArrowUpRight,
  FiArrowDownRight,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
  FiYoutube,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiChevronDown,
  FiPlus,
  FiMoreHorizontal,
  FiCalendar,
  FiBell,
} from "react-icons/fi";

import InstagramIcon from "../assets/instagram.svg";
import LinkedinIcon from "../assets/linkedin.svg";

// ─── Constants ──────────────────────────────────────────────────────────────

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

// ─── Analytics Subcomponents ──────────────────────────────────────────────────

function StatCard({ label, value, sub, delta, deltaUp, icon, accent }) {
  return (
    <div className="bg-neutral-900 rounded-2xl p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-neutral-555">
          {label}
        </span>
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}
        >
          {icon}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white leading-none">
          {value}
        </span>
        {delta && (
          <span
            className={`flex items-center gap-0.5 text-[13px] font-semibold mb-0.5 ${deltaUp ? "text-emerald-400" : "text-red-400"}`}
          >
            {deltaUp ? (
              <FiArrowUpRight className="w-3 h-3" />
            ) : (
              <FiArrowDownRight className="w-3 h-3" />
            )}
            {delta}
          </span>
        )}
      </div>
      {sub && (
        <p className="text-[12px] text-neutral-500 leading-relaxed">{sub}</p>
      )}
    </div>
  );
}

function LineChart({ data = [], color = "#8B5CF6" }) {
  if (!data.length) {
    data = Array.from({ length: 14 }, (_, i) => ({
      value: 40 + Math.round(Math.sin(i * 0.7) * 20 + Math.random() * 15),
    }));
  }
  const W = 400,
    H = 90,
    P = 8;
  const vals = data.map((d) => d.value);
  const max = Math.max(...vals),
    min = Math.min(...vals);
  const range = max - min || 1;
  const pts = data
    .map((d, i) => {
      const x = P + (i * (W - 2 * P)) / (data.length - 1);
      const y = H - P - ((d.value - min) * (H - 2 * P)) / range;
      return `${x},${y}`;
    })
    .join(" ");
  const [fx] = pts.split(" ")[0].split(",");
  const last = pts.split(" ").at(-1);
  const [lx] = last.split(",");
  const areaPath = `M${fx},${H} L${pts
    .split(" ")
    .map((p) => `${p.split(",")[0]},${p.split(",")[1]}`)
    .join(" L")} L${lx},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 60 }}>
      <defs>
        <linearGradient
          id={`ag-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#ag-${color.replace("#", "")})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

function BarChart({ data = [], color = "#8B5CF6" }) {
  if (!data.length) {
    data = ["M", "T", "W", "T", "F", "S", "S"].map((l) => ({
      label: l,
      value: 20 + Math.round(Math.random() * 80),
    }));
  }
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1.5 h-14">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-sm"
              style={{
                height: `${(d.value / max) * 48}px`,
                background: color,
                opacity: 0.7 + 0.3 * (d.value / max),
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {data.map((d, i) => (
          <span
            key={i}
            className="flex-1 text-center text-[8px] text-neutral-600"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function PlatformRow({
  icon,
  name,
  description,
  handle,
  connected,
  onConnect,
  onDisconnect,
  comingSoon,
}) {
  return (
    <div
      className="
        group
        flex items-center justify-between
        py-2.5 px-1
        border-b border-neutral-800/50
        last:border-b-0
        transition-all duration-200
      "
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Platform Icon */}
        <div className="flex-shrink-0 flex items-center justify-center text-neutral-300 w-6 h-6">
          {icon}
        </div>

        {/* Platform Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white truncate">
              {name}
            </h3>

            {connected && (
              <div
                className="
                  flex items-center gap-1
                  px-2 py-0.5
                  rounded-full
                  bg-emerald-500/10
                  text-emerald-400
                  text-[10px]
                  font-semibold
                "
              >
                <FiCheckCircle className="w-3 h-3" />
                Connected
              </div>
            )}
          </div>

          <p className="text-[11px] text-neutral-500 mt-1">{description}</p>

          {connected && handle && (
            <p className="text-[11px] text-neutral-400 mt-1">@{handle}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center ml-4">
        {comingSoon ? (
          <div
            className="
              px-3 py-1.5
              rounded-xl
              bg-amber-500/10
              text-amber-400
              text-[10px]
              font-semibold
            "
          >
            N/A
          </div>
        ) : connected ? (
          <button
            onClick={onDisconnect}
            className="
              px-3 py-2
              rounded-xl
              bg-neutral-900
              border border-neutral-800
              text-neutral-400
              text-xs
              font-semibold
              hover:text-red-400
              hover:border-red-500/30
              transition-all
            "
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              bg-white
              text-black
              text-xs
              font-semibold
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all
            "
          >
            <FiPlusCircle className="w-3.5 h-3.5" />
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sticky Bottom Floating Action Button (Chat FAB) ──────────────────────────

function StickyPromptToolbar({ setActiveView }) {
  return (
    <button
      onClick={() => setActiveView("advisor")}
      title="Open ScaleMatrix Strategy Advisor"
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-transform duration-300 active:scale-95 hover:scale-105"
      style={{
        boxShadow: "0 8px 30px rgba(124, 58, 237, 0.4)",
      }}
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
      </svg>
    </button>
  );
}

// ─── Calendar Panel Subcomponents ───────────────────────────────────────────

function SideCalendarPanel() {
  const [currentDate, setCurrentDate] = useState(new Date("2030-04-01"));

  const [scheduledPosts, setScheduledPosts] = useState(() => {
    const saved = localStorage.getItem("scalematrix_scheduled_posts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse scheduled posts", e);
      }
    }
    return [
      {
        id: 1,
        category: "Productivity",
        title: "Content Hacks to Boost Reach",
        time: "10:00 AM",
        dateString: "2030-04-08",
        platform: "instagram",
        accent: "text-blue-400",
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=80",
        caption:
          "Boost your content reach with these simple hacks! 🚀\n1. Target trending keywords\n2. Hook the user in the first 3 seconds\n3. Engage with your audience instantly.\n#productivity #contentstrategy #growth",
        isAiAutopilot: false,
      },
      {
        id: 2,
        category: "Wellness",
        title: "Introducing Smart Insights Dashboard",
        time: "03:30 PM",
        dateString: "2030-04-19",
        platform: "linkedin",
        accent: "text-cyan-400",
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        caption:
          "Our new Smart Insights Dashboard is finally here! 📊\nTrack reach, engagement, likes, and comments in one clean workspace. Make decisions supported by real performance metrics.\n#analytics #dataviz #marketing #scalematrix",
        isAiAutopilot: false,
      },
      {
        id: 3,
        category: "Lifestyle",
        title: "Motivation for Content Creators",
        time: "09:00 AM",
        dateString: "2030-04-30",
        platform: "instagram",
        accent: "text-orange-400",
        img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80",
        caption:
          "To all the creators out there: keep showing up! 🌟\nConsistency builds compounding results. Your unique perspective is your best advantage.\n#motivation #creators #dailygrind #entrepreneur",
        isAiAutopilot: false,
      },
    ];
  });

  const [activePlans, setActivePlans] = useState(() => {
    const saved = localStorage.getItem("scalematrix_active_plans");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isPlanCreatorOpen, setIsPlanCreatorOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [schedDate, setSchedDate] = useState("2030-04-04");
  const [schedTime, setSchedTime] = useState("10:00 AM");
  const [schedPlatform, setSchedPlatform] = useState("instagram");
  const [schedTopic, setSchedTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genTitle, setGenTitle] = useState("");
  const [genCaption, setGenCaption] = useState("");
  const [genImg, setGenImg] = useState(
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&auto=format&fit=crop&q=80",
  );
  const [genCategory, setGenCategory] = useState("Productivity");

  const [planFreq, setPlanFreq] = useState("daily");
  const [planTopic, setPlanTopic] = useState("Productivity Hacks");
  const [planPlatform, setPlanPlatform] = useState("instagram");

  useEffect(() => {
    localStorage.setItem(
      "scalematrix_scheduled_posts",
      JSON.stringify(scheduledPosts),
    );
  }, [scheduledPosts]);

  useEffect(() => {
    localStorage.setItem("scalematrix_active_plans", JSON.stringify(activePlans));
  }, [activePlans]);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push({ day: d, isCurrentMonth: true });
    }
    const totalSlots = 35;
    const nextDaysNeeded = totalSlots - days.length;
    for (let d = 1; d <= nextDaysNeeded; d++) {
      days.push({ day: d, isCurrentMonth: false });
    }
    return days;
  };

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );

  const days = getDaysInMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatDateString = (dayNum, isCurr) => {
    if (!isCurr) return null;
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const d = String(dayNum).padStart(2, "0");
    return `${year}-${month}-${d}`;
  };

  const filteredSchedules = selectedDateStr
    ? scheduledPosts.filter((p) => p.dateString === selectedDateStr)
    : scheduledPosts.sort(
        (a, b) => new Date(a.dateString) - new Date(b.dateString),
      );

  const handleAiGeneration = () => {
    if (!schedTopic.trim()) {
      alert("Please enter a topic or seed idea for the AI.");
      return;
    }
    setIsGenerating(true);

    setTimeout(() => {
      const topicLower = schedTopic.toLowerCase();
      let title = "The Future of Content Creation";
      let category = "Lifestyle";
      let caption =
        "Generating engaging contents daily requires structure and strategic thinking. Automate details with GrowthOS.";
      let img =
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80";

      if (
        topicLower.includes("productivity") ||
        topicLower.includes("work") ||
        topicLower.includes("hack")
      ) {
        title = "5 Micro Habits for 10x Focus";
        category = "Productivity";
        caption =
          "Small daily routines compound into massive productivity gains. Here is how I schedule my deep work blocks:\n1. Keep notifications off\n2. Work in 90-minute blocks\n3. Do the hardest task first.\n#focus #productivity #hacks #lifehacks";
        img =
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&auto=format&fit=crop&q=80";
      } else if (
        topicLower.includes("wellness") ||
        topicLower.includes("health") ||
        topicLower.includes("mind")
      ) {
        title = "Daily Mindfulness Routines";
        category = "Wellness";
        caption =
          "Your mental wellness is your true net worth. Spend 10 minutes unplugged every morning to ground yourself.\n#mindfulness #wellness #healthy #mentalhealth";
        img =
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&auto=format&fit=crop&q=80";
      } else if (
        topicLower.includes("start") ||
        topicLiner.includes("scale") ||
        topicLower.includes("business") ||
        topicLower.includes("tech")
      ) {
        title = "Scaling Modern Business Systems";
        category = "Productivity";
        caption =
          "Building systems that operate independently of your direct presence is the gold standard of scale. Rely on automation tools.\n#startup #businessowner #automation #growth";
        img =
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80";
      } else if (
        topicLower.includes("finance") ||
        topicLower.includes("money") ||
        topicLower.includes("invest")
      ) {
        title = "Compound Interest Explained Simply";
        category = "Lifestyle";
        caption =
          "The eighth wonder of the world is compound interest. Start early, stay consistent, and let time work its magic.\n#finance #investing #wealth #savings";
        img =
          "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=150&auto=format&fit=crop&q=80";
      }

      setGenTitle(title);
      setGenCategory(category);
      setGenCaption(caption);
      setGenImg(img);
      setIsGenerating(false);
    }, 1200);
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!genTitle.trim()) {
      alert("Please generate content or enter a title first.");
      return;
    }

    const newPost = {
      id: Date.now(),
      category: genCategory,
      title: genTitle,
      time: schedTime,
      dateString: schedDate,
      platform: schedPlatform,
      accent:
        genCategory === "Productivity"
          ? "text-blue-400"
          : genCategory === "Wellness"
            ? "text-cyan-400"
            : "text-orange-400",
      img: genImg,
      caption: genCaption,
      isAiAutopilot: false,
    };

    setScheduledPosts((prev) => [...prev, newPost]);
    setIsSchedulerOpen(false);
    setSchedTopic("");
    setGenTitle("");
    setGenCaption("");
  };

  const handleActivateAutopilot = (e) => {
    e.preventDefault();
    if (!planTopic.trim()) {
      alert("Please specify a topic focus.");
      return;
    }

    const newPlan = {
      id: Date.now(),
      topic: planTopic,
      frequency: planFreq,
      platform: planPlatform,
      createdAt: new Date().toISOString(),
    };

    const newSimulatedPosts = [];
    const baseDay = selectedDateStr ? new Date(selectedDateStr) : new Date();

    for (let i = 1; i <= 5; i++) {
      const targetDate = new Date(baseDay);
      targetDate.setDate(baseDay.getDate() + i);
      const targetDateString = targetDate.toISOString().split("T")[0];

      newSimulatedPosts.push({
        id: Date.now() + i,
        category: "Productivity",
        title: `AI Autopilot: ${planTopic} (Part ${i})`,
        time: "09:00 AM",
        dateString: targetDateString,
        platform: planPlatform,
        accent: "text-purple-400",
        img:
          i % 2 === 0
            ? "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&auto=format&fit=crop&q=80"
            : "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80",
        caption: `Automated post generated by Autopilot strategy module focusing on: ${planTopic}.\n\nAI Insights suggest peak engagement for ${planPlatform} on ${targetDateString}.\n#autopilot #aiplanning #growthos`,
        isAiAutopilot: true,
      });
    }

    setScheduledPosts((prev) => [...prev, ...newSimulatedPosts]);
    setActivePlans((prev) => [...prev, newPlan]);
    setIsPlanCreatorOpen(false);
    alert(
      `AI Autopilot Activated! 🚀\nScheduled 5 upcoming automated posts on your calendar.`,
    );
  };

  const handleUnschedule = (postId) => {
    if (confirm("Are you sure you want to unschedule this post?")) {
      setScheduledPosts((prev) => prev.filter((p) => p.id !== postId));
      setSelectedPost(null);
    }
  };

  const handleDeactivateAutopilot = () => {
    if (
      confirm(
        "Deactivate AI Autopilot? This will cancel recurring automated generation cycles.",
      )
    ) {
      setActivePlans([]);
      setScheduledPosts((prev) => prev.filter((p) => !p.isAiAutopilot));
    }
  };

  return (
    <div className="w-[320px] bg-neutral-950 overflow-y-auto h-full flex flex-col select-none">
      <div className="pt-2 pl-0 pr-4 space-y-6">
        {/* ── AI Autopilot Status Banner ── */}
        <div className="bg-neutral-900 rounded-2xl p-5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-neutral-300 flex items-center gap-1.5">
              AI Autopilot
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${activePlans.length ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-700 text-neutral-300"}`}
            >
              {activePlans.length ? "Active" : "Off"}
            </span>
          </div>
          {activePlans.length ? (
            <div>
              <p className="text-[12px] text-neutral-400 leading-snug">
                Generating daily schedules automatically centered on{" "}
                <strong>"{activePlans[0].topic}"</strong>.
              </p>
              <button
                onClick={handleDeactivateAutopilot}
                className="mt-2.5 text-[12px] text-red-400 hover:text-red-300 font-semibold transition-colors"
              >
                Disable Autopilot
              </button>
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-neutral-500 leading-snug pb-2">
                Let AI analyze past feeds, generate captions, visuals, hashtags,
                and handle calendar automation.
              </p>
              <button
                onClick={() => setIsPlanCreatorOpen(true)}
                className="mt-2.5 w-full py-3 px-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-full text-[12px] font-semibold transition-all shadow-md shadow-purple-950/30"
              >
                Setup Autopilot Plan
              </button>
            </div>
          )}
        </div>

        {/* ── Calendar ── */}
        <div className="space-y-3 bg-neutral-900 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <h4 className="text-[15px] font-semibold text-white tracking-tight">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h4>
            <div className="flex items-center gap-0.5">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-200 transition-colors"
              >
                <FiChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-200 transition-colors"
              >
                <FiChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-0.5 text-center text-[12px] font-bold text-neutral-600 uppercase tracking-widest">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i} className="py-1">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {days.map((item, idx) => {
              const formattedDate = formatDateString(
                item.day,
                item.isCurrentMonth,
              );
              const isActive = item.day === 4 && item.isCurrentMonth;
              const hasPosts =
                formattedDate &&
                scheduledPosts.some((p) => p.dateString === formattedDate);
              const isSelected =
                formattedDate && selectedDateStr === formattedDate;

              return (
                <div
                  key={idx}
                  className="aspect-square flex items-center justify-center"
                >
                  <button
                    onClick={() => {
                      if (item.isCurrentMonth) {
                        setSelectedDateStr(isSelected ? null : formattedDate);
                      }
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-[12px] font-medium transition-all ${
                      !item.isCurrentMonth
                        ? "text-neutral-700 pointer-events-none"
                        : isSelected
                          ? "bg-purple-600 text-white font-bold ring-2 ring-purple-400/20"
                          : isActive
                            ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20"
                            : hasPosts
                              ? "bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30"
                              : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    {item.day}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Schedule ── */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h4 className="text-[14px] font-semibold text-white">Schedule</h4>
              {selectedDateStr && (
                <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  Filtered
                  <button
                    onClick={() => setSelectedDateStr(null)}
                    className="hover:text-white text-[10px]"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={() => {
                if (selectedDateStr) setSchedDate(selectedDateStr);
                setIsSchedulerOpen(true);
              }}
              className="w-6 h-6 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            >
              <FiPlus className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {filteredSchedules.length ? (
              filteredSchedules.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="flex gap-3 items-center group cursor-pointer hover:bg-neutral-800 rounded-xl py-2 px-2 transition-all"
                >
                  <img
                    src={post.img}
                    alt=""
                    className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider ${post.accent}`}
                      >
                        {post.category}
                      </span>
                      <span className="text-[9px] text-neutral-500 font-medium">
                        {post.platform === "instagram"
                          ? "Insta"
                          : post.platform === "linkedin"
                            ? "Linked"
                            : "Post"}
                      </span>
                    </div>
                    <p className="text-[12px] font-semibold text-neutral-200 leading-tight truncate group-hover:text-white transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-neutral-600 font-medium">
                      <FiCalendar className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>
                        {post.dateString} · {post.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-neutral-600 text-[11px] leading-snug">
                No items scheduled. Click the "+" button to plan a post.
              </div>
            )}
          </div>
        </div>

        {/* ── Recent Activities ── */}
        <div className="space-y-3 pb-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[14px] font-semibold text-white">
              Recent Activities
            </h4>
            <button className="w-6 h-6 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
              <FiMoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2.5">
              <span className="w-7 h-7 rounded-full text-emerald-400 flex items-center justify-center flex-shrink-0">
                <img
                  src={LinkedinIcon}
                  alt="LinkedIn"
                  className="w-4.5 h-4.5"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-neutral-200">
                  Post shared to LinkedIn
                </p>
                <p className="text-[11px] text-neutral-500 leading-relaxed mt-0.5">
                  "5 Morning Rituals for a Better Day" was published on your
                  LinkedIn page ·{" "}
                  <span className="text-neutral-600">2:10 PM</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <span className="w-7 h-7 rounded-full text-blue-400 flex items-center justify-center flex-shrink-0">
                <img
                  src={InstagramIcon}
                  alt="Instagram"
                  className="w-4.5 h-4.5"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-neutral-200">
                  New comment on Instagram
                </p>
                <p className="text-[11px] text-neutral-500 leading-relaxed mt-0.5">
                  <span className="text-neutral-400 font-semibold">
                    @wellnesswave
                  </span>{" "}
                  replied: "Love this routine!" ·{" "}
                  <span className="text-neutral-600">1:45 PM</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL: AI Autopilot Setup ── */}
      {isPlanCreatorOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-neutral-200 font-sans">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-sm w-full space-y-5">
            <div>
              <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                Setup Autopilot Automation
              </h3>
              <p className="text-[12px] text-neutral-500 mt-1">
                AI automatically creates, schedules, and posts content matched
                to your analytics.
              </p>
            </div>

            <form onSubmit={handleActivateAutopilot} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] text-neutral-400 font-medium block">
                  Focus Topic / Keyword
                </label>
                <input
                  type="text"
                  value={planTopic}
                  onChange={(e) => setPlanTopic(e.target.value)}
                  placeholder="e.g. Life Hacking, Fitness Tips"
                  className="w-full bg-neutral-950 rounded-xl px-3 py-3 text-[12px] text-white focus:outline-none focus:border-purple-600 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[12px] text-neutral-400 font-semibold block">
                    Frequency
                  </label>
                  <select
                    value={planFreq}
                    onChange={(e) => setPlanFreq(e.target.value)}
                    className="w-full bg-neutral-950 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors"
                  >
                    <option value="daily">Every Day</option>
                    <option value="weekly">Every Week</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] text-neutral-400 font-medium block">
                    Target Channel
                  </label>
                  <select
                    value={planPlatform}
                    onChange={(e) => setPlanPlatform(e.target.value)}
                    className="w-full bg-neutral-950 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlanCreatorOpen(false)}
                  className="flex-1 py-3 px-3 bg-neutral-800 hover:bg-neutral-800/50 text-[12px] font-semibold rounded-xl text-neutral-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-500 text-[12px] font-semibold rounded-xl text-white transition-all"
                >
                  Activate Autopilot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: AI Post Generator & Scheduler ── */}
      {isSchedulerOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-neutral-200 font-sans">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FiCalendar className="w-4 h-4 text-purple-400" />
                Schedule AI Content Generation
              </h3>
              <p className="text-[11px] text-neutral-500 mt-1">
                Enter a topic, let AI generate captions & tags, and configure
                schedule parameters.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold block">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold block">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold block">
                    Platform
                  </label>
                  <select
                    value={schedPlatform}
                    onChange={(e) => setSchedPlatform(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-600 transition-colors"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 border-t border-b border-neutral-800/60 py-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold block">
                    AI Seed Prompt / Topic
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={schedTopic}
                      onChange={(e) => setSchedTopic(e.target.value)}
                      placeholder="e.g. 5 productivity secrets, wellness at home"
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAiGeneration}
                      disabled={isGenerating}
                      className="bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-800 text-white font-semibold text-xs px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      {isGenerating ? (
                        <FiLoader className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <FiZap className="w-3.5 h-3.5" />
                      )}
                      <span>Generate</span>
                    </button>
                  </div>
                </div>

                {genTitle && (
                  <div className="bg-neutral-950/65 rounded-2xl p-4 border border-neutral-800 space-y-3.5 mt-2.5">
                    <div className="flex gap-3">
                      <img
                        src={genImg}
                        className="w-14 h-14 rounded-lg object-cover"
                        alt=""
                      />
                      <div className="flex-1 space-y-1">
                        <label className="text-[9px] text-neutral-500 uppercase tracking-wider font-semibold block">
                          Generated Title
                        </label>
                        <input
                          type="text"
                          value={genTitle}
                          onChange={(e) => setGenTitle(e.target.value)}
                          className="bg-transparent text-xs font-bold text-white w-full border-b border-neutral-800 focus:outline-none pb-0.5"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-neutral-500 uppercase tracking-wider font-semibold block">
                        Generated Caption
                      </label>
                      <textarea
                        value={genCaption}
                        onChange={(e) => setGenCaption(e.target.value)}
                        rows="3"
                        className="bg-transparent text-xs text-neutral-300 w-full border border-neutral-800 rounded-xl p-2 focus:outline-none leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsSchedulerOpen(false);
                    setSchedTopic("");
                    setGenTitle("");
                    setGenCaption("");
                  }}
                  className="py-2.5 px-5 border border-neutral-850 hover:bg-neutral-800 text-xs font-semibold rounded-xl text-neutral-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddPost}
                  className="py-2.5 px-5 bg-purple-600 hover:bg-purple-500 text-xs font-bold rounded-xl text-white transition-all"
                >
                  Add to Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Scheduled Post Details Preview ── */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-neutral-200 font-sans">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${selectedPost.accent}`}
                >
                  {selectedPost.category}
                </span>
                <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                  {selectedPost.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-neutral-500 hover:text-white text-sm font-bold"
              >
                Close
              </button>
            </div>

            <img
              src={selectedPost.img}
              className="w-full h-44 object-cover rounded-2xl shadow-lg border border-neutral-800"
              alt="Scheduled Media"
            />

            <div className="bg-neutral-950/70 p-4 border border-neutral-800/80 rounded-2xl">
              <label className="text-[9px] text-neutral-500 uppercase tracking-widest font-semibold block mb-1">
                Generated Content
              </label>
              <p className="text-[11px] text-neutral-300 leading-relaxed whitespace-pre-wrap leading-normal font-sans">
                {selectedPost.caption}
              </p>
            </div>

            <div className="flex justify-between items-center text-[10px] text-neutral-500 px-1">
              <span>
                Channel:{" "}
                <strong className="text-neutral-300 uppercase">
                  {selectedPost.platform}
                </strong>
              </span>
              <span>
                Time:{" "}
                <strong className="text-neutral-300">
                  {selectedPost.dateString} · {selectedPost.time}
                </strong>
              </span>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => handleUnschedule(selectedPost.id)}
                className="w-full py-2.5 px-3 bg-red-650/15 border border-red-500/20 hover:bg-red-600 hover:text-white text-red-400 rounded-xl text-xs font-semibold transition-all text-center"
              >
                Delete / Unschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function Dashboard({
  metrics,
  setActiveView,
  setTopicForScript,
  instagramConnected,
  username,
  connectInstagram,
  disconnectInstagram,
  ollamaConnected,
  isSyncing,
  syncData,
  mediaPosts = [],
  igInsights = null,
  onOpenNotifications,
  isNotificationsOpen,
  unreadCount = 0,
}) {
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 10);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const platforms = metrics?.platforms || {};
  const growthScore = metrics?.growthScore || 80;
  const topPerforming = metrics?.topPerforming || [];
  const growthOpportunities = metrics?.growthOpportunities || [];
  const ig = platforms.instagram || {};
  const followers = igInsights?.followers || ig.followers || 0;
  const reach = ig.reach || 0;
  const engRate = igInsights?.engagementRate || ig.engagementRate || 0;
  const impressions = reach ? Math.round(reach * 1.35) : 0;
  const isLive = !!instagramConnected && !!igInsights;

  const MOCK_WEEKLY = [
    { label: "Mon", value: 45, normalizedValue: 50, displayValue: "4.5k" },
    { label: "Tue", value: 65, normalizedValue: 72, displayValue: "6.5k" },
    {
      label: "Wed",
      value: 90,
      normalizedValue: 100,
      displayValue: "9.0k",
      active: true,
    },
    { label: "Thu", value: 55, normalizedValue: 61, displayValue: "5.5k" },
    { label: "Fri", value: 80, normalizedValue: 89, displayValue: "8.0k" },
    { label: "Sat", value: 40, normalizedValue: 44, displayValue: "4.0k" },
    { label: "Sun", value: 70, normalizedValue: 78, displayValue: "7.0k" },
  ];
  const weeklyData = igInsights?.weeklyEngagement?.length
    ? igInsights.weeklyEngagement.map((d, i, arr) => ({
        ...d,
        active:
          d.normalizedValue === Math.max(...arr.map((x) => x.normalizedValue)),
      }))
    : MOCK_WEEKLY;

  const totalEngagement = igInsights
    ? igInsights.totalLikes + igInsights.totalComments
    : 44200;
  const engagementDisplay =
    totalEngagement > 1000
      ? `${(totalEngagement / 1000).toFixed(1)}k`
      : `${totalEngagement}`;

  return (
    <div className="flex-1 bg-neutral-950 text-neutral-200 overflow-hidden font-sans relative flex flex-col h-full">
      {/* ── Header ── */}
      <header
        className="w-full px-8 pt-6 pb-6 flex items-center border-b border-neutral-800 justify-between z-30 flex-shrink-0 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,10,0.85)" : "rgba(9,9,9,0.6)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
        }}
      >
        <div>
          <h2 className="text-[18px] font-semibold text-white tracking-tight">
            Dashboard
          </h2>
          <p className="text-[14px] text-neutral-500 mt-0.5">
            Explore published posts and performance.
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

          {/* Notifications icon button */}
          <button
            onClick={onOpenNotifications}
            title="Notifications"
            className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isNotificationsOpen
                ? "bg-neutral-700 text-white"
                : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            <FiBell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

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

      {/* ── Body ── */}
      <div ref={scrollRef} className="flex flex-1 overflow-y-auto">
        <div className="flex-1 px-8 pt-8 pb-10 space-y-8 min-w-0">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Connect Instagram CTA */}
            {!instagramConnected && (
              <div className="bg-neutral-900 rounded-2xl p-5 flex items-center gap-5">
                <img
                  src={InstagramIcon}
                  alt="Instagram"
                  className="w-10 h-10"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-semibold text-white">
                    Connect Instagram for Live Data
                  </h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    Link Instagram to analyze performance and suggest posts for
                    higher engagement.
                  </p>
                </div>
                <button
                  onClick={connectInstagram}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white text-[12px] font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FiPlusCircle className="w-3.5 h-3.5" />
                  Connect Now
                </button>
              </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Growth Score"
                value={growthScore}
                delta="+4%"
                deltaUp
                sub="Posting velocity, engagement & follower growth."
                icon={<FiZap className="w-4 h-4 text-amber-400" />}
                accent="bg-amber-500/10"
              />
              <StatCard
                label="Followers"
                value={followers.toLocaleString()}
                delta="+1.2%"
                deltaUp
                sub="Active audience across connected profiles."
                icon={<FiUsers className="w-4 h-4 text-purple-400" />}
                accent="bg-purple-500/10"
              />
              <StatCard
                label="Monthly Reach"
                value={reach ? `${(reach / 1000).toFixed(1)}K` : "—"}
                delta="+12%"
                deltaUp
                sub="Unique accounts reached in the last 30 days."
                icon={<FiTrendingUp className="w-4 h-4 text-blue-400" />}
                accent="bg-blue-500/10"
              />
            </div>

            {/* Nepal Content Reach Heatmap */}
            <NepalReachMap />

            {/* Social Stats & Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly Performance Bar Chart */}
              <div className="bg-neutral-900 rounded-2xl p-6 flex flex-col justify-between h-[360px]">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-[14px] font-semibold text-white">
                        Weekly Performance
                      </h2>
                      <p className="text-[12px] text-neutral-500 mt-1">
                        Active content reach and engagements over the last 7
                        days.
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <FiArrowUpRight className="w-3.5 h-3.5" />
                        +14.2%
                      </span>
                      <span className="text-[9px] text-neutral-500 mt-0.5">
                        vs last week
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 relative">
                    <div className="flex items-end justify-between h-40 px-2 relative border-b border-neutral-800/80 pb-2">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
                        <div className="w-full border-t border-neutral-800/30" />
                        <div className="w-full border-t border-neutral-800/30" />
                        <div className="w-full border-t border-neutral-800/30" />
                        <div className="w-full" />
                      </div>

                      {weeklyData.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex-1 h-full flex flex-col justify-end items-center group relative z-10"
                        >
                          <div className="absolute bottom-full mb-2 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-semibold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl flex flex-col items-center whitespace-nowrap">
                            <span>{item.displayValue}</span>
                            {item.postCount > 0 && (
                              <span className="text-neutral-500 text-[9px]">
                                {item.postCount} post
                                {item.postCount !== 1 ? "s" : ""}
                              </span>
                            )}
                            <div className="w-1.5 h-1.5 bg-neutral-900 border-r border-b border-neutral-800 rotate-45 -mb-2 mt-0.5" />
                          </div>

                          <div
                            className={`w-7 rounded-t-lg transition-all duration-300 ${
                              item.active
                                ? "bg-gradient-to-t from-purple-600 to-indigo-500 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                                : "bg-neutral-800 group-hover:bg-neutral-700"
                            }`}
                            style={{
                              height: `${item.normalizedValue || item.value}%`,
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between px-2 mt-2">
                      {weeklyData.map((d, i) => (
                        <span
                          key={i}
                          className="flex-1 text-center text-[10px] text-neutral-500 font-medium"
                        >
                          {d.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <span>
                      Engagement:{" "}
                      <strong>{engagementDisplay} interactions</strong>
                    </span>
                  </div>
                  <span
                    className="text-purple-400 font-semibold cursor-pointer hover:underline"
                    onClick={() => setActiveView("analytics")}
                  >
                    View Analytics
                  </span>
                </div>
              </div>

              {/* Social Integrations */}
              <div className="bg-neutral-900 rounded-2xl p-6 flex flex-col h-[360px]">
                <div className="mb-5 flex-shrink-0 flex justify-between items-start">
                  <div>
                    <h2 className="text-[14px] font-semibold text-white">
                      Social Integrations
                    </h2>
                    <p className="text-[12px] text-neutral-500 mt-1">
                      Connect your social platforms for AI-powered content
                      planning, analytics, and automation.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveView("analytics")}
                    title="View Analytics"
                    className="px-2 py-2 text-neutral-300 bg-neutral-500/10 hover:text-neutral-400 rounded-xl transition-colors flex-shrink-0"
                  >
                    <FiArrowUpRight size={18} />
                  </button>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <PlatformRow
                    icon={
                      <img
                        src={InstagramIcon}
                        alt="Instagram"
                        className="w-10 h-10"
                      />
                    }
                    name="Instagram"
                    description="Posts, reels, stories and analytics"
                    handle={username}
                    connected={!!instagramConnected}
                    onConnect={connectInstagram}
                    onDisconnect={disconnectInstagram}
                  />
                  <PlatformRow
                    icon={
                      <img
                        src={LinkedinIcon}
                        alt="LinkedIn"
                        className="w-10 h-10"
                      />
                    }
                    name="LinkedIn"
                    description="Professional content and company pages"
                    comingSoon
                  />
                  <PlatformRow
                    icon={<FiTwitter className="w-5 h-5" />}
                    name="X (Twitter)"
                    description="Tweets, threads and engagement tracking"
                    comingSoon
                  />
                  <PlatformRow
                    icon={<FiYoutube className="w-5 h-5" />}
                    name="YouTube"
                    description="Videos, shorts and channel analytics"
                    comingSoon
                  />
                </div>
              </div>
            </div>

            {/* Recent Instagram Posts Grid */}
            {mediaPosts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[14px] font-semibold text-white">
                      Recent Posts
                    </h2>
                    <p className="text-[12px] text-neutral-500 mt-0.5">
                      {mediaPosts.length} post
                      {mediaPosts.length !== 1 ? "s" : ""} fetched from
                      Instagram
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveView("analytics")}
                    className="flex items-center gap-1 text-[11px] text-purple-400 font-semibold hover:underline"
                  >
                    View All <FiArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(igInsights?.recentPosts || mediaPosts)
                    .slice(0, 6)
                    .map((post, i) => {
                      const thumb =
                        post.thumbnail_url ||
                        post.media_url ||
                        post.image_url ||
                        null;
                      const likes = post.like_count || post.likeCount || 0;
                      const comments =
                        post.comments_count || post.commentsCount || 0;
                      const caption = post.caption
                        ? post.caption.substring(0, 60) +
                          (post.caption.length > 60 ? "…" : "")
                        : "No caption";
                      const mediaType = post.media_type || "IMAGE";
                      return (
                        <div
                          key={post.id || i}
                          className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800/60 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                          onClick={() =>
                            post.permalink &&
                            window.open(post.permalink, "_blank")
                          }
                        >
                          <div className="relative aspect-square bg-neutral-800 overflow-hidden">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={caption}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FiInstagram className="w-8 h-8 text-neutral-700" />
                              </div>
                            )}

                            {(mediaType === "VIDEO" ||
                              mediaType === "REELS") && (
                              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider">
                                Reel
                              </div>
                            )}
                            {mediaType === "CAROUSEL_ALBUM" && (
                              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider">
                                Album
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                              <div className="flex items-center gap-1 text-white text-xs font-semibold">
                                <FiHeart className="w-4 h-4" />{" "}
                                {likes.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1 text-white text-xs font-semibold">
                                <FiMessageCircle className="w-4 h-4" />{" "}
                                {comments.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="p-3">
                            <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
                              {caption}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-600">
                              <span className="flex items-center gap-1">
                                <FiHeart className="w-3 h-3 text-red-400" />{" "}
                                {likes.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiMessageCircle className="w-3 h-3 text-blue-400" />{" "}
                                {comments.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right calendar panel */}
        <div className="flex-shrink-0 sticky top-6 h-screen">
          <SideCalendarPanel />
        </div>
      </div>

      <StickyPromptToolbar setActiveView={setActiveView} />
    </div>
  );
}
