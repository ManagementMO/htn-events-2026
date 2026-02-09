import { format, isSameDay } from "date-fns";
import clsx from "clsx";
import type { TEventType } from "./types";

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
