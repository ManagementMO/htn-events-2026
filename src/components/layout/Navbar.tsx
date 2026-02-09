"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LogIn, Zap } from "lucide-react";

/** Main navigation bar with auth state and login/logout actions. */
export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav
      className="sticky top-0 z-50 border-b border-[#1e293b] bg-[#0a0e1a]/80 backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-slate-100 transition-colors hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-2 py-1"
        >
          <Zap className="h-5 w-5 text-blue-400" aria-hidden="true" />
          <span>HTN Events</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/25">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              Logged in
            </span>
          )}

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1c2238] px-4 py-2 text-sm font-medium text-slate-300 border border-[#1e293b] transition-all hover:bg-[#252d4a] hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Log in</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
