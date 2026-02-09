"use client";

import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={clsx("animate-pulse bg-[#1c2238] rounded-lg", className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[#141929] border border-[#1e293b] rounded-xl overflow-hidden">
      <div className="p-5 space-y-4">
        {/* Badge */}
        <Skeleton className="h-3 w-20" />
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        {/* Date */}
        <Skeleton className="h-4 w-1/2" />
        {/* Description lines */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        {/* Speaker */}
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
