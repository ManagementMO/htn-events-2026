"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  Mic2,
  Sparkles,
  Clock,
  Users,
  Calendar,
  Globe,
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/context/AuthContext";
import { getEventDuration, formatDuration } from "@/lib/utils";

interface StatCardProps {
  icon: typeof Clock;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}

function StatCard({ icon: Icon, label, value, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 rounded-xl border border-[#111827] bg-[#0a0d1a] px-4 py-3"
    >
      <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-lg font-bold text-slate-100 leading-tight">{value}</p>
        <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}

/** API-driven statistics dashboard showing deep data insights. */
export function EventStats() {
  const { data: events } = useEvents();
  const { isAuthenticated } = useAuth();

  const stats = useMemo(() => {
    if (!events) return null;

    const visible = isAuthenticated
      ? events
      : events.filter((e) => e.permission !== "private");

    const workshops = visible.filter((e) => e.event_type === "workshop");
    const techTalks = visible.filter((e) => e.event_type === "tech_talk");
    const activities = visible.filter((e) => e.event_type === "activity");

    const durations = visible.map((e) => getEventDuration(e.start_time, e.end_time));
    const totalMinutes = durations.reduce((a, b) => a + b, 0);

    const speakers = new Set<string>();
    visible.forEach((e) => e.speakers.forEach((s) => speakers.add(s.name)));

    const withRecording = visible.filter((e) => e.public_url && e.public_url.length > 0);
    const publicCount = visible.filter((e) => e.permission === "public").length;
    const privateCount = visible.filter((e) => e.permission === "private").length;

    // Compute date clusters
    const days = new Set<string>();
    visible.forEach((e) => {
      const d = new Date(e.start_time);
      days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });

    return {
      total: visible.length,
      workshops: workshops.length,
      techTalks: techTalks.length,
      activities: activities.length,
      totalDuration: formatDuration(totalMinutes),
      avgDuration: formatDuration(visible.length > 0 ? Math.round(totalMinutes / visible.length) : 0),
      speakers: speakers.size,
      withRecording: withRecording.length,
      publicCount,
      privateCount,
      days: days.size,
    };
  }, [events, isAuthenticated]);

  if (!stats) return null;

  return (
    <section aria-label="Event statistics">
      <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        At a Glance
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard icon={Calendar} label="Total Events" value={stats.total} color="text-violet-400" delay={0} />
        <StatCard icon={Wrench} label="Workshops" value={stats.workshops} color="text-amber-400" delay={0.05} />
        <StatCard icon={Mic2} label="Tech Talks" value={stats.techTalks} color="text-cyan-400" delay={0.1} />
        <StatCard icon={Sparkles} label="Activities" value={stats.activities} color="text-violet-400" delay={0.15} />
        <StatCard icon={Clock} label="Total Duration" value={stats.totalDuration} color="text-emerald-400" delay={0.2} />
        <StatCard icon={Clock} label="Avg Duration" value={stats.avgDuration} color="text-emerald-400" delay={0.25} />
        <StatCard icon={Users} label="Speakers" value={stats.speakers} color="text-blue-400" delay={0.3} />
        <StatCard icon={Globe} label="With Recording" value={stats.withRecording} color="text-rose-400" delay={0.35} />
      </div>
    </section>
  );
}
