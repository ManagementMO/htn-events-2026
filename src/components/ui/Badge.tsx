"use client";

import clsx from "clsx";

interface BadgeProps {
  variant: "workshop" | "tech_talk" | "activity";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  workshop: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  tech_talk: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25",
  activity: "bg-violet-500/15 text-violet-400 border border-violet-500/25",
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
