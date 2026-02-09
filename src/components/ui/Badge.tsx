"use client";

import clsx from "clsx";

interface BadgeProps {
  variant: "workshop" | "tech_talk" | "activity";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  workshop: "text-amber-400/80 border-amber-500/20",
  tech_talk: "text-cyan-400/80 border-cyan-500/20",
  activity: "text-violet-400/80 border-violet-500/20",
};

/** Minimal Endgame-style badge — uppercase, tracked, faintly glowing. */
export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border bg-transparent px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em]",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
