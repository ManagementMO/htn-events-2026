import { Suspense } from "react";
import { EventList } from "@/components/events/EventList";
import { EventStats } from "@/components/events/EventStats";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden border-b border-[#111827]/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="relative z-10 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500 sm:text-xs">
              Hack the North 2026
            </p>
            <h1 className="hero-streak mt-4 text-5xl font-bold uppercase tracking-[0.12em] text-slate-100 sm:text-6xl lg:text-7xl">
              Events
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-slate-500">
              Workshops, tech talks, and activities
            </p>
          </div>
        </div>

        {/* Subtle decorative gear outline */}
        <div
          className="pointer-events-none absolute right-[-5%] top-[10%] h-64 w-64 rounded-full border border-violet-500/[0.03] opacity-50 sm:h-96 sm:w-96"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-[-3%] bottom-[5%] h-48 w-48 rounded-full border border-cyan-500/[0.03] opacity-50 sm:h-72 sm:w-72"
          aria-hidden="true"
        />
      </section>

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
