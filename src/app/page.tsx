import { PageContainer } from "@/components/layout/PageContainer";
import { EventList } from "@/components/events/EventList";

export default function HomePage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          Events
        </h1>
        <p className="mt-2 text-lg text-slate-400">
          Browse workshops, tech talks, and activities at Hack the North 2026.
        </p>
      </div>
      <EventList />
    </PageContainer>
  );
}
