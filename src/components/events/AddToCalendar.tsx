"use client";

import { CalendarPlus } from "lucide-react";
import { generateICSContent } from "@/lib/utils";
import type { TEvent } from "@/lib/types";

/** Downloads an .ics calendar file for the given event. */
export function AddToCalendar({ event }: { event: TEvent }) {
  const handleClick = () => {
    const icsContent = generateICSContent(event);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.name.replace(/[^a-zA-Z0-9]/g, "_")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2.5 rounded-xl border border-[#111827] bg-[#0a0d1a] px-5 py-3.5 text-sm text-slate-400 transition-all hover:border-violet-500/30 hover:bg-[#0f1428] hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
    >
      <CalendarPlus className="h-4 w-4" aria-hidden="true" />
      Add to Calendar
    </button>
  );
}
