import { API_BASE_URL } from "./constants";
import type { TEvent } from "./types";

export async function fetchAllEvents(): Promise<TEvent[]> {
  const response = await fetch(`${API_BASE_URL}/events`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch events: ${response.status} ${response.statusText}`
    );
  }

  const data: TEvent[] = await response.json();
  return data;
}

export async function fetchEventById(id: number): Promise<TEvent> {
  const response = await fetch(`${API_BASE_URL}/events/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Event with id ${id} not found`);
    }
    throw new Error(
      `Failed to fetch event ${id}: ${response.status} ${response.statusText}`
    );
  }

  const data: TEvent = await response.json();
  return data;
}
