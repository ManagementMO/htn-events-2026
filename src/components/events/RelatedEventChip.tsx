"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import type { TEvent } from "@/lib/types";

/** A compact chip linking to a related event. */
export function RelatedEventChip({ event }: { event: TEvent }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#141929] px-3 py-2 transition-all hover:border-[#2a3454] hover:bg-[#1c2238] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
    >
      <Badge variant={event.event_type}>
        {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
      </Badge>
      <span className="text-sm font-medium text-slate-300 transition-colors group-hover:text-slate-100">
        {event.name}
      </span>
    </Link>
  );
}
