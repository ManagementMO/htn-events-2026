"use client";

import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

/** Base skeleton element. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={clsx("animate-pulse rounded-lg bg-[#111827]", className)} />
  );
}

/** Endgame portrait card skeleton with streak shimmer. */
export function SkeletonCard() {
  return (
    <div className="skeleton-streak aspect-[3/4] rounded-2xl border border-[#111827] bg-[#0a0d1a]">
      <div className="flex h-full flex-col justify-between p-5">
        <Skeleton className="h-3 w-16" />
        <div className="flex flex-1 items-center justify-center">
          <Skeleton className="h-20 w-20 rounded-2xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
      </div>
    </div>
  );
}
