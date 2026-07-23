// App Constants
export const STORAGE_KEYS = {
  ONBOARDED: "scalematrix_onboarded",
  SETTINGS: "scalematrix_settings",
  SCRIPT_HISTORY: "scalematrix_script_history",
};

export const DEFAULT_SETTINGS = {
  composioApiKey: "",
  ollamaUrl: "http://localhost:11434",
  ollamaModel: "llama3.1",
};

export const DEFAULT_METRICS = {
  platforms: {},
  topPerforming: [],
  growthScore: 80,
  growthOpportunities: [],
};

export const TIME_OPTIONS = [
  { label: "This week", value: "this_week" },
  { label: "Last week", value: "last_week" },
  { label: "This month", value: "this_month" },
  { label: "Last month", value: "last_month" },
  { label: "Last 3 months", value: "last_3_months" },
  { label: "This year", value: "this_year" },
];

export const PROVINCES = [
  {
    name: "Province1",
    value: 85,
    nepaliName: "कोशी प्रदेश (Province 1)",
    reach: "1.2M reached",
    growth: "+12.3%",
  },
  {
    name: "Province2",
    value: 45,
    nepaliName: "मधेश प्रदेश (Province 2)",
    reach: "680K reached",
    growth: "-2.1%",
  },
  {
    name: "Province3",
    value: 95,
    nepaliName: "बागमती प्रदेश (Province 3)",
    reach: "2.4M reached",
    growth: "+24.6%",
  },
  {
    name: "Province4",
    value: 70,
    nepaliName: "गण्डकी प्रदेश (Province 4)",
    reach: "920K reached",
    growth: "+8.4%",
  },
  {
    name: "Province5",
    value: 60,
    nepaliName: "लुम्बिनी प्रदेश (Province 5)",
    reach: "810K reached",
    growth: "+4.2%",
  },
  {
    name: "Province6",
    value: 30,
    nepaliName: "कर्णाली प्रदेश (Province 6)",
    reach: "210K reached",
    growth: "+1.5%",
  },
  {
    name: "Province7",
    value: 40,
    nepaliName: "सुदूरपश्चिम प्रदेश (Province 7)",
    reach: "340K reached",
    growth: "+3.8%",
  },
];

export const AGE_DEMOGRAPHICS = [
  { label: "18–25", male: 18, female: 32, other: 50, total: 2983, pct: "24%" },
  { label: "26–35", male: 60, female: 8, other: 32, total: 3729, pct: "30%" },
  { label: "36+", male: 61, female: 33, other: 6, total: 3232, pct: "26%" },
];
