import { Suspense } from "react";
import { EventList } from "@/components/events/EventList";
import { EventStats } from "@/components/events/EventStats";
import { Hero } from "@/components/layout/Hero";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Stats Dashboard */}
        <EventStats />

        {/* Event Grid / Schedule */}
        <Suspense fallback={<div className="text-center text-sm text-slate-500 py-12">Loading events...</div>}>
          <EventList />
        </Suspense>
      </main>
    </>
  );
}
