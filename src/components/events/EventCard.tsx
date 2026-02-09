"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { formatEventDate, getEventDuration, formatDuration } from "@/lib/utils";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { EVENT_TYPE_ICONS, EVENT_TYPE_COLORS, EVENT_TYPE_BG_COLORS } from "@/lib/eventTypeConfig";
import type { TEvent } from "@/lib/types";

/** Endgame-style poster card — greyscale by default, colorizes on hover. */
export function EventCard({ event, index = 0 }: { event: TEvent; index?: number }) {
  const Icon = EVENT_TYPE_ICONS[event.event_type];
  const iconColor = EVENT_TYPE_COLORS[event.event_type];
  const profilePic = event.speakers[0]?.profile_pic;
  const speakerName = event.speakers[0]?.name;
  const duration = getEventDuration(event.start_time, event.end_time);

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/events/${event.id}`}
        className={`endgame-card endgame-card--${event.event_type} group block aspect-[3/4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060f]`}
        aria-label={`View details for ${event.name}`}
      >
        {/* Full-bleed background — greyscale default, color on hover */}
        <div className="absolute inset-0 z-0">
          {profilePic ? (
            <>
              <Image
                src={profilePic}
                alt={speakerName ?? "Speaker"}
                fill
                className="object-cover grayscale opacity-70 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Vignette overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060f] via-[#05060f]/40 to-[#05060f]/20 transition-opacity duration-700 group-hover:via-[#05060f]/20 group-hover:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
            </>
          ) : speakerName ? (
            <div className="flex h-full w-full items-center justify-center bg-[#0a0d1a]">
              <div className={`absolute inset-0 bg-gradient-to-b ${EVENT_TYPE_BG_COLORS[event.event_type]} opacity-0 transition-opacity duration-700 group-hover:opacity-100`} />
              <span className={`relative text-7xl font-bold uppercase ${iconColor} opacity-20 grayscale transition-all duration-700 group-hover:opacity-60 group-hover:grayscale-0 sm:text-8xl`}>
                {speakerName.charAt(0)}
              </span>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05060f] to-transparent" />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0a0d1a]">
              <div className={`absolute inset-0 bg-gradient-to-b ${EVENT_TYPE_BG_COLORS[event.event_type]} opacity-0 transition-opacity duration-700 group-hover:opacity-100`} />
              <Icon
                className={`relative h-24 w-24 sm:h-28 sm:w-28 ${iconColor} opacity-15 grayscale transition-all duration-700 group-hover:opacity-50 group-hover:grayscale-0`}
                strokeWidth={0.8}
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05060f] to-transparent" />
            </div>
          )}
        </div>

        {/* Foreground text overlay */}
        <div className="relative z-10 flex h-full flex-col justify-between p-5">
          {/* Top: Type badge + Duration */}
          <div className="flex items-start justify-between gap-2">
            <span className="inline-block rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 backdrop-blur-sm transition-colors duration-500 group-hover:text-slate-200">
              {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] text-slate-500 backdrop-blur-sm transition-colors duration-500 group-hover:text-slate-300">
              <Clock className="h-2.5 w-2.5" aria-hidden="true" />
              {formatDuration(duration)}
            </span>
          </div>

          {/* Bottom: Speaker, title, date */}
          <div className="space-y-1.5">
            {event.speakers.length > 0 && (
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-300 transition-colors duration-500 group-hover:text-white line-clamp-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {event.speakers.map((s) => s.name).join(", ")}
              </p>
            )}
            <h3 className="text-sm font-medium text-slate-400 transition-colors duration-500 group-hover:text-white line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {event.name}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 transition-colors duration-500 group-hover:text-slate-300">
              <Calendar className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              <time dateTime={new Date(event.start_time).toISOString()}>{formatEventDate(event.start_time, event.end_time)}</time>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
