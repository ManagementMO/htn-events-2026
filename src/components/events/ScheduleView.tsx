"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { groupEventsByDay, getEventDuration, formatDuration } from "@/lib/utils";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { EVENT_TYPE_ICONS, EVENT_TYPE_COLORS } from "@/lib/eventTypeConfig";
import { getEventBrandVisual } from "@/lib/brandVisuals";
import type { TEvent, TEventType } from "@/lib/types";

const TYPE_BORDER_COLORS: Record<TEventType, string> = {
  workshop: "border-l-amber-500/40",
  tech_talk: "border-l-cyan-500/40",
  activity: "border-l-violet-500/40",
};

/** Timeline schedule view — events grouped by day with time slots. */
export function ScheduleView({ events }: { events: TEvent[] }) {
  const grouped = groupEventsByDay(events);

  if (events.length === 0) return null;

  return (
    <div className="mt-8 space-y-8">
      {Array.from(grouped.entries()).map(([day, dayEvents], groupIndex) => (
        <motion.section
          key={day}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1, duration: 0.4 }}
          aria-label={`Events on ${day}`}
        >
          <h3 className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-300">
            <span className="h-px flex-1 bg-[#111827]" />
            {day}
            <span className="rounded-full bg-[#111827] px-2.5 py-0.5 text-[10px] text-slate-500">
              {dayEvents.length}
            </span>
            <span className="h-px flex-1 bg-[#111827]" />
          </h3>

          <div className="space-y-2">
            {dayEvents
              .sort((a, b) => a.start_time - b.start_time)
              .map((event) => {
                const Icon = EVENT_TYPE_ICONS[event.event_type];
                const duration = getEventDuration(event.start_time, event.end_time);
                // Reuse the same brand-fallback resolver as cards/details for consistent thumbnails.
                const brandVisual = getEventBrandVisual(event);
                const profilePic = event.speakers[0]?.profile_pic;

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className={`group flex items-stretch gap-0 rounded-xl border border-[#111827] border-l-2 ${TYPE_BORDER_COLORS[event.event_type]} bg-[#0a0d1a] transition-all hover:bg-[#0f1428] hover:border-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500`}
                  >
                    {/* Time column */}
                    <time
                      dateTime={new Date(event.start_time).toISOString()}
                      className="flex w-24 flex-shrink-0 flex-col items-center justify-center border-r border-[#111827]/50 px-3 py-4 text-center"
                    >
                      <span className="text-sm font-bold text-slate-200">
                        {format(new Date(event.start_time), "h:mm")}
                      </span>
                      <span className="text-[10px] uppercase text-slate-500">
                        {format(new Date(event.start_time), "a")}
                      </span>
                    </time>

                    {/* Speaker thumbnail */}
                    {(brandVisual || profilePic) && (
                      <div className="relative hidden w-16 flex-shrink-0 sm:block">
                        {brandVisual ? (
                          <div className={`flex h-full w-full items-center justify-center border-r border-[#111827]/50 ${brandVisual.className}`}>
                            <Image
                              src={brandVisual.src}
                              alt={brandVisual.alt}
                              width={32}
                              height={32}
                              className="h-8 w-8 object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.4)]"
                            />
                          </div>
                        ) : (
                          <Image
                            src={profilePic!}
                            alt={event.speakers[0]?.name ?? "Speaker"}
                            fill
                            className="object-cover opacity-70 transition-opacity group-hover:opacity-100"
                            sizes="64px"
                          />
                        )}
                        {!brandVisual && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0d1a]/50" />
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-1 items-center gap-4 px-4 py-4">
                      <Icon
                        className={`hidden h-5 w-5 flex-shrink-0 sm:block ${EVENT_TYPE_COLORS[event.event_type]} opacity-50`}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-200 transition-colors group-hover:text-white line-clamp-1">
                          {event.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                          <span className={`font-medium uppercase tracking-wider ${EVENT_TYPE_COLORS[event.event_type]}`}>
                            {EVENT_TYPE_LABELS[event.event_type]}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {formatDuration(duration)}
                          </span>
                          {event.speakers.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" aria-hidden="true" />
                              {event.speakers.map((s) => s.name).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
