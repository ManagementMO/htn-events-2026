"use client";

import { Search, X } from "lucide-react";
import type { TEventType } from "@/lib/types";

const EVENT_TYPES: Array<{ value: TEventType | "all"; label: string }> = [
  { value: "all", label: "All Events" },
  { value: "workshop", label: "Workshops" },
  { value: "tech_talk", label: "Tech Talks" },
  { value: "activity", label: "Activities" },
];

const TYPE_COLORS: Record<string, string> = {
  all: "bg-blue-500/15 text-blue-400 border-blue-500/25 hover:bg-blue-500/25",
  workshop: "bg-amber-500/15 text-amber-400 border-amber-500/25 hover:bg-amber-500/25",
  tech_talk: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25 hover:bg-cyan-500/25",
  activity: "bg-violet-500/15 text-violet-400 border-violet-500/25 hover:bg-violet-500/25",
};

const TYPE_COLORS_ACTIVE: Record<string, string> = {
  all: "bg-blue-500 text-white border-blue-500",
  workshop: "bg-amber-500 text-white border-amber-500",
  tech_talk: "bg-cyan-500 text-white border-cyan-500",
  activity: "bg-violet-500 text-white border-violet-500",
};

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: TEventType | "all";
  onFilterChange: (filter: TEventType | "all") => void;
}

/** Search bar and event type filter chips. */
export function EventFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: EventFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <label htmlFor="event-search" className="sr-only">
          Search events
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
        <input
          id="event-search"
          type="search"
          placeholder="Search events by name or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-[#1e293b] bg-[#141929] py-3 pl-11 pr-10 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search events by name or description"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by event type">
        {EVENT_TYPES.map(({ value, label }) => {
          const isActive = activeFilter === value;
          return (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a] ${
                isActive ? TYPE_COLORS_ACTIVE[value] : TYPE_COLORS[value]
              }`}
              aria-pressed={isActive}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
