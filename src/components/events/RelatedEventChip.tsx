"use client";

import Link from "next/link";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { EVENT_TYPE_ICONS } from "@/lib/eventTypeConfig";
import type { TEvent, TEventType } from "@/lib/types";

const CHIP_COLORS: Record<TEventType, string> = {
  workshop: "text-amber-400/60 group-hover:text-amber-400",
  tech_talk: "text-cyan-400/60 group-hover:text-cyan-400",
  activity: "text-violet-400/60 group-hover:text-violet-400",
};

const TYPE_BORDERS: Record<TEventType, string> = {
  workshop: "border-amber-500/10 hover:border-amber-500/25",
  tech_talk: "border-cyan-500/10 hover:border-cyan-500/25",
  activity: "border-violet-500/10 hover:border-violet-500/25",
};

/** Mini Endgame-style chip for related events. */
export function RelatedEventChip({ event }: { event: TEvent }) {
  const Icon = EVENT_TYPE_ICONS[event.event_type];

  return (
    <Link
      href={`/events/${event.id}`}
      className={`group flex items-center gap-3 rounded-xl border bg-[#0a0d1a] px-4 py-3 transition-all hover:bg-[#0f1428] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060f] ${TYPE_BORDERS[event.event_type]}`}
    >
      <Icon
        className={`h-4 w-4 flex-shrink-0 transition-colors ${CHIP_COLORS[event.event_type]}`}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500">
          {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
        </p>
        <p className="truncate text-sm font-medium text-slate-400 transition-colors group-hover:text-slate-200">
          {event.name}
        </p>
      </div>
    </Link>
  );
}
