"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/* ─── constants ─── */
const PARTICLE_COLORS = [
  "rgba(255,255,255,0.25)",
  "rgba(34,211,238,0.3)",
  "rgba(167,139,250,0.3)",
  "rgba(255,255,255,0.2)",
  "rgba(34,211,238,0.25)",
  "rgba(167,139,250,0.25)",
  "rgba(255,255,255,0.3)",
  "rgba(34,211,238,0.2)",
  "rgba(167,139,250,0.2)",
  "rgba(255,255,255,0.25)",
];

/* Deterministic particle positions so SSR matches client */
const PARTICLE_SEEDS = [
  { left: 12, delay: 0, dur: 28, size: 2 },
  { left: 25, delay: 4, dur: 32, size: 3 },
  { left: 38, delay: 8, dur: 26, size: 2 },
  { left: 52, delay: 2, dur: 34, size: 2 },
  { left: 65, delay: 6, dur: 30, size: 3 },
  { left: 78, delay: 10, dur: 28, size: 2 },
  { left: 88, delay: 3, dur: 33, size: 2 },
  { left: 8, delay: 7, dur: 29, size: 3 },
  { left: 45, delay: 5, dur: 31, size: 2 },
  { left: 72, delay: 9, dur: 27, size: 2 },
];

export function Hero() {
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ─── parallax ─── */
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const noMotion = !!prefersReduced;
  const particleCount = isMobile ? 5 : 10;

  /* ─── animation timing ─── */
  const lineDelay = 0.15;
  const line1Delay = 0.2;
  const line2Delay = line1Delay + lineDelay;
  const line3Delay = line2Delay + lineDelay;
  const dividerDelay = line3Delay + 0.3;
  const descriptorDelay = dividerDelay + 0.3;
  const slideIn = { type: "spring" as const, damping: 22, stiffness: 100 };

  const particles = useMemo(
    () => PARTICLE_SEEDS.slice(0, particleCount),
    [particleCount],
  );

  return (
    <section
      ref={heroRef}
      className="hero-gradient relative overflow-hidden border-b border-[#111827]/30"
      aria-label="Hero"
    >
      {/* ───────── Background orbs ───────── */}
      <div className="hero-orb hero-orb--purple pointer-events-none absolute" aria-hidden="true" />
      <div className="hero-orb hero-orb--cyan pointer-events-none absolute" aria-hidden="true" />

      {/* ───────── Dot-grid texture ───────── */}
      <div className="hero-dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* ───────── Particles ───────── */}
      {!noMotion &&
        particles.map((p, i) => (
          <span
            key={i}
            className="hero-particle pointer-events-none absolute"
            aria-hidden="true"
            style={{
              left: `${p.left}%`,
              bottom: "-4%",
              width: p.size,
              height: p.size,
              background: PARTICLE_COLORS[i],
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}

      {/* ───────── Hero content ───────── */}
      <motion.div
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
        style={noMotion ? undefined : { y: heroY, opacity: heroOpacity }}
      >
        <div className="relative z-10 text-center">
              {/* ── Line 1: "HACK THE NORTH" ── */}
              <motion.div
                className="overflow-hidden"
                initial={noMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={noMotion ? { duration: 0 } : { duration: 0.01, delay: line1Delay }}
              >
                <motion.p
                  className="text-lg font-bold uppercase tracking-[0.25em] text-slate-400 sm:text-xl lg:text-2xl"
                  initial={noMotion ? false : { y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={noMotion ? { duration: 0 } : { ...slideIn, delay: line1Delay }}
                >
                  Hack the North
                </motion.p>
              </motion.div>

              {/* ── Line 2: "EVENTS" ── */}
              <motion.div
                className="overflow-hidden"
                initial={noMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={noMotion ? { duration: 0 } : { duration: 0.01, delay: line2Delay }}
              >
                <motion.p
                  className="hero-gradient-text -mt-1 text-4xl font-black uppercase leading-none tracking-[0.08em] sm:-mt-1 sm:text-5xl lg:text-6xl"
                  initial={noMotion ? false : { y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={noMotion ? { duration: 0 } : { ...slideIn, delay: line2Delay }}
                >
                  Events
                </motion.p>
              </motion.div>

              {/* ── Line 3: "PAGE" ── */}
              <motion.div
                className="overflow-hidden"
                initial={noMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={noMotion ? { duration: 0 } : { duration: 0.01, delay: line3Delay }}
              >
                <motion.p
                  className="hero-gradient-text -mt-0.5 text-4xl font-black uppercase leading-none tracking-[0.08em] sm:-mt-1 sm:text-5xl lg:text-6xl"
                  initial={noMotion ? false : { y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={noMotion ? { duration: 0 } : { ...slideIn, delay: line3Delay }}
                >
                  Page
                </motion.p>
              </motion.div>

              {/* ── Glowing divider ── */}
              <motion.div
                className="hero-divider mx-auto mt-4 sm:mt-5"
                initial={noMotion ? false : { scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={
                  noMotion
                    ? { duration: 0 }
                    : { duration: 0.8, delay: dividerDelay, ease: [0.22, 1, 0.36, 1] }
                }
                aria-hidden="true"
              />

              {/* ── Descriptor ── */}
              <motion.p
                className="mt-3 text-xs tracking-[0.15em] text-slate-500 sm:mt-3 sm:text-sm"
                initial={noMotion ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  noMotion
                    ? { duration: 0 }
                    : { duration: 0.6, delay: descriptorDelay, ease: "easeOut" }
                }
              >
                Workshops, tech talks, and activities
              </motion.p>

              {/* ── Year badge ── */}
              <motion.span
                className="hero-year-badge mt-3 inline-block sm:mt-4"
                initial={noMotion ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  noMotion
                    ? { duration: 0 }
                    : { duration: 0.5, delay: descriptorDelay + 0.2, ease: "easeOut" }
                }
              >
                2026
              </motion.span>
        </div>
      </motion.div>
    </section>
  );
}
