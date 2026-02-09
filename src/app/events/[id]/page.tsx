"use client";

import { use } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { EventDetail } from "@/components/events/EventDetail";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const eventId = parseInt(id, 10);

  if (isNaN(eventId)) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <h1 className="text-xl font-semibold text-slate-100">
            Invalid event ID
          </h1>
          <p className="text-sm text-slate-400">
            Please check the URL and try again.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <EventDetail eventId={eventId} />
    </PageContainer>
  );
}
