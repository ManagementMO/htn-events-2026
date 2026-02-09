"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarX } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { EventCard } from "./EventCard";
import { EventFilters } from "./EventFilters";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import type { TEventType } from "@/lib/types";

/** Main event listing with search, filters, and auth-gated visibility. */
export function EventList() {
  const { data: events, isLoading, isError } = useEvents();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<TEventType | "all">("all");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events
      .filter((event) => {
        // Auth gating: hide private events when logged out
        if (!isAuthenticated && event.permission === "private") return false;
        return true;
      })
      .filter((event) => {
        // Type filter
        if (activeFilter === "all") return true;
        return event.event_type === activeFilter;
      })
      .filter((event) => {
        // Search filter
        if (!debouncedSearch) return true;
        const query = debouncedSearch.toLowerCase();
        const nameMatch = event.name.toLowerCase().includes(query);
        const descMatch = event.description?.toLowerCase().includes(query) ?? false;
        return nameMatch || descMatch;
      })
      .sort((a, b) => a.start_time - b.start_time);
  }, [events, isAuthenticated, activeFilter, debouncedSearch]);

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-12 text-center"
      >
        <CalendarX className="h-12 w-12 text-red-400" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Failed to load events
          </h2>
          <p className="mt-1 text-sm text-slate-400">
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
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
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
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 text-center"
          >
            <div className="rounded-full bg-[#1c2238] p-4">
              <CalendarX className="h-8 w-8 text-slate-500" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-300">
                No events found
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {debouncedSearch
                  ? `No events match "${debouncedSearch}". Try a different search term.`
                  : "No events match the current filters."}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
