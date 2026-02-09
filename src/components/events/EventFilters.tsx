"use client";

import { Search, X, ArrowUpDown, LayoutGrid, List } from "lucide-react";
import type { TEventType, TSortOption, TViewMode } from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/constants";

const EVENT_TYPES: Array<{ value: TEventType | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "workshop", label: "Workshops" },
  { value: "tech_talk", label: "Tech Talks" },
  { value: "activity", label: "Activities" },
];

const TYPE_COLORS: Record<string, string> = {
  all: "border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300",
  workshop: "border-amber-500/20 text-amber-400/70 hover:border-amber-500/40 hover:text-amber-400",
  tech_talk: "border-cyan-500/20 text-cyan-400/70 hover:border-cyan-500/40 hover:text-cyan-400",
  activity: "border-violet-500/20 text-violet-400/70 hover:border-violet-500/40 hover:text-violet-400",
};

const TYPE_COLORS_ACTIVE: Record<string, string> = {
  all: "border-slate-500 bg-slate-500/10 text-slate-200",
  workshop: "border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]",
  tech_talk: "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.1)]",
  activity: "border-violet-500/50 bg-violet-500/10 text-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.1)]",
};

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: TEventType | "all";
  onFilterChange: (filter: TEventType | "all") => void;
  sortBy: TSortOption;
  onSortChange: (sort: TSortOption) => void;
  viewMode: TViewMode;
  onViewModeChange: (mode: TViewMode) => void;
  counts?: Record<string, number>;
}

/** Endgame-styled search bar, filter chips with counts, sort, and view toggle. */
export function EventFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  counts,
}: EventFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="event-search" className="sr-only">
          Search events
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600"
          aria-hidden="true"
        />
        <input
          id="event-search"
          type="search"
          placeholder="Search events by name, description, or speaker..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-[#111827] bg-[#0a0d1a] py-3 pl-11 pr-10 text-sm text-slate-200 placeholder:text-slate-600 transition-all focus:border-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:shadow-[0_0_20px_rgba(139,92,246,0.08)]"
          aria-label="Search events by name, description, or speaker"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-600 transition-colors hover:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter chips with count badges */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by event type">
          {EVENT_TYPES.map(({ value, label }) => {
            const isActive = activeFilter === value;
            const count = counts?.[value];
            return (
              <button
                key={value}
                onClick={() => onFilterChange(value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.1em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060f] ${
                  isActive ? TYPE_COLORS_ACTIVE[value] : TYPE_COLORS[value]
                }`}
                aria-pressed={isActive}
              >
                {label}
                {count !== undefined && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                    isActive ? "bg-white/10" : "bg-white/5"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort + View toggle */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <label htmlFor="sort-select" className="sr-only">
              Sort events
            </label>
            <ArrowUpDown
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as TSortOption)}
              className="appearance-none rounded-lg border border-[#111827] bg-[#0a0d1a] py-2 pl-9 pr-8 text-xs uppercase tracking-wider text-slate-400 transition-all hover:border-slate-700 focus:border-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-lg border border-[#111827] overflow-hidden" role="group" aria-label="View mode">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                viewMode === "grid"
                  ? "bg-violet-500/10 text-violet-400"
                  : "bg-[#0a0d1a] text-slate-600 hover:text-slate-400"
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("schedule")}
              className={`p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                viewMode === "schedule"
                  ? "bg-violet-500/10 text-violet-400"
                  : "bg-[#0a0d1a] text-slate-600 hover:text-slate-400"
              }`}
              aria-label="Schedule view"
              aria-pressed={viewMode === "schedule"}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
