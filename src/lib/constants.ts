export const API_BASE_URL = "https://api.hackthenorth.com/v3";

// Intentionally hardcoded — demo-only credentials per the HTN challenge spec
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
} as const;

export const SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "name", label: "Name" },
  { value: "duration", label: "Duration" },
  { value: "type", label: "Type" },
] as const;
