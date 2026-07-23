import { STORAGE_KEYS, DEFAULT_SETTINGS } from "../constants";

export const getOnboardingStatus = () => {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === "true";
};

export const setOnboardingStatus = (status) => {
  localStorage.setItem(STORAGE_KEYS.ONBOARDED, status.toString());
};

export const getSettings = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
};

export const saveSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getScriptHistory = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.SCRIPT_HISTORY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse script history:", e);
    }
  }
  return [];
};

export const saveScriptHistory = (history) => {
  localStorage.setItem(STORAGE_KEYS.SCRIPT_HISTORY, JSON.stringify(history));
};
