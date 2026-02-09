import { format, isSameDay } from "date-fns";
import clsx from "clsx";
import type { TEvent, TEventType } from "./types";

/**
 * Formats an event's start and end timestamps into a human-readable string.
 * Example: "Jan 12, 2021 · 2:00 PM – 2:30 PM"
 * If the event spans multiple days: "Jan 12, 2021 2:00 PM – Jan 13, 2021 2:30 PM"
 */
export function formatEventDate(startTime: number, endTime: number): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isSameDay(start, end)) {
    const datePart = format(start, "MMM d, yyyy");
    const startTimePart = format(start, "h:mm a");
    const endTimePart = format(end, "h:mm a");
    return `${datePart} \u00B7 ${startTimePart} \u2013 ${endTimePart}`;
  }

  const startFormatted = format(start, "MMM d, yyyy h:mm a");
  const endFormatted = format(end, "MMM d, yyyy h:mm a");
  return `${startFormatted} \u2013 ${endFormatted}`;
}

/**
 * Returns Tailwind text color classes for a given event type.
 */
export function getEventTypeColor(type: TEventType): string {
  switch (type) {
    case "tech_talk":
      return "text-cyan-400";
    case "workshop":
      return "text-amber-400";
    case "activity":
      return "text-violet-400";
  }
}

/**
 * Returns Tailwind background color classes for a given event type.
 */
export function getEventTypeBgColor(type: TEventType): string {
  switch (type) {
    case "tech_talk":
      return "bg-cyan-400/10";
    case "workshop":
      return "bg-amber-400/10";
    case "activity":
      return "bg-violet-400/10";
  }
}

/**
 * Truncates text to a maximum length, appending an ellipsis if truncated.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Merges class names, filtering out falsy values.
 */
export function cn(
  ...inputs: (string | undefined | null | false)[]
): string {
  return clsx(...inputs);
}

/**
 * Calculates event duration in minutes from start and end timestamps.
 */
export function getEventDuration(startTime: number, endTime: number): number {
  return Math.round((endTime - startTime) / (1000 * 60));
}

/**
 * Formats duration in minutes to a human-readable string.
 * Examples: "30 min", "1h 30m", "2h"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Extracts a YouTube embed URL from a youtu.be or youtube.com link.
 * Returns null if the URL is not a valid YouTube link.
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  // Handle youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // Handle youtube.com/watch?v=VIDEO_ID
  const longMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
  return null;
}

/**
 * Generates an ICS calendar file content string for an event.
 */
export function generateICSContent(event: TEvent): string {
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const toICS = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

  const speakers = event.speakers.map((s) => s.name).join(", ");
  const description = [
    event.description ?? "",
    speakers ? `Speaker(s): ${speakers}` : "",
    event.public_url ? `Recording: ${event.public_url}` : "",
  ]
    .filter(Boolean)
    .join("\\n\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HTN Events//EN",
    "BEGIN:VEVENT",
    `DTSTART:${toICS(start)}`,
    `DTEND:${toICS(end)}`,
    `SUMMARY:${event.name}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Groups events by calendar day (formatted as "MMM d, yyyy").
 */
export function groupEventsByDay(events: TEvent[]): Map<string, TEvent[]> {
  const groups = new Map<string, TEvent[]>();
  for (const event of events) {
    const day = format(new Date(event.start_time), "EEEE, MMM d, yyyy");
    const existing = groups.get(day) ?? [];
    existing.push(event);
    groups.set(day, existing);
  }
  return groups;
}
