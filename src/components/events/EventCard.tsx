"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatEventDate, truncateText } from "@/lib/utils";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import type { TEvent } from "@/lib/types";

/** A card displaying an event summary, linking to the event detail page. */
export function EventCard({ event, index = 0 }: { event: TEvent; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link
        href={`/events/${event.id}`}
        className="group block h-full rounded-xl border border-[#1e293b] bg-[#141929] p-5 transition-all duration-300 hover:border-[#2a3454] hover:bg-[#1c2238] hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
        aria-label={`View details for ${event.name}`}
      >
        <div className="flex items-start justify-between gap-3">
          <Badge variant={event.event_type}>
            {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
          </Badge>
          <ExternalLink
            className="h-4 w-4 flex-shrink-0 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-3 text-lg font-semibold text-slate-100 transition-colors group-hover:text-blue-400 line-clamp-2">
          {event.name}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <time>{formatEventDate(event.start_time, event.end_time)}</time>
        </div>

        {event.description && (
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {truncateText(event.description, 120)}
          </p>
        )}

        {event.speakers.length > 0 && (
          <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
            <User className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{event.speakers.map((s) => s.name).join(", ")}</span>
          </div>
        )}
      </Link>
    </motion.article>
  );
}
