import React from "react";
import Dashboard from "./Dashboard";

export default function Home({
  metrics,
  settings,
  setActiveView,
  setTopicForScript,
  instagramConnected,
  username,
  connectInstagram,
  disconnectInstagram,
  isConnecting,
  ollamaConnected,
  isSyncing,
  syncData,
  mediaPosts,
  igInsights,
  onOpenNotifications,
  isNotificationsOpen,
}) {
  return (
    <Dashboard
      metrics={metrics}
      settings={settings}
      setActiveView={setActiveView}
      setTopicForScript={setTopicForScript}
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
      onOpenNotifications={onOpenNotifications}
      isNotificationsOpen={isNotificationsOpen}
    />
  );
}
