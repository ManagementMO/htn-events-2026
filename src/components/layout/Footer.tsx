import { Zap } from "lucide-react";

/** Minimal dark footer. */
export function Footer() {
  return (
    <footer className="border-t border-[#111827]/30 bg-[#05060f] mt-auto">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-slate-600">
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Hack the North 2026</span>
        </div>
        <p className="text-xs uppercase tracking-[0.15em] text-slate-700">
          Next.js &middot; TypeScript
        </p>
      </div>
    </footer>
  );
}
