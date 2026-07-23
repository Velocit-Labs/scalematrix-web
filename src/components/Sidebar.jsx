import React, { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiBookOpen,
  FiLifeBuoy,
  FiTrendingUp,
} from "react-icons/fi";

import homeIcon from "../assets/home.svg";
import scriptIcon from "../assets/scripts.svg";
import queueIcon from "../assets/queue.svg";
import chatbotIcon from "../assets/chatbot.svg";
import settingsIcon from "../assets/settings.svg";
import chartIcon from "../assets/chart.svg";
import calendarIcon from "../assets/calendar.svg";
import libraryIcon from "../assets/library.svg";
import autopilotIcon from "../assets/autopilot.svg";
import memoryIcon from "../assets/memory.svg";
import helpIcon from "../assets/help.svg";
import replyIcon from "../assets/reply.svg";

const SvgIcon = ({ src, alt }) => (
  <img src={src} alt={alt} className="w-4 h-4 invert" />
);

const mainNavItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <SvgIcon src={homeIcon} alt="Dashboard" />,
  },
  {
    id: "search",
    label: "Search",
    icon: <FiSearch className="w-4 h-4" />,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <SvgIcon src={chartIcon} alt="Analytics" />,
  },
  {
    id: "studio",
    label: "Content Studio",
    icon: <SvgIcon src={scriptIcon} alt="Content Studio" />,
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: <SvgIcon src={calendarIcon} alt="Schedule" />,
  },
  {
    id: "autopilot",
    label: "Autopilot",
    icon: <SvgIcon src={autopilotIcon} alt="Autopilot" />,
  },
  {
    id: "autoreply",
    label: "Auto Replies",
    icon: <SvgIcon src={replyIcon} alt="Autoreply" />,
  },
  {
    id: "aimemory",
    label: "AI Memory",
    icon: <SvgIcon src={memoryIcon} alt="AI Memory" />,
  },
];

export default function Sidebar({
  activeView,
  setActiveView,
  isCollapsed,
  setIsCollapsed,
  onOpenNotifications,
  isNotificationsOpen,
}) {
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <aside
      className={`bg-neutral-950 flex flex-col justify-between h-screen sticky top-0 font-sans z-30 select-none transition-all duration-300 border-r border-r-neutral-800 ${
        isCollapsed ? "w-20" : "w-62"
      }`}
    >
      <div className="p-4 flex flex-col flex-1 overflow-y-auto">
        {/* Logo & Collapse Toggle */}
        <div
          className={`flex items-center mb-6 px-2 py-5 ${
            isCollapsed ? "justify-center flex-col gap-2" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <h1 className="text-white font-extrabold text-lg tracking-widest leading-none">
              SCALEMATRIX
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50 transition-colors ${
              isCollapsed ? "mx-auto" : ""
            }`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <FiChevronRight className="w-5 h-5" />
            ) : (
              <FiChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Profile Card */}
        <div
          className={`mb-8 rounded-2xl flex flex-col gap-4 ${
            isCollapsed ? "items-center justify-center pl-1" : ""
          }`}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
              S
            </div>

            {!isCollapsed && (
              <>
                <div className="truncate flex-1">
                  <span className="text-sm font-semibold text-neutral-300 block truncate leading-none">
                    Saugat Shahi
                  </span>
                  <span className="text-[12px] text-neutral-500 font-medium mt-1 block">
                    Free Plan
                  </span>
                </div>

                <button
                  onClick={() => setActiveView("settings")}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    activeView === "settings"
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                  }`}
                  title="Settings"
                >
                  <img
                    src={settingsIcon}
                    alt="Settings"
                    className="w-4.5 h-4.5 invert"
                  />
                </button>
              </>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() =>
                alert("Upgrading simulation: You are already on the Pro Plan.")
              }
              className="w-full py-2.5 px-2 border border-neutral-800 hover:bg-neutral-900 text-[14px] font-medium text-white rounded-full transition-all"
            >
              Upgrade to Pro
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1">
          {mainNavItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full font-medium text-[13px] transition-all duration-200 ${
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <span
                  className={`flex-shrink-0 ${
                    isActive ? "opacity-100" : "opacity-50"
                  }`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div
        className={`p-4 border-t border-neutral-900 flex flex-col gap-1 relative ${
          isCollapsed ? "items-center" : ""
        }`}
      >
        {/* Help & Support */}
        <button
          onClick={() => window.open("mailto:support@scalematrix.app", "_blank")}
          className={`flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-neutral-200 text-[13px] font-medium w-full rounded-full hover:bg-neutral-800/20 transition-colors ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
          title={isCollapsed ? "Help & Support" : ""}
        >
          <SvgIcon src={helpIcon} />
          {!isCollapsed && <span>Help & Support</span>}
        </button>

        {/* Privacy & Policies */}
        <button
          onClick={() => setShowTermsModal(true)}
          className={`flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-neutral-200 text-[13px] font-medium w-full rounded-full hover:bg-neutral-800/20 transition-colors ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
          title={isCollapsed ? "Privacy & Policies" : ""}
        >
          <FiBookOpen className="w-4 h-4 flex-shrink-0 opacity-60" />
          {!isCollapsed && <span>Privacy & Policies</span>}
        </button>
      </div>

      {/* Terms & Policies Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-3xl p-8 max-w-md w-full space-y-6 text-neutral-300">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Privacy & Policies
              </h4>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-xs text-neutral-500 hover:text-white font-bold"
              >
                Close
              </button>
            </div>
            <div className="h-px bg-neutral-800" />
            <div className="text-xs leading-relaxed space-y-4 max-h-60 overflow-y-auto font-mono">
              <p>
                <strong>1. Local LLM Privacy</strong>: All social metrics data
                and generated strategy prompts are processed locally through
                your Ollama instance. Your sensitive business profiles are never
                sent to external AI servers.
              </p>
              <p>
                <strong>2. API Integrations</strong>: OAuth tokens configured
                for Instagram and Composio are saved securely within your
                browser's private local storage. Revoking connection tokens can
                be executed instantly in Workspace Settings.
              </p>
              <p>
                <strong>3. Usage Limits</strong>: GrowthOS is open-source.
                System rates are bound only by your local server constraints and
                selected LLM dimensions.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
