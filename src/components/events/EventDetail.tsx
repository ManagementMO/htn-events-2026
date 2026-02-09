"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  ExternalLink,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RelatedEventChip } from "./RelatedEventChip";
import { Skeleton } from "@/components/ui/Skeleton";
import { useEvent, useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/context/AuthContext";
import { formatEventDate } from "@/lib/utils";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import type { TEvent } from "@/lib/types";

/** Full event detail view with related events. */
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
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-slate-100">
          Event not found
        </h2>
        <p className="text-sm text-slate-400">
          This event doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to events
        </Link>
      </div>
    );
  }

  const eventUrl = isAuthenticated ? event.private_url : event.public_url;
  const hasUrl = eventUrl && eventUrl.length > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition-colors hover:bg-[#1c2238] hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to events
      </Link>

      <header className="mb-8">
        <Badge variant={event.event_type}>
          {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
        </Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          {event.name}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <time>{formatEventDate(event.start_time, event.end_time)}</time>
          </div>

          {event.speakers.length > 0 && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>{event.speakers.map((s) => s.name).join(", ")}</span>
            </div>
          )}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {event.description && (
            <section aria-label="Event description">
              <h2 className="mb-3 text-lg font-semibold text-slate-200">
                About this event
              </h2>
              <div className="rounded-xl border border-[#1e293b] bg-[#141929] p-6">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
                  {event.description}
                </p>
              </div>
            </section>
          )}

          {hasUrl && (
            <section className="mt-6" aria-label="Event link">
              <h2 className="mb-3 text-lg font-semibold text-slate-200">
                Event Link
              </h2>
              <a
                href={eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#141929] px-4 py-3 text-sm text-blue-400 transition-all hover:border-blue-500/30 hover:bg-[#1c2238] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Link2 className="h-4 w-4" aria-hidden="true" />
                {isAuthenticated ? "Hacker Link" : "Public Link"}
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              </a>
            </section>
          )}
        </div>

        <aside>
          <section aria-label="Related events">
            <h2 className="mb-3 text-lg font-semibold text-slate-200">
              Related Events
            </h2>
            {relatedEvents.length > 0 ? (
              <div className="flex flex-col gap-2">
                {relatedEvents.map((related) => (
                  <RelatedEventChip key={related.id} event={related} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No related events available.
              </p>
            )}
          </section>
        </aside>
      </div>
    </motion.article>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <Skeleton className="mb-6 h-8 w-32" />
      <Skeleton className="mb-2 h-6 w-24" />
      <Skeleton className="mb-4 h-10 w-3/4" />
      <Skeleton className="mb-8 h-5 w-1/2" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
