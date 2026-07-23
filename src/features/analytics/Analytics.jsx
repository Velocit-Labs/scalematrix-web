import React, { useState, useRef, useEffect } from "react";
import NepalReachMap from "./NepalReachMap";
import {
  FiRefreshCw,
  FiLoader,
  FiArrowUpRight,
  FiArrowDownRight,
  FiTrendingUp,
  FiUsers,
  FiEye,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiZap,
  FiInstagram,
  FiCalendar,
  FiChevronDown,
  FiDownload,
  FiClock,
  FiSearch,
} from "react-icons/fi";

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({ label, value, delta, deltaUp, icon, accent, sub }) {
  return (
    <div className="bg-neutral-900 rounded-2xl p-5 flex flex-col gap-2 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-neutral-400">
          {label}
        </span>
        <span
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}
        >
          {icon}
        </span>
      </div>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-[26px] font-bold text-white leading-none tracking-tight">
          {value}
        </span>
        {delta && (
          <span
            className={`flex items-center gap-0.5 text-[12px] font-semibold mb-0.5 ${deltaUp ? "text-emerald-400" : "text-red-400"}`}
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
        <p className="text-[11px] text-neutral-600 leading-relaxed">{sub}</p>
      )}
    </div>
  );
}

// ─── Multi-Line Chart ─────────────────────────────────────────────────────────

function MultiLineChart({ datasets, labels, height = 260 }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const svgRef = useRef(null);
  const W = 800,
    H = height,
    PL = 52,
    PR = 20,
    PT = 16,
    PB = 36;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;

  const allVals = datasets.flatMap((d) => d.data);
  const maxVal = Math.max(...allVals);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const yTicks = [0, 20000, 40000, 60000, 80000].filter(
    (v) => v <= maxVal * 1.15,
  );
  const fmtY = (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v);

  const getX = (i) => PL + (i / (labels.length - 1)) * chartW;
  const getY = (v) => PT + chartH - ((v - minVal) / range) * chartH;

  const buildPath = (data) =>
    data
      .map(
        (v, i) =>
          `${i === 0 ? "M" : "L"}${getX(i).toFixed(1)},${getY(v).toFixed(1)}`,
      )
      .join(" ");

  const buildArea = (data) => {
    const line = buildPath(data);
    const lastX = getX(data.length - 1).toFixed(1);
    const firstX = getX(0).toFixed(1);
    return `${line} L${lastX},${(PT + chartH).toFixed(1)} L${firstX},${(PT + chartH).toFixed(1)} Z`;
  };

  const handleMouseMove = (e) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) * (W / rect.width) - PL;
    const idx = Math.round((x / chartW) * (labels.length - 1));
    setHoverIdx(Math.max(0, Math.min(labels.length - 1, idx)));
  };

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          {datasets.map((ds) => (
            <linearGradient
              key={ds.label}
              id={`area-${ds.label}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={ds.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={ds.color} stopOpacity="0.01" />
            </linearGradient>
          ))}
        </defs>

        {yTicks.map((tick) => {
          const y = getY(tick).toFixed(1);
          return (
            <g key={tick}>
              <line
                x1={PL}
                y1={y}
                x2={W - PR}
                y2={y}
                stroke="#262626"
                strokeWidth="1"
              />
              <text
                x={PL - 8}
                y={parseFloat(y) + 4}
                textAnchor="end"
                fill="#525252"
                fontSize="10"
                fontFamily="inherit"
              >
                {fmtY(tick)}
              </text>
            </g>
          );
        })}

        {labels.map((lbl, i) => {
          if (i % 4 !== 0 && i !== labels.length - 1) return null;
          return (
            <text
              key={i}
              x={getX(i)}
              y={H - 6}
              textAnchor="middle"
              fill="#525252"
              fontSize="10"
              fontFamily="inherit"
            >
              {lbl}
            </text>
          );
        })}

        {datasets.map((ds) => (
          <path
            key={`area-${ds.label}`}
            d={buildArea(ds.data)}
            fill={`url(#area-${ds.label})`}
          />
        ))}

        {datasets.map((ds) => (
          <path
            key={`line-${ds.label}`}
            d={buildPath(ds.data)}
            fill="none"
            stroke={ds.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {hoverIdx !== null && (
          <>
            <line
              x1={getX(hoverIdx)}
              y1={PT}
              x2={getX(hoverIdx)}
              y2={PT + chartH}
              stroke="#404040"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            {datasets.map((ds) => (
              <circle
                key={ds.label}
                cx={getX(hoverIdx)}
                cy={getY(ds.data[hoverIdx])}
                r="4.5"
                fill={ds.color}
                stroke="#0a0a0a"
                strokeWidth="2"
              />
            ))}
            {(() => {
              const tx = getX(hoverIdx);
              const boxW = 150,
                boxH = 16 + datasets.length * 20 + 12;
              const bx = tx + 12 + boxW > W ? tx - boxW - 12 : tx + 12;
              const by = PT + 8;
              return (
                <g>
                  <rect
                    x={bx}
                    y={by}
                    width={boxW}
                    height={boxH}
                    rx="8"
                    fill="#171717"
                    stroke="#2a2a2a"
                    strokeWidth="1"
                  />
                  <text
                    x={bx + 10}
                    y={by + 14}
                    fill="#a3a3a3"
                    fontSize="10"
                    fontFamily="inherit"
                  >
                    {labels[hoverIdx]}
                  </text>
                  {datasets.map((ds, di) => (
                    <g key={ds.label}>
                      <circle
                        cx={bx + 16}
                        cy={by + 28 + di * 20}
                        r="4"
                        fill={ds.color}
                      />
                      <text
                        x={bx + 26}
                        y={by + 32 + di * 20}
                        fill="#d4d4d4"
                        fontSize="10"
                        fontFamily="inherit"
                      >
                        {ds.label}
                      </text>
                      <text
                        x={bx + boxW - 10}
                        y={by + 32 + di * 20}
                        fill="white"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="end"
                        fontFamily="inherit"
                      >
                        {ds.data[hoverIdx] >= 1000
                          ? `${(ds.data[hoverIdx] / 1000).toFixed(1)}K`
                          : ds.data[hoverIdx]}
                      </text>
                    </g>
                  ))}
                </g>
              );
            })()}
          </>
        )}
      </svg>
    </div>
  );
}

// ─── Weekly Bar Chart ─────────────────────────────────────────────────────────

function WeeklyBarChart({ weeklyData }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-white">
            Weekly Performance
          </h3>
          <p className="text-[12px] text-neutral-500 mt-0.5">
            Engagements over the last 7 days.
          </p>
        </div>
        <span className="text-[12px] font-bold text-emerald-400 flex items-center gap-0.5">
          <FiArrowUpRight className="w-3.5 h-3.5" />
          +14.2%
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-end">
        <div className="flex items-end justify-between h-36 px-1 relative border-b border-neutral-800/80 pb-2">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-full border-t border-neutral-800/30" />
            ))}
            <div className="w-full" />
          </div>
          {weeklyData.map((item, idx) => (
            <div
              key={idx}
              className="flex-1 h-full flex flex-col justify-end items-center group relative z-10 px-0.5"
            >
              <div className="absolute bottom-full mb-2 bg-neutral-800 border border-neutral-700 text-white text-[10px] font-semibold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {item.displayValue}
              </div>
              <div
                className={`w-full rounded-t-md transition-all duration-300 ${item.active ? "bg-gradient-to-t from-purple-600 to-indigo-500" : "bg-neutral-800 group-hover:bg-neutral-700"}`}
                style={{ height: `${item.normalizedValue || item.value}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between px-1 mt-2">
          {weeklyData.map((d, i) => (
            <span
              key={i}
              className="flex-1 text-center text-[10px] text-neutral-600"
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function DonutChart({ segments, size = 140 }) {
  const cx = size / 2,
    cy = size / 2,
    r = size * 0.36;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.value / total) * circumference;
    const arc = { ...seg, dash, gap: circumference - dash, offset };
    offset += dash;
    return arc;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="22"
      />
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth="22"
          strokeDasharray={`${arc.dash} ${arc.gap}`}
          strokeDashoffset={-arc.offset}
          strokeLinecap="butt"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      ))}
      <text
        x={cx}
        y={cy - 5}
        textAnchor="middle"
        fill="white"
        fontSize="15"
        fontWeight="700"
        fontFamily="inherit"
      >
        {total > 1000 ? `${(total / 1000).toFixed(1)}k` : total}
      </text>
      <text
        x={cx}
        y={cy + 11}
        textAnchor="middle"
        fill="#525252"
        fontSize="9"
        fontFamily="inherit"
      >
        interactions
      </text>
    </svg>
  );
}

// ─── Horizontal Bar ───────────────────────────────────────────────────────────

function HorizontalBar({ label, value, max, color, sub }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-neutral-300">
          {label}
        </span>
        <span className="text-[12px] font-semibold text-white">{sub}</span>
      </div>
      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ─── Post Row ─────────────────────────────────────────────────────────────────

function PostRow({
  rank,
  img,
  caption,
  likes,
  comments,
  reach,
  engRate,
  type,
  saves,
}) {
  const engFloat = parseFloat(engRate);
  return (
    <div className="flex items-center gap-4 py-3 border-b border-neutral-800/50 last:border-b-0 group hover:bg-neutral-800/30 px-3 rounded-xl transition-colors cursor-pointer">
      <span className="text-[11px] font-bold text-neutral-600 w-4 shrink-0">
        {rank}
      </span>
      <div className="w-9 h-9 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
        {img ? (
          <img src={img} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiInstagram className="w-3.5 h-3.5 text-neutral-600" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-neutral-300 truncate group-hover:text-white transition-colors">
          {caption}
        </p>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider inline-block mt-0.5 ${type === "REEL" ? "text-purple-400" : type === "CAROUSEL" ? "text-blue-400" : "text-neutral-500"}`}
        >
          {type}
        </span>
      </div>
      <div className="flex items-center gap-4 shrink-0 text-center">
        <div className="hidden sm:block w-12">
          <p className="text-[12px] font-semibold text-white">
            {likes.toLocaleString()}
          </p>
          <p className="text-[9px] text-neutral-600">Likes</p>
        </div>
        <div className="hidden md:block w-14">
          <p className="text-[12px] font-semibold text-white">
            {comments.toLocaleString()}
          </p>
          <p className="text-[9px] text-neutral-600">Comments</p>
        </div>
        <div className="hidden md:block w-12">
          <p className="text-[12px] font-semibold text-white">
            {reach.toLocaleString()}
          </p>
          <p className="text-[9px] text-neutral-600">Reach</p>
        </div>
        <div className="hidden lg:block w-12">
          <p className="text-[12px] font-semibold text-white">
            {(saves || 0).toLocaleString()}
          </p>
          <p className="text-[9px] text-neutral-600">Saves</p>
        </div>
        <div className="w-10">
          <p
            className={`text-[12px] font-semibold ${engFloat >= 6 ? "text-emerald-400" : engFloat >= 4 ? "text-amber-400" : "text-neutral-400"}`}
          >
            {engRate}%
          </p>
          <p className="text-[9px] text-neutral-600">Eng.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Period Compare Row ───────────────────────────────────────────────────────

function CompareRow({ metric, current, previous, color }) {
  const diff = current - previous;
  const pct = previous ? ((diff / previous) * 100).toFixed(1) : "0.0";
  const up = diff >= 0;
  const fmt = (v) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString();
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-neutral-800/40 last:border-0">
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: color }}
      />
      <span className="flex-1 text-[12px] text-neutral-300 font-medium">
        {metric}
      </span>
      <span className="text-[12px] font-semibold text-white w-14 text-right">
        {fmt(current)}
      </span>
      <span className="text-[11px] text-neutral-500 w-14 text-right">
        {fmt(previous)}
      </span>
      <span
        className={`text-[11px] font-semibold w-12 text-right flex items-center justify-end gap-0.5 ${up ? "text-emerald-400" : "text-red-400"}`}
      >
        {up ? (
          <FiArrowUpRight className="w-3 h-3" />
        ) : (
          <FiArrowDownRight className="w-3 h-3" />
        )}
        {Math.abs(pct)}%
      </span>
    </div>
  );
}

// ─── Main Analytics ───────────────────────────────────────────────────────────

export default function Analytics({
  isSyncing,
  syncData,
  igInsights = null,
  mediaPosts = [],
  instagramConnected,
  metrics,
}) {
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [dateRange, setDateRange] = useState("30d");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const dateRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 10);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target))
        setShowDateDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filters = ["All", "Instagram", "LinkedIn", "Top Posts", "Recent"];
  const dateRangeOptions = [
    { id: "7d", label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
    { id: "90d", label: "Last 90 days" },
    { id: "1y", label: "Last year" },
  ];

  // ── Data ──
  const platforms = metrics?.platforms || {};
  const ig = platforms.instagram || {};
  const followers = igInsights?.followers || ig.followers || 12480;
  const reach = ig.reach || 48200;
  const totalLikes = igInsights?.totalLikes || 28400;
  const totalComments = igInsights?.totalComments || 5800;
  const engRate = igInsights?.engagementRate || ig.engagementRate || 4.8;
  const impressions = reach ? Math.round(reach * 1.35) : 65070;
  const saves = 5600;
  const shares = 4200;

  const chartLabels = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2024, 3, 6 + i);
    return `${d.toLocaleString("default", { month: "short" })} ${d.getDate()}`;
  });

  const impressionsData = Array.from({ length: 30 }, (_, i) =>
    Math.round(45000 + Math.sin(i * 0.45) * 18000 + Math.random() * 8000),
  );
  const reachData = Array.from({ length: 30 }, (_, i) =>
    Math.round(22000 + Math.sin(i * 0.5 + 0.5) * 12000 + Math.random() * 5000),
  );

  const chartDatasets = [
    { label: "Impressions", data: impressionsData, color: "#8B5CF6" },
    { label: "Reach", data: reachData, color: "#3B82F6" },
  ];

  const MOCK_WEEKLY = [
    { label: "Mon", normalizedValue: 50, displayValue: "4.5k" },
    { label: "Tue", normalizedValue: 72, displayValue: "6.5k" },
    { label: "Wed", normalizedValue: 100, displayValue: "9.0k", active: true },
    { label: "Thu", normalizedValue: 61, displayValue: "5.5k" },
    { label: "Fri", normalizedValue: 89, displayValue: "8.0k" },
    { label: "Sat", normalizedValue: 44, displayValue: "4.0k" },
    { label: "Sun", normalizedValue: 78, displayValue: "7.0k" },
  ];
  const weeklyData = igInsights?.weeklyEngagement?.length
    ? igInsights.weeklyEngagement.map((d, i, arr) => ({
        ...d,
        active:
          d.normalizedValue === Math.max(...arr.map((x) => x.normalizedValue)),
      }))
    : MOCK_WEEKLY;

  const donutSegments = [
    { label: "Likes", value: totalLikes, color: "#8B5CF6" },
    { label: "Comments", value: totalComments, color: "#06B6D4" },
    { label: "Shares", value: shares, color: "#10B981" },
    { label: "Saves", value: saves, color: "#F59E0B" },
  ];

  const compareData = [
    { metric: "Reach", current: reach, previous: 43100, color: "#8B5CF6" },
    {
      metric: "Impressions",
      current: impressions,
      previous: 58200,
      color: "#06B6D4",
    },
    { metric: "Likes", current: totalLikes, previous: 26000, color: "#F43F5E" },
    {
      metric: "Comments",
      current: totalComments,
      previous: 5900,
      color: "#3B82F6",
    },
    { metric: "Saves", current: saves, previous: 4800, color: "#F59E0B" },
    { metric: "Shares", current: shares, previous: 3900, color: "#10B981" },
  ];

  const contentMix = [
    { type: "Reels", pct: 54, color: "#8B5CF6", posts: 14, eng: "6.1%" },
    { type: "Carousels", pct: 28, color: "#06B6D4", posts: 8, eng: "5.3%" },
    { type: "Images", pct: 18, color: "#10B981", posts: 5, eng: "3.8%" },
  ];

  const audienceAge = [
    { label: "18–24", value: 38, max: 100, color: "#8B5CF6", sub: "38%" },
    { label: "25–34", value: 31, max: 100, color: "#06B6D4", sub: "31%" },
    { label: "35–44", value: 18, max: 100, color: "#10B981", sub: "18%" },
    { label: "45+", value: 13, max: 100, color: "#F59E0B", sub: "13%" },
  ];

  const topLocations = [
    { label: "Kathmandu", value: 42, max: 100, color: "#8B5CF6", sub: "42%" },
    { label: "Pokhara", value: 18, max: 100, color: "#06B6D4", sub: "18%" },
    { label: "Lalitpur", value: 14, max: 100, color: "#10B981", sub: "14%" },
    { label: "Bharatpur", value: 9, max: 100, color: "#F59E0B", sub: "9%" },
    { label: "Biratnagar", value: 7, max: 100, color: "#EF4444", sub: "7%" },
  ];

  const peakHours = [
    { label: "6AM", value: 30 },
    { label: "9AM", value: 72 },
    { label: "12PM", value: 88 },
    { label: "3PM", value: 55 },
    { label: "6PM", value: 95 },
    { label: "9PM", value: 80 },
    { label: "12AM", value: 25 },
  ];
  const maxPeak = Math.max(...peakHours.map((h) => h.value));

  const topPosts = (igInsights?.recentPosts || mediaPosts).length
    ? (igInsights?.recentPosts || mediaPosts).slice(0, 5).map((p, i) => ({
        rank: i + 1,
        img: p.thumbnail_url || p.media_url || null,
        caption: p.caption ? p.caption.substring(0, 55) + "…" : "No caption",
        likes: p.like_count || 0,
        comments: p.comments_count || 0,
        reach: p.reach || Math.round(Math.random() * 8000 + 2000),
        saves: p.saved || Math.round(Math.random() * 600 + 100),
        engRate: (
          (((p.like_count || 0) + (p.comments_count || 0)) / (followers || 1)) *
          100
        ).toFixed(1),
        type:
          p.media_type === "VIDEO"
            ? "REEL"
            : p.media_type === "CAROUSEL_ALBUM"
              ? "CAROUSEL"
              : "IMAGE",
      }))
    : [
        {
          rank: 1,
          img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&auto=format&fit=crop&q=80",
          caption: "5 Micro Habits for 10x Focus — tried these last week…",
          likes: 3240,
          comments: 187,
          reach: 14200,
          saves: 640,
          engRate: "6.2",
          type: "REEL",
        },
        {
          rank: 2,
          img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
          caption: "Introducing the Smart Insights Dashboard for creators…",
          likes: 2810,
          comments: 143,
          reach: 11800,
          saves: 510,
          engRate: "5.7",
          type: "CAROUSEL",
        },
        {
          rank: 3,
          img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80",
          caption: "To every creator still showing up — this one's for you.",
          likes: 2290,
          comments: 96,
          reach: 9600,
          saves: 380,
          engRate: "4.9",
          type: "IMAGE",
        },
        {
          rank: 4,
          img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80",
          caption: "Scaling a business in 2024: the systems that actually work",
          likes: 1980,
          comments: 74,
          reach: 8100,
          saves: 290,
          engRate: "4.3",
          type: "REEL",
        },
        {
          rank: 5,
          img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=150&auto=format&fit=crop&q=80",
          caption: "Compound growth isn't just for money — here's why…",
          likes: 1650,
          comments: 58,
          reach: 6900,
          saves: 210,
          engRate: "3.8",
          type: "CAROUSEL",
        },
      ];

  return (
    <div className="flex-1 bg-neutral-950 text-neutral-200 overflow-hidden font-sans relative flex flex-col h-full">
      {/* ── Header — mirrors Dashboard header pattern ── */}
      <header
        className="w-full px-8 pt-6 pb-6 flex items-center border-b border-neutral-800 justify-between z-30 flex-shrink-0 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,10,0.92)" : "rgba(9,9,9,0.6)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div>
          <h2 className="text-[18px] font-semibold text-white tracking-tight">
            Analytics
          </h2>
          <p className="text-[14px] text-neutral-500 mt-0.5">
            Deep-dive into performance, trends, and audience.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search — matching Dashboard */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
            <input
              type="text"
              placeholder="Search metrics"
              className="bg-neutral-900 text-[12px] text-neutral-300 placeholder-neutral-400 rounded-full pl-8 pr-4 py-2.5 w-48 focus:outline-none transition-all"
            />
          </div>

          {/* Sync */}
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

      {/* ── Scrollable body ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="px-8 pt-6 pb-12 space-y-6 max-w-7xl mx-auto">
          {/* ── Toolbar: filters left · date range + export right ── */}
          <div className="flex items-center justify-between gap-3">
            {/* Filter pills */}
            <div className="flex items-center gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${
                    activeFilter === f
                      ? "bg-neutral-200 text-neutral-950 font-semibold"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Right side: date range + export */}
            <div className="flex items-center gap-2">
              {/* Date range dropdown */}
              <div className="relative" ref={dateRef}>
                <button
                  onClick={() => setShowDateDropdown((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-neutral-300 text-[12px] font-medium hover:text-white transition-colors border border-neutral-800"
                >
                  <FiCalendar className="w-3.5 h-3.5" />
                  {dateRangeOptions.find((d) => d.id === dateRange)?.label}
                  <FiChevronDown className="w-3.5 h-3.5" />
                </button>
                {showDateDropdown && (
                  <div className="absolute top-full mt-2 right-0 z-50 bg-neutral-900 border border-neutral-800 rounded-2xl py-1.5 shadow-2xl min-w-[150px]">
                    {dateRangeOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setDateRange(opt.id);
                          setShowDateDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-[12px] font-medium flex items-center justify-between gap-3 transition-colors ${
                          dateRange === opt.id
                            ? "text-white bg-neutral-800"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                        }`}
                      >
                        {opt.label}
                        {dateRange === opt.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export — right of date range */}
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-[12px] font-medium transition-colors border border-neutral-800">
                <FiDownload className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* ── 4 KPI Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              label="Total Followers"
              value={followers.toLocaleString()}
              delta="+1.2%"
              deltaUp
              sub="Active audience"
              icon={<FiUsers className="w-4 h-4 text-purple-400" />}
              accent="bg-purple-500/10"
            />
            <KPICard
              label="Monthly Reach"
              value={reach ? `${(reach / 1000).toFixed(1)}K` : "—"}
              delta="+12%"
              deltaUp
              sub="Unique accounts"
              icon={<FiTrendingUp className="w-4 h-4 text-blue-400" />}
              accent="bg-blue-500/10"
            />
            <KPICard
              label="Impressions"
              value={
                impressions > 1000
                  ? `${(impressions / 1000).toFixed(1)}K`
                  : impressions
              }
              delta="+8.4%"
              deltaUp
              sub="Total content views"
              icon={<FiEye className="w-4 h-4 text-cyan-400" />}
              accent="bg-cyan-500/10"
            />
            <KPICard
              label="Eng. Rate"
              value={`${engRate}%`}
              delta="+0.4pp"
              deltaUp
              sub="Avg across all posts"
              icon={<FiZap className="w-4 h-4 text-amber-400" />}
              accent="bg-amber-500/10"
            />
          </div>

          {/* ── Performance Over Time + Weekly Performance ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 bg-neutral-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h3 className="text-[15px] font-semibold text-white">
                    Performance Over Time
                  </h3>
                  <div className="flex items-center gap-4 ml-2">
                    {chartDatasets.map((ds) => (
                      <span
                        key={ds.label}
                        className="flex items-center gap-1.5 text-[12px] text-neutral-400"
                      >
                        <span
                          className="w-3 h-0.5 rounded-full inline-block"
                          style={{ background: ds.color }}
                        />
                        {ds.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <MultiLineChart
                datasets={chartDatasets}
                labels={chartLabels}
                height={260}
              />
            </div>

            <div
              className="lg:col-span-2 bg-neutral-900 rounded-2xl p-6 flex flex-col"
              style={{ minHeight: 300 }}
            >
              <WeeklyBarChart weeklyData={weeklyData} />
              <div className="mt-4 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
                <span>
                  Total:{" "}
                  <strong className="text-neutral-300">
                    {((totalLikes + totalComments) / 1000).toFixed(1)}k
                    interactions
                  </strong>
                </span>
                <span>Last 7 days</span>
              </div>
            </div>
          </div>

          {/* ── Nepal Heatmap + Engagement Mix ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">
                  Geographic Reach
                </span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>
              <NepalReachMap />
            </div>

            <div className="lg:col-span-2 bg-neutral-900 rounded-2xl p-6">
              <h3 className="text-[14px] font-semibold text-white mb-1">
                Engagement Mix
              </h3>
              <p className="text-[12px] text-neutral-500 mb-5">
                Breakdown by interaction type.
              </p>
              <div className="flex items-center gap-5">
                <DonutChart segments={donutSegments} size={148} />
                <div className="space-y-3 flex-1">
                  {donutSegments.map((seg) => {
                    const total = donutSegments.reduce(
                      (a, s) => a + s.value,
                      0,
                    );
                    return (
                      <div key={seg.label} className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: seg.color }}
                        />
                        <span className="text-[12px] text-neutral-400 flex-1">
                          {seg.label}
                        </span>
                        <span className="text-[12px] font-semibold text-white">
                          {seg.value > 1000
                            ? `${(seg.value / 1000).toFixed(1)}k`
                            : seg.value}
                        </span>
                        <span className="text-[10px] text-neutral-600 w-8 text-right">
                          {Math.round((seg.value / total) * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-neutral-800/60 grid grid-cols-2 gap-3">
                <div className="bg-neutral-800/50 rounded-xl p-3">
                  <p className="text-[10px] text-neutral-500">Saves</p>
                  <p className="text-[15px] font-bold text-white mt-0.5">
                    {saves.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-semibold">
                    +6.1%
                  </p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-3">
                  <p className="text-[10px] text-neutral-500">Shares</p>
                  <p className="text-[15px] font-bold text-white mt-0.5">
                    {shares.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-semibold">
                    +3.8%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bento Row: Period Comparison + Content Mix + Peak Hours ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Period Comparison */}
            <div className="bg-neutral-900 rounded-2xl p-5">
              <h3 className="text-[14px] font-semibold text-white">
                Period Comparison
              </h3>
              <p className="text-[12px] text-neutral-500 mt-0.5 mb-4">
                vs. prior{" "}
                {dateRangeOptions
                  .find((d) => d.id === dateRange)
                  ?.label.toLowerCase()}
                .
              </p>
              <div className="flex items-center justify-between mb-3 text-[10px] text-neutral-600 uppercase tracking-widest font-semibold px-1">
                <span className="flex-1">Metric</span>
                <span className="w-12 text-right">Now</span>
                <span className="w-12 text-right">Prev</span>
                <span className="w-12 text-right">Δ</span>
              </div>
              {compareData.map((row) => (
                <CompareRow key={row.metric} {...row} />
              ))}
            </div>

            {/* Content Mix */}
            <div className="bg-neutral-900 rounded-2xl p-5">
              <h3 className="text-[14px] font-semibold text-white">
                Content Mix
              </h3>
              <p className="text-[12px] text-neutral-500 mt-0.5 mb-5">
                Post type performance breakdown.
              </p>
              <div className="space-y-4">
                {contentMix.map((c) => (
                  <div key={c.type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: c.color }}
                        />
                        <span className="text-[12px] font-medium text-neutral-300">
                          {c.type}
                        </span>
                        <span className="text-[10px] text-neutral-600">
                          {c.posts} posts
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400">
                        {c.eng}
                      </span>
                    </div>
                    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${c.pct}%`, background: c.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-neutral-600 mt-5 pt-4 border-t border-neutral-800/60 leading-snug">
                Reels drive <strong className="text-neutral-300">2.1×</strong>{" "}
                more reach than images.
              </p>
            </div>

            {/* Peak Hours */}
            <div className="bg-neutral-900 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[14px] font-semibold text-white">
                  Peak Hours
                </h3>
                <span className="text-[10px] text-neutral-600 flex items-center gap-1">
                  <FiClock className="w-3 h-3" /> 30 days
                </span>
              </div>
              <p className="text-[12px] text-neutral-500 mb-5">
                Best times to post for engagement.
              </p>
              <div className="flex items-end gap-2 h-20">
                {peakHours.map((h) => (
                  <div
                    key={h.label}
                    className="flex-1 flex flex-col items-center gap-1.5"
                  >
                    <div
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${(h.value / maxPeak) * 64}px`,
                        background:
                          h.value === maxPeak
                            ? "linear-gradient(to top, #7C3AED, #6366F1)"
                            : h.value >= 80
                              ? "#374151"
                              : "#262626",
                      }}
                    />
                    <span className="text-[8px] text-neutral-600">
                      {h.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-neutral-500 mt-4">
                Best window:{" "}
                <strong className="text-emerald-400">6:00 PM</strong>
              </p>
              <div className="mt-5 pt-4 border-t border-neutral-800/60 space-y-3">
                <p className="text-[12px] font-semibold text-neutral-400">
                  Age Distribution
                </p>
                {audienceAge.map((d) => (
                  <HorizontalBar key={d.label} {...d} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Follower Growth + Top Locations ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 bg-neutral-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[14px] font-semibold text-white">
                    Follower Growth
                  </h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    30-day net follower trajectory.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-emerald-400 flex items-center gap-0.5 justify-end">
                    <FiArrowUpRight className="w-3.5 h-3.5" />
                    +148
                  </p>
                  <p className="text-[9px] text-neutral-600 mt-0.5">
                    this period
                  </p>
                </div>
              </div>
              <MultiLineChart
                datasets={[
                  {
                    label: "Followers",
                    data: Array.from(
                      { length: 30 },
                      (_, i) => 11800 + Math.round(i * 22 + Math.random() * 80),
                    ),
                    color: "#8B5CF6",
                  },
                ]}
                labels={chartLabels}
                height={160}
              />
              <div className="mt-4 pt-4 border-t border-neutral-800/60 grid grid-cols-3 gap-4">
                {[
                  {
                    label: "New followers",
                    value: "+148",
                    color: "text-emerald-400",
                  },
                  { label: "Unfollowed", value: "-23", color: "text-red-400" },
                  { label: "Net gain", value: "+125", color: "text-white" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className={`text-[15px] font-bold ${s.color}`}>
                      {s.value}
                    </p>
                    <p className="text-[10px] text-neutral-600 mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-neutral-900 rounded-2xl p-6">
              <h3 className="text-[14px] font-semibold text-white">
                Top Locations
              </h3>
              <p className="text-[12px] text-neutral-500 mt-0.5 mb-5">
                Where your audience is based.
              </p>
              <div className="space-y-3">
                {topLocations.map((d) => (
                  <HorizontalBar key={d.label} {...d} />
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-neutral-800/60">
                <p className="text-[11px] text-neutral-600 leading-snug">
                  <strong className="text-neutral-300">42%</strong> of your
                  audience is based in Kathmandu Valley.
                </p>
              </div>
            </div>
          </div>

          {/* ── Top Performing Posts ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">
                Post Performance
              </span>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {["REEL", "CAROUSEL", "IMAGE"].map((type) => {
                const filtered = topPosts.filter((p) => p.type === type);
                const avgEng = filtered.length
                  ? (
                      filtered.reduce((s, p) => s + parseFloat(p.engRate), 0) /
                      filtered.length
                    ).toFixed(1)
                  : "0.0";
                const cfg = {
                  REEL: {
                    border: "border-purple-500/20",
                    text: "text-purple-400",
                    bg: "bg-purple-500/10",
                  },
                  CAROUSEL: {
                    border: "border-blue-500/20",
                    text: "text-blue-400",
                    bg: "bg-blue-500/10",
                  },
                  IMAGE: {
                    border: "border-emerald-500/20",
                    text: "text-emerald-400",
                    bg: "bg-emerald-500/10",
                  },
                }[type];
                return (
                  <div
                    key={type}
                    className={`bg-neutral-900 rounded-2xl p-5 border ${cfg.border}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${cfg.text}`}
                      >
                        {type}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}
                      >
                        {filtered.length} post{filtered.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className={`text-[22px] font-bold ${cfg.text}`}>
                      {avgEng}%
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      avg engagement rate
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-neutral-900 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-[14px] font-semibold text-white">
                    Top Performing Posts
                  </h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    Ranked by engagement rate.
                  </p>
                </div>
                <button className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white font-medium transition-colors px-3 py-2 rounded-xl hover:bg-neutral-800">
                  <FiDownload className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
              <div className="flex items-center gap-4 py-2.5 px-5 border-b border-neutral-800/60">
                <span className="w-4 shrink-0" />
                <span className="w-9 shrink-0" />
                <span className="flex-1 text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">
                  Post
                </span>
                <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider hidden sm:block w-12 text-center">
                  Likes
                </span>
                <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider hidden md:block w-14 text-center">
                  Comments
                </span>
                <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider hidden md:block w-12 text-center">
                  Reach
                </span>
                <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider hidden lg:block w-12 text-center">
                  Saves
                </span>
                <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider w-10 text-center">
                  Eng.
                </span>
              </div>
              <div className="px-2 py-1">
                {topPosts.map((post) => (
                  <PostRow key={post.rank} {...post} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
