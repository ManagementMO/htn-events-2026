"use client";

import { MotionConfig } from "framer-motion";

/** Wraps the app with Framer Motion's reducedMotion="user" so
 *  all motion animations respect the OS prefers-reduced-motion setting. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
