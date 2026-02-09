import { Wrench, Mic2, Sparkles } from "lucide-react";
import type { TEventType } from "./types";

/** Centralized event-type visual configuration.
 *  Adding a new event type (e.g. "panel") only requires updating this file + types.ts. */

export const EVENT_TYPE_ICONS: Record<TEventType, typeof Wrench> = {
  workshop: Wrench,
  tech_talk: Mic2,
  activity: Sparkles,
};

export const EVENT_TYPE_COLORS: Record<TEventType, string> = {
  workshop: "text-amber-400",
  tech_talk: "text-cyan-400",
  activity: "text-violet-400",
};

export const EVENT_TYPE_BG_COLORS: Record<TEventType, string> = {
  workshop: "from-amber-900/30 to-transparent",
  tech_talk: "from-cyan-900/30 to-transparent",
  activity: "from-violet-900/30 to-transparent",
};
