import React, { useEffect, useState, useRef } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { FiArrowUpRight, FiEye, FiEyeOff } from "react-icons/fi";
import {
  PROVINCES,
  AGE_DEMOGRAPHICS,
  TIME_OPTIONS,
} from "../../shared/constants";

function TimePeriodDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = TIME_OPTIONS.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 bg-neutral-500/10 hover:bg-neutral-500/20 text-neutral-300 px-3 py-2 rounded-xl text-[12px] font-bold transition-colors select-none"
      >
        {selected?.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-40 bg-neutral-800 border border-neutral-700/60 rounded-xl shadow-xl z-50 overflow-hidden py-1">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-[12px] transition-colors ${
                opt.value === value
                  ? "text-purple-400 bg-purple-500/10 font-semibold"
                  : "text-neutral-300 hover:bg-neutral-700/60"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DemographicsPanel({ visible, onToggle }) {
  return (
    <div className="absolute top-0 right-0 w-52 z-10">
      {visible ? (
        <div className="rounded-xl p-2.5 backdrop-blur-md bg-neutral-900/60 border border-neutral-700/20">
          {/* Header with inline hide button */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-medium text-neutral-200">
              Age & Gender
            </span>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1 text-[10px] text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                M
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                F
              </span>
              <button
                onClick={onToggle}
                className="text-neutral-600 hover:text-neutral-300 transition-colors ml-0.5"
                title="Hide demographics"
              >
                <FiEye className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {AGE_DEMOGRAPHICS.map((row) => (
              <div key={row.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] text-gray-400 font-medium">
                    {row.label} yrs
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-500">
                      {row.total.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-400 rounded px-1 py-px">
                      {row.pct}
                    </span>
                  </div>
                </div>
                <div className="flex gap-0.5 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 shrink-0 rounded-full"
                    style={{ width: `${row.male}%` }}
                  />
                  <div className="w-0.5 bg-transparent shrink-0" />
                  <div
                    className="h-full bg-emerald-400 shrink-0 rounded-full"
                    style={{ width: `${row.female}%` }}
                  />
                  <div className="w-0.5 bg-transparent shrink-0" />
                  <div
                    className="h-full bg-neutral-700 shrink-0 rounded-full"
                    style={{ width: `${row.other}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2.5 pt-1.5 border-t border-neutral-500/15 flex justify-between items-center">
            <span className="text-[12px] text-gray-500">Total Population</span>
            <span className="text-[10px] font-bold text-neutral-300">
              21.1M
            </span>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 text-[11px] text-neutral-300 transition-colors bg-neutral-500/10 rounded-lg px-2.5 py-1.5"
            title="Show demographics"
          >
            <FiEyeOff className="w-3 h-3" />
            <span>Demographics</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function NepalReachMap() {
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("this_week");
  const [showDemographics, setShowDemographics] = useState(true);

  useEffect(() => {
    fetch("/nepal.geojson")
      .then((res) => res.json())
      .then((data) => {
        echarts.registerMap("Nepal", data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading Nepal GeoJSON:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 flex items-center justify-center h-[350px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-xs text-neutral-500">
            Loading Nepal Heatmap...
          </span>
        </div>
      </div>
    );
  }

  const labelFormatter = (params) => {
    const region = PROVINCES.find((r) => r.name === params.name);
    return region ? region.growth : "";
  };

  const labelStyle = {
    show: true,
    formatter: labelFormatter,
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  };

  const option = {
    backgroundColor: "transparent",
    tooltip: { show: false },
    visualMap: {
      show: true,
      min: 0,
      max: 100,
      left: 0,
      bottom: -12,
      text: ["High Reach", "Low Reach"],
      calculable: true,
      inRange: {
        color: [
          "rgba(168, 85, 247, 0.1)",
          "rgba(168, 85, 247, 0.4)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(168, 85, 247, 1)",
        ],
      },
      textStyle: {
        color: "#737373",
        fontSize: 20,
        fontWeight: "semibold",
      },
    },
    series: [
      {
        name: "Nepal Content Reach Heatmap",
        type: "map",
        map: "Nepal",
        nameProperty: "TARGET",
        roam: false,
        layoutCenter: ["52%", "50%"],
        layoutSize: "170%",
        aspectScale: 0.88,
        label: labelStyle,
        itemStyle: {
          borderColor: "#171717",
          borderWidth: 1.5,
          areaColor: "rgba(23, 23, 23, 0.6)",
        },
        emphasis: {
          label: { ...labelStyle, color: "#000000" },
          itemStyle: { areaColor: "#d8b4fe" },
        },
        select: {
          label: { ...labelStyle, color: "#000000" },
          itemStyle: {
            areaColor: "#fde047",
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        },
        selectedMode: "single",
        data: PROVINCES,
      },
    ],
  };

  return (
    <div className="bg-neutral-900 rounded-2xl p-5 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-white">
            Nepal Audience Heatmap
          </h3>
          <p className="text-[12px] text-neutral-500 mt-1">
            Visualizing content reach and growth trajectory across different
            provinces of Nepal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TimePeriodDropdown value={timePeriod} onChange={setTimePeriod} />

          <button className="px-2 py-2 text-neutral-300 bg-neutral-500/10 hover:text-neutral-400 rounded-xl transition-colors">
            <FiArrowUpRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative">
        <DemographicsPanel
          visible={showDemographics}
          onToggle={() => setShowDemographics((p) => !p)}
        />
        <div className="h-[380px] py-5">
          <ReactECharts
            option={option}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
