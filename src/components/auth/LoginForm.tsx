"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, AlertCircle, Loader2, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/** Endgame-styled login form with dramatic dark aesthetic. */
export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const success = login(username, password);

    if (success) {
      router.push("/");
    } else {
      setError("Invalid credentials. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#111827] bg-[#0a0d1a] p-8 shadow-2xl shadow-black/40">
        {/* Streak effect on the card */}
        <div className="absolute top-[30%] left-[-10%] right-[-10%] h-[2px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent blur-[0.5px] pointer-events-none" />
        <div className="absolute top-[28%] left-0 right-0 h-6 bg-gradient-to-r from-transparent via-violet-500/10 to-transparent blur-[12px] pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/5">
              <Shield className="h-8 w-8 text-violet-400 opacity-70" aria-hidden="true" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
              Hacker Access
            </p>
            <h1 className="mt-2 text-2xl font-bold uppercase tracking-[0.1em] text-slate-100">
              Sign In
            </h1>
            <p className="mt-3 text-xs text-slate-500">
              Sign in to unlock all events including private hacker-only sessions.
            </p>
          </div>

          {/* Demo credential hint */}
          <div className="mb-6 rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.15em] text-cyan-500/70 mb-1">
              Demo Credentials
            </p>
            <p className="text-sm text-cyan-300/80 font-mono">
              hacker <span className="text-slate-600 mx-1">/</span> htn2026
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full rounded-xl border border-[#111827] bg-[#05060f] px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-600 transition-all focus:border-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                  aria-describedby={error ? "login-error" : undefined}
                  aria-invalid={error ? true : undefined}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#111827] bg-[#05060f] px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-600 transition-all focus:border-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                  aria-describedby={error ? "login-error" : undefined}
                  aria-invalid={error ? true : undefined}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                id="login-error"
                role="alert"
                className="mt-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="glow-pulse mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-white transition-all hover:from-violet-500 hover:to-blue-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d1a] disabled:cursor-not-allowed disabled:opacity-50 disabled:animate-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Access Events
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
