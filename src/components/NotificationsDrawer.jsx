import React, { useState, useEffect, useRef } from "react";
import {
  FiX,
  FiSettings,
  FiBell,
  FiActivity,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "instagram",
    title: "New comment on your post",
    body: '@wellnesswave replied: "Love this routine! Keep it up 🔥"',
    time: "2 min ago",
    read: false,
    avatar: "IG",
    color: "bg-pink-500/15 text-pink-400",
  },
  {
    id: 2,
    type: "ai",
    title: "AI Growth Insight ready",
    body: "Your engagement rate dropped 4.2% this week. Tap to see recommendations.",
    time: "18 min ago",
    read: false,
    avatar: "AI",
    color: "bg-purple-500/15 text-purple-400",
  },
  {
    id: 3,
    type: "linkedin",
    title: "Post shared to LinkedIn",
    body: '"5 Morning Rituals for a Better Day" was successfully published.',
    time: "1 hr ago",
    read: false,
    avatar: "LI",
    color: "bg-blue-500/15 text-blue-400",
  },
  {
    id: 4,
    type: "system",
    title: "Sync completed",
    body: "Your Instagram metrics have been refreshed with the latest data.",
    time: "3 hr ago",
    read: true,
    avatar: "SY",
    color: "bg-emerald-500/15 text-emerald-400",
  },
  {
    id: 5,
    type: "instagram",
    title: "Post reached 10K impressions",
    body: '"Morning Productivity Habits" hit 10,000 impressions — your best yet!',
    time: "Yesterday",
    read: true,
    avatar: "IG",
    color: "bg-pink-500/15 text-pink-400",
  },
];

const MOCK_ACTIVITY = [
  {
    id: 1,
    label: "Dashboard synced",
    sub: "Instagram metrics refreshed",
    time: "2 min ago",
    dot: "bg-emerald-400",
  },
  {
    id: 2,
    label: "Script generated",
    sub: '"AI Tools for Content Creators" via GrowthOS AI',
    time: "1 hr ago",
    dot: "bg-purple-400",
  },
  {
    id: 3,
    label: "Instagram connected",
    sub: "@saugatshahi authenticated via Composio",
    time: "2 hr ago",
    dot: "bg-blue-400",
  },
  {
    id: 4,
    label: "Post published",
    sub: "Reel shared on LinkedIn · 3.2K reach",
    time: "Yesterday",
    dot: "bg-amber-400",
  },
  {
    id: 5,
    label: "Settings saved",
    sub: "Ollama model updated to llama3.1",
    time: "2 days ago",
    dot: "bg-neutral-500",
  },
];

export default function NotificationsDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const drawerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const dismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full z-50 w-[420px] flex flex-col bg-neutral-950 border-l border-neutral-800 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-white">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              title="Mark all as read"
              onClick={markAllRead}
              className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <FiCheck className="w-3.5 h-3.5" />
            </button>
            <button
              title="Clear all"
              onClick={clearAll}
              className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 flex-shrink-0">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-colors relative ${
              activeTab === "notifications"
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <FiBell className="w-3.5 h-3.5" />
            Notifications
            {activeTab === "notifications" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-colors relative ${
              activeTab === "activity"
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <FiActivity className="w-3.5 h-3.5" />
            Activity
            {activeTab === "activity" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "notifications" && (
            <div>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <FiBell className="w-6 h-6 text-neutral-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-neutral-400">
                      No notifications here yet
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      We'll notify you when something happens
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Unread section */}
                  {notifications.some((n) => !n.read) && (
                    <div>
                      <div className="px-5 py-3">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                          Unread
                        </span>
                      </div>
                      {notifications
                        .filter((n) => !n.read)
                        .map((n) => (
                          <NotificationItem
                            key={n.id}
                            n={n}
                            onMarkRead={markRead}
                            onDismiss={dismiss}
                          />
                        ))}
                    </div>
                  )}

                  {/* Read section */}
                  {notifications.some((n) => n.read) && (
                    <div>
                      <div className="px-5 py-3 mt-1">
                        <span className="text-[13px] font-medium text-neutral-500">
                          Earlier
                        </span>
                      </div>
                      {notifications
                        .filter((n) => n.read)
                        .map((n) => (
                          <NotificationItem
                            key={n.id}
                            n={n}
                            onMarkRead={markRead}
                            onDismiss={dismiss}
                          />
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="px-5 pt-4 space-y-1">
              {MOCK_ACTIVITY.map((item, i) => (
                <div key={item.id} className="flex gap-4 relative">
                  {/* Timeline line */}
                  {i < MOCK_ACTIVITY.length - 1 && (
                    <div className="absolute left-[7px] top-4 bottom-0 w-px bg-neutral-800" />
                  )}
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex-shrink-0 mt-1 ${item.dot} ring-4 ring-neutral-950`}
                  />
                  <div className="pb-5 min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-neutral-200 leading-tight">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      {item.sub}
                    </p>
                    <p className="text-[10px] text-neutral-600 mt-1 font-medium">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-neutral-800 flex-shrink-0">
          <button className="w-full flex items-center justify-center gap-2 text-[12px] text-neutral-500 hover:text-neutral-300 transition-colors py-1">
            <FiSettings className="w-3.5 h-3.5" />
            Notification Preferences
          </button>
        </div>
      </div>
    </>
  );
}

function NotificationItem({ n, onMarkRead, onDismiss }) {
  return (
    <div
      onClick={() => onMarkRead(n.id)}
      className={`flex gap-3 px-5 py-3.5 cursor-pointer group transition-colors ${
        !n.read
          ? "bg-purple-500/[0.04] hover:bg-purple-500/[0.07]"
          : "hover:bg-neutral-900/60"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${n.color}`}
      >
        {n.avatar}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-[14px] font-semibold leading-snug ${!n.read ? "text-white" : "text-neutral-400"}`}
          >
            {n.title}
          </p>
          {!n.read && (
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-[12px] text-neutral-500 mt-0.5 leading-relaxed line-clamp-2">
          {n.body}
        </p>
        <p className="text-[11px] text-neutral-600 mt-1 font-medium">
          {n.time}
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(n.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-600 hover:text-neutral-300 transition-all flex-shrink-0 mt-0.5"
      >
        <FiX className="w-3 h-3" />
      </button>
    </div>
  );
}
