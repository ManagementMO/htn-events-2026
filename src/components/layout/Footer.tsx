import { Zap } from "lucide-react";

/** Site footer with attribution. */
export function Footer() {
  return (
    <footer className="border-t border-[#1e293b] bg-[#0a0e1a]/50 mt-auto">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Zap className="h-4 w-4" aria-hidden="true" />
          <span>Hack the North 2026</span>
        </div>
        <p className="text-sm text-slate-500">
          Built with Next.js & TypeScript
        </p>
      </div>
    </footer>
  );
}
