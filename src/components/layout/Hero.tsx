"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/* ─── constants ─── */
const EVENTS_LETTERS = "EVENTS".split("");
const DESCRIPTOR_WORDS = ["Workshops,", "tech", "talks,", "and", "activities"];

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

  /* Detect mobile for lighter animations */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ─── parallax ─── */
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  /* ─── timing ─── */
  const letterStagger = isMobile ? 0.03 : 0.06;
  const eventsStartDelay = 0.35; /* after subtitle lands */
  const eventsDuration = EVENTS_LETTERS.length * letterStagger;
  const streakDelay = eventsStartDelay + eventsDuration + 0.15;
  const descriptorDelay = streakDelay + 0.5;
  const particleCount = isMobile ? 5 : 10;

  /* ─── reduced-motion fast paths ─── */
  const noMotion = !!prefersReduced;

  /* Spring config for letters */
  const letterSpring = { type: "spring" as const, damping: 12, stiffness: 200 };

  /* Memoize particles array to avoid re-renders */
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
      <div
        className="hero-orb hero-orb--purple pointer-events-none absolute"
        aria-hidden="true"
      />
      <div
        className="hero-orb hero-orb--cyan pointer-events-none absolute"
        aria-hidden="true"
      />

      {/* ───────── Dot-grid texture ───────── */}
      <div className="hero-dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* ───────── Particles (CSS-only) ───────── */}
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

      {/* ───────── Hero content (parallax wrapper) ───────── */}
      <motion.div
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        style={
          noMotion
            ? undefined
            : { y: heroY, opacity: heroOpacity }
        }
      >
        <div className="relative z-10 text-center">
          {/* ── Subtitle: "HACK THE NORTH 2026" ── */}
          <motion.p
            className="hero-subtitle text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500 sm:text-xs"
            initial={noMotion ? false : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              noMotion
                ? { duration: 0 }
                : { duration: 0.5, ease: "easeOut" }
            }
          >
            Hack the North 2026
          </motion.p>

          {/* ── Main title: "EVENTS" — letter-by-letter ── */}
          <h1
            className="relative mt-4 inline-block text-5xl font-bold uppercase tracking-[0.12em] sm:text-6xl lg:text-7xl"
            aria-label="Events"
          >
            {/* The letters — each gets its own gradient-text so background-clip works with filter animations */}
            <span className="relative inline-block">
              {EVENTS_LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  className="hero-gradient-text hero-letter relative inline-block"
                  initial={
                    noMotion
                      ? false
                      : { opacity: 0, y: 40, filter: "blur(8px)" }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  transition={
                    noMotion
                      ? { duration: 0 }
                      : {
                          ...letterSpring,
                          delay: eventsStartDelay + i * letterStagger,
                        }
                  }
                >
                  {letter}
                </motion.span>
              ))}
            </span>

            {/* ── Streak through title ── */}
            <motion.span
              className="hero-streak-bar pointer-events-none absolute left-[-5%] right-[-5%] top-1/2 h-[1px]"
              aria-hidden="true"
              initial={
                noMotion
                  ? false
                  : { scaleX: 0, transformOrigin: "left" }
              }
              animate={{ scaleX: 1 }}
              transition={
                noMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.8,
                      delay: streakDelay,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
            >
              {/* Flare that travels along the streak */}
              {!noMotion && (
                <span
                  className="hero-streak-flare absolute inset-0"
                  aria-hidden="true"
                  style={{ animationDelay: `${streakDelay}s` }}
                />
              )}
            </motion.span>
          </h1>

          {/* ── Descriptor words ── */}
          <p className="mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-x-1.5 text-sm">
            {DESCRIPTOR_WORDS.map((word, i) => (
              <motion.span
                key={i}
                className="text-slate-500"
                initial={noMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  noMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.4,
                        delay: descriptorDelay + i * 0.15,
                        ease: "easeOut",
                      }
                }
              >
                {word}
              </motion.span>
            ))}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
