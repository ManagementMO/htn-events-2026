export const API_BASE_URL = "https://api.hackthenorth.com/v3";

export const AUTH_CREDENTIALS = {
  username: "hacker",
  password: "htn2026",
} as const;

export const EVENT_TYPE_LABELS: Record<string, string> = {
  workshop: "Workshop",
  activity: "Activity",
  tech_talk: "Tech Talk",
};

export const STORAGE_KEYS = {
  AUTH: "htn_auth",
  SORT_PREFERENCE: "htn_sort_pref",
} as const;
