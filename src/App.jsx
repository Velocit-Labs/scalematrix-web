import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import NotificationsDrawer from "./components/NotificationsDrawer";
import Home from "./components/Home";
import StrategyConsole from "./components/StrategyConsole";
import Planner from "./components/Planner";
import Studio from "./components/Studio";
import Advisor from "./components/Advisor";
import Settings from "./components/Settings";
import Onboarding from "./components/Onboarding";
import Search from "./components/Search";
import Analytics from "./components/Analytics";
import Schedule from "./components/Schedule";

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [isOnboarded, setIsOnboarded] = useState(
    () => localStorage.getItem("scalematrix_onboarded") === "true"
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Mock connection states
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("scalematrix_settings");
    return saved
      ? JSON.parse(saved)
      : {
          composioApiKey: "",
          ollamaUrl: "http://localhost:11434",
          ollamaModel: "llama3.1",
        };
  });

  // Mock data states
  const [mediaPosts, setMediaPosts] = useState([]);
  const [igInsights, setIgInsights] = useState(null);
  const [metrics, setMetrics] = useState({
    platforms: {},
    topPerforming: [],
    growthScore: 80,
    growthOpportunities: [],
  });

  const [topic, setTopic] = useState("");
  const [generatedScript, setGeneratedScript] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptHistory, setScriptHistory] = useState(() => {
    const saved = localStorage.getItem("scalematrix_script_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse script history:", e);
      }
    }
    return [];
  });

  const [sharedCaption, setSharedCaption] = useState("");
  const [sharedMediaUrl, setSharedMediaUrl] = useState("");

  // Sync script history to localStorage when changed
  useEffect(() => {
    localStorage.setItem(
      "scalematrix_script_history",
      JSON.stringify(scriptHistory)
    );
  }, [scriptHistory]);

  // Save settings helper
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("scalematrix_settings", JSON.stringify(newSettings));
  };

  // Mock sync data
  const syncData = async () => {
    setIsSyncing(true);
    try {
      // Simulate a short delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // In frontend-only mode, we just use mock data
    } catch (err) {
      console.error("Error syncing data:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Mock script generation
  const triggerGenerateScript = async (params) => {
    setIsGeneratingScript(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockScript = `
        [Scene 1] 
        Visual: Eye-catching intro with your brand colors
        Voiceover: "Discover how ${params.topic} can transform your business"
        
        [Scene 2]
        Visual: Key benefits carousel
        Voiceover: "We help you grow faster, smarter, and more sustainably"
        
        [Scene 3]
        Visual: Social proof/testimonials
        Voiceover: "Join thousands of satisfied customers"
        
        [Call to Action]
        Visual: Brand logo with CTA button
        Voiceover: "Click the link in bio to get started today"
      `;
      
      setGeneratedScript(mockScript);

      const newHistoryItem = {
        id: `gen-${Date.now()}`,
        topic: params.topic,
        contentType: params.format?.includes("Carousel") ? "carousel" : "video",
        tone: params.tone,
        duration: params.duration || "30-45 seconds",
        additionalNotes: params.additionalNotes || "",
        date: new Date().toISOString(),
        script: mockScript,
      };
      setScriptHistory((prev) => [newHistoryItem, ...prev]);
    } catch (err) {
      console.error("Script generation failed:", err);
      alert(`Script generation failed:\n${err.message}`);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Mock Instagram connect
  const connectInstagram = async () => {
    setIsConnecting(true);
    setAuthError("");
    try {
      // Simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInstagramConnected(true);
      setUsername("demo_user");
      alert("Instagram connection simulated successfully!");
    } catch (err) {
      console.error("Connection failed:", err);
      setAuthError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Mock Instagram disconnect
  const disconnectInstagram = async () => {
    const confirm = window.confirm(
      "Are you sure you want to remove this Instagram integration?"
    );
    if (!confirm) return;

    try {
      setInstagramConnected(false);
      setUsername("");
      setMediaPosts([]);
      alert("Instagram account disconnected successfully.");
    } catch (err) {
      alert(`Disconnect failed: ${err.message}`);
    }
  };

  // Sync data on mount and when settings change
  useEffect(() => {
    syncData();

    const handleFocus = () => {
      syncData();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-200 overflow-hidden font-sans w-full select-none">
      {/* Setup Wizard Onboarding Flow overlay */}
      {!isOnboarded && (
        <Onboarding
          onComplete={() => {
            setIsOnboarded(true);
            localStorage.setItem("scalematrix_onboarded", "true");
            syncData();
          }}
          settings={settings}
          connectInstagram={connectInstagram}
          isConnecting={isConnecting}
          instagramConnected={instagramConnected}
          username={username}
        />
      )}

      {/* Sidebar navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        isNotificationsOpen={isNotificationsOpen}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Main dashboard content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* View Switcher Container */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeView === "dashboard" && (
            <Home
              metrics={metrics}
              settings={settings}
              setActiveView={setActiveView}
              setTopicForScript={setTopic}
              instagramConnected={instagramConnected}
              username={username}
              connectInstagram={connectInstagram}
              disconnectInstagram={disconnectInstagram}
              isConnecting={isConnecting}
              ollamaConnected={ollamaConnected}
              isSyncing={isSyncing}
              syncData={syncData}
              mediaPosts={mediaPosts}
              igInsights={igInsights}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              isNotificationsOpen={isNotificationsOpen}
            />
          )}

          {activeView === "strategy" && <StrategyConsole settings={settings} />}

          {activeView === "planner" && (
            <Planner
              settings={settings}
              setActiveView={setActiveView}
              setSharedMediaUrl={setSharedMediaUrl}
              setSharedCaption={setSharedCaption}
            />
          )}

          {activeView === "studio" && (
            <Studio
              topic={topic}
              setTopic={setTopic}
              generatedScript={generatedScript}
              setGeneratedScript={setGeneratedScript}
              isGeneratingScript={isGeneratingScript}
              triggerGenerateScript={triggerGenerateScript}
              settings={settings}
              setSharedCaption={setSharedCaption}
              setSharedMediaUrl={setSharedMediaUrl}
              setActiveView={setActiveView}
              scriptHistory={scriptHistory}
              setScriptHistory={setScriptHistory}
            />
          )}

          {activeView === "advisor" && (
            <Advisor
              settings={settings}
              metrics={metrics}
              setActiveView={setActiveView}
              setTopicForScript={setTopic}
            />
          )}

          {activeView === "settings" && (
            <Settings
              settings={settings}
              setSettings={handleSaveSettings}
              instagramConnected={instagramConnected}
              username={username}
              authError={authError}
              connectInstagram={connectInstagram}
              disconnectInstagram={disconnectInstagram}
              isConnecting={isConnecting}
            />
          )}

          {activeView === "search" && <Search setActiveView={setActiveView} />}
          {activeView === "analytics" && (
            <Analytics setActiveView={setActiveView} />
          )}
          {activeView === "schedule" && (
            <Schedule setActiveView={setActiveView} />
          )}
        </div>
      </div>
    </div>
  );
}
