"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarX } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { getEventDuration } from "@/lib/utils";
import { EventCard } from "./EventCard";
import { EventFilters } from "./EventFilters";
import { ScheduleView } from "./ScheduleView";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import type { TEventType, TSortOption, TViewMode } from "@/lib/types";

/** Main event listing with sort, filter, search, and dual view modes. */
export function EventList() {
  const { data: events, isLoading, isError } = useEvents();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Hydrate state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [activeFilter, setActiveFilter] = useState<TEventType | "all">(
    (searchParams.get("type") as TEventType | "all") || "all"
  );
  const [sortBy, setSortBy] = useState<TSortOption>(
    (searchParams.get("sort") as TSortOption) || "date"
  );
  const [viewMode, setViewMode] = useState<TViewMode>(
    (searchParams.get("view") as TViewMode) || "grid"
  );
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Sync state to URL params
  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "date" && value !== "grid" && value !== "") {
          current.set(key, value);
        } else {
          current.delete(key);
        }
      });
      const qs = current.toString();
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [searchParams, router]
  );

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    updateURL({ q });
  };
  const handleFilterChange = (f: TEventType | "all") => {
    setActiveFilter(f);
    updateURL({ type: f });
  };
  const handleSortChange = (s: TSortOption) => {
    setSortBy(s);
    updateURL({ sort: s });
  };
  const handleViewChange = (v: TViewMode) => {
    setViewMode(v);
    updateURL({ view: v });
  };

  // Visible events (auth-gated)
  const visibleEvents = useMemo(() => {
    if (!events) return [];
    return isAuthenticated
      ? events
      : events.filter((e) => e.permission !== "private");
  }, [events, isAuthenticated]);

  // Count badges per type
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: visibleEvents.length };
    for (const e of visibleEvents) {
      c[e.event_type] = (c[e.event_type] ?? 0) + 1;
    }
    return c;
  }, [visibleEvents]);

  // Filtered + sorted
  const filteredEvents = useMemo(() => {
    return visibleEvents
      .filter((event) => {
        if (activeFilter === "all") return true;
        return event.event_type === activeFilter;
      })
      .filter((event) => {
        if (!debouncedSearch) return true;
        const query = debouncedSearch.toLowerCase();
        const nameMatch = event.name.toLowerCase().includes(query);
        const descMatch = event.description?.toLowerCase().includes(query) ?? false;
        const speakerMatch = event.speakers.some((s) =>
          s.name.toLowerCase().includes(query)
        );
        return nameMatch || descMatch || speakerMatch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "duration":
            return (
              getEventDuration(b.start_time, b.end_time) -
              getEventDuration(a.start_time, a.end_time)
            );
          case "type":
            return a.event_type.localeCompare(b.event_type) || a.start_time - b.start_time;
          case "date":
          default:
            return a.start_time - b.start_time;
        }
      });
  }, [visibleEvents, activeFilter, debouncedSearch, sortBy]);

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/10 bg-red-500/5 p-12 text-center"
      >
        <CalendarX className="h-12 w-12 text-red-400/50" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-slate-200">
            Failed to Load Events
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Please check your connection and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <section aria-label="Event listing">
        <EventFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={handleViewChange}
          counts={counts}
        />

        <div className="mt-6" aria-live="polite" aria-atomic="true">
          {isLoading ? (
            <div className="sr-only">Loading events...</div>
          ) : (
            <div className="sr-only">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-16 flex flex-col items-center justify-center gap-4 text-center"
          >
            <div className="rounded-2xl border border-[#111827] bg-[#0a0d1a] p-6">
              <CalendarX className="h-10 w-10 text-slate-700" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400">
                No Events Found
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {debouncedSearch
                  ? `No events match "${debouncedSearch}".`
                  : "No events match the current filters."}
              </p>
            </div>
          </motion.div>
        ) : viewMode === "schedule" ? (
          <ScheduleView events={filteredEvents} />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </ErrorBoundary>
  );
}
