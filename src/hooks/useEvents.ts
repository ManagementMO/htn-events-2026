"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAllEvents, fetchEventById } from "@/lib/api";
import type { TEvent } from "@/lib/types";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export function useEvents() {
  return useQuery<TEvent[]>({
    queryKey: ["events"],
    queryFn: fetchAllEvents,
    staleTime: FIVE_MINUTES_MS,
  });
}

export function useEvent(id: number) {
  return useQuery<TEvent>({
    queryKey: ["events", id],
    queryFn: () => fetchEventById(id),
    enabled: !!id,
  });
}
