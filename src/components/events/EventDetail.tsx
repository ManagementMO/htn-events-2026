"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  ExternalLink,
  Link2,
  Wrench,
  Mic2,
  Sparkles,
  Clock,
  Lock,
  Globe,
} from "lucide-react";
import { RelatedEventChip } from "./RelatedEventChip";
import { YouTubeEmbed } from "./YouTubeEmbed";
import { AddToCalendar } from "./AddToCalendar";
import { useEvent, useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/context/AuthContext";
import {
  formatEventDate,
  getEventDuration,
  formatDuration,
  getYouTubeEmbedUrl,
} from "@/lib/utils";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import type { TEvent, TEventType } from "@/lib/types";

const TYPE_ICONS: Record<TEventType, typeof Wrench> = {
  workshop: Wrench,
  tech_talk: Mic2,
  activity: Sparkles,
};

const TYPE_COLORS: Record<TEventType, string> = {
  workshop: "text-amber-400",
  tech_talk: "text-cyan-400",
  activity: "text-violet-400",
};

const TYPE_BG: Record<TEventType, string> = {
  workshop: "bg-amber-400/10 text-amber-400 border-amber-500/20",
  tech_talk: "bg-cyan-400/10 text-cyan-400 border-cyan-500/20",
  activity: "bg-violet-400/10 text-violet-400 border-violet-500/20",
};

const TYPE_BORDER_COLORS: Record<TEventType, string> = {
  workshop: "border-amber-500/20",
  tech_talk: "border-cyan-500/20",
  activity: "border-violet-500/20",
};

/** Cinematic event detail view with YouTube embed, calendar export, and deep data display. */
export function EventDetail({ eventId }: { eventId: number }) {
  const { data: event, isLoading, isError } = useEvent(eventId);
  const { data: allEvents } = useEvents();
  const { isAuthenticated } = useAuth();

  const relatedEvents = useMemo(() => {
    if (!event || !allEvents) return [];
    return event.related_events
      .map((id) => allEvents.find((e) => e.id === id))
      .filter((e): e is TEvent => {
        if (!e) return false;
        if (!isAuthenticated && e.permission === "private") return false;
        return true;
      });
  }, [event, allEvents, isAuthenticated]);

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (isError || !event) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        <h2 className="text-xl font-bold uppercase tracking-[0.15em] text-slate-100">
          Event Not Found
        </h2>
        <p className="text-sm text-slate-500">
          This event doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/20 hover:border-violet-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to events
        </Link>
      </div>
    );
  }

  const Icon = TYPE_ICONS[event.event_type];
  const iconColor = TYPE_COLORS[event.event_type];
  const borderColor = TYPE_BORDER_COLORS[event.event_type];
  const eventUrl = isAuthenticated ? event.private_url : event.public_url;
  const hasUrl = eventUrl && eventUrl.length > 0;
  const duration = getEventDuration(event.start_time, event.end_time);
  const hasYouTube = event.public_url ? !!getYouTubeEmbedUrl(event.public_url) : false;

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Back link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-[#111827] hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to events
      </Link>

      {/* Hero header */}
      <header className="relative mb-12 overflow-hidden rounded-2xl border border-[#111827] bg-[#0a0d1a]">
        <div className="flex flex-col sm:flex-row">
          {/* Large portrait */}
          <div className="relative aspect-square w-full flex-shrink-0 sm:aspect-[3/4] sm:w-56 md:w-64 lg:w-72">
            {event.speakers[0]?.profile_pic ? (
              <>
                <Image
                  src={event.speakers[0].profile_pic}
                  alt={event.speakers[0].name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 288px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0d1a]/80 hidden sm:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d1a] to-transparent sm:hidden" />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#05060f]">
                {event.speakers[0]?.name ? (
                  <span className={`text-6xl font-bold uppercase ${iconColor} opacity-40 md:text-7xl`}>
                    {event.speakers[0].name.charAt(0)}
                  </span>
                ) : (
                  <Icon
                    className={`h-20 w-20 ${iconColor} opacity-40 md:h-24 md:w-24`}
                    strokeWidth={0.8}
                    aria-hidden="true"
                  />
                )}
              </div>
            )}
          </div>

          {/* Event info */}
          <div className="flex flex-1 flex-col justify-center space-y-4 p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] ${TYPE_BG[event.event_type]}`}>
                <Icon className="h-3 w-3" aria-hidden="true" />
                {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e293b] bg-[#111827] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {formatDuration(duration)}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] ${
                event.permission === "public"
                  ? "border-emerald-500/20 bg-emerald-400/10 text-emerald-400"
                  : "border-orange-500/20 bg-orange-400/10 text-orange-400"
              }`}>
                {event.permission === "public" ? (
                  <Globe className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <Lock className="h-3 w-3" aria-hidden="true" />
                )}
                {event.permission}
              </span>
            </div>

            <h1 className="text-3xl font-bold uppercase tracking-[0.08em] text-slate-100 sm:text-4xl">
              {event.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <time>{formatEventDate(event.start_time, event.end_time)}</time>
              </div>
              {event.speakers.length > 0 && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span className="font-medium uppercase tracking-[0.1em] text-slate-300">
                    {event.speakers.map((s) => s.name).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* YouTube recording */}
          {hasYouTube && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              aria-label="Event recording"
            >
              <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Watch Recording
              </h2>
              <YouTubeEmbed url={event.public_url!} title={event.name} />
            </motion.section>
          )}

          {/* Description */}
          {event.description && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              aria-label="Event description"
            >
              <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                About This Event
              </h2>
              <div className={`rounded-xl border ${borderColor} bg-[#0a0d1a] p-6`}>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-400">
                  {event.description}
                </p>
              </div>
            </motion.section>
          )}

          {/* Actions: links + calendar */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            aria-label="Event actions"
          >
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <AddToCalendar event={event} />
              {hasUrl && (
                <a
                  href={eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl border border-[#111827] bg-[#0a0d1a] px-5 py-3.5 text-sm text-blue-400 transition-all hover:border-blue-500/30 hover:bg-[#0f1428] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <Link2 className="h-4 w-4" aria-hidden="true" />
                  {isAuthenticated ? "Hacker Link" : "Public Link"}
                  <ExternalLink className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                </a>
              )}
              {hasYouTube && (
                <a
                  href={event.public_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl border border-[#111827] bg-[#0a0d1a] px-5 py-3.5 text-sm text-red-400 transition-all hover:border-red-500/30 hover:bg-[#0f1428] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Watch on YouTube
                </a>
              )}
            </div>
          </motion.section>
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-8"
        >
          {/* Event details card */}
          <section aria-label="Event details">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Details
            </h2>
            <div className="rounded-xl border border-[#111827] bg-[#0a0d1a] p-5 space-y-4">
              <DetailRow icon={Calendar} label="Date" value={formatEventDate(event.start_time, event.end_time)} />
              <DetailRow icon={Clock} label="Duration" value={formatDuration(duration)} />
              <DetailRow
                icon={Icon}
                label="Type"
                value={EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
                valueColor={TYPE_COLORS[event.event_type]}
              />
              <DetailRow
                icon={event.permission === "public" ? Globe : Lock}
                label="Access"
                value={event.permission === "public" ? "Public" : "Hackers Only"}
                valueColor={event.permission === "public" ? "text-emerald-400" : "text-orange-400"}
              />
              {event.speakers.length > 0 && (
                <DetailRow
                  icon={User}
                  label={event.speakers.length === 1 ? "Speaker" : "Speakers"}
                  value={event.speakers.map((s) => s.name).join(", ")}
                />
              )}
              <DetailRow
                icon={Link2}
                label="Related"
                value={`${event.related_events.length} event${event.related_events.length !== 1 ? "s" : ""}`}
              />
            </div>
          </section>

          {/* Related events */}
          <section aria-label="Related events">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Related Events
            </h2>
            {relatedEvents.length > 0 ? (
              <div className="flex flex-col gap-3">
                {relatedEvents.map((related) => (
                  <RelatedEventChip key={related.id} event={related} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                No related events available.
              </p>
            )}
          </section>
        </motion.aside>
      </div>
    </motion.article>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueColor,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-600" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">{label}</p>
        <p className={`text-sm ${valueColor ?? "text-slate-300"}`}>{value}</p>
      </div>
    </div>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-8 w-32 rounded-full bg-[#111827]" />
      <div className="overflow-hidden rounded-2xl border border-[#111827] bg-[#0a0d1a]">
        <div className="flex flex-col sm:flex-row">
          <div className="aspect-square w-full flex-shrink-0 bg-[#111827] sm:aspect-[3/4] sm:w-56 md:w-64 lg:w-72" />
          <div className="flex-1 space-y-4 p-8 sm:p-10">
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-full bg-[#111827]" />
              <div className="h-6 w-16 rounded-full bg-[#111827]" />
              <div className="h-6 w-16 rounded-full bg-[#111827]" />
            </div>
            <div className="h-10 w-3/4 rounded bg-[#111827]" />
            <div className="h-4 w-1/2 rounded bg-[#111827]" />
          </div>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-3 w-32 rounded bg-[#111827]" />
          <div className="h-40 w-full rounded-xl bg-[#0a0d1a] border border-[#111827]" />
        </div>
        <div className="space-y-4">
          <div className="h-3 w-28 rounded bg-[#111827]" />
          <div className="h-48 w-full rounded-xl bg-[#0a0d1a] border border-[#111827]" />
        </div>
      </div>
    </div>
  );
}
