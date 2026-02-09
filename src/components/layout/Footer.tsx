/** Minimal dark footer — clean HTN branding only. */
export function Footer() {
  return (
    <footer className="border-t border-[#111827]/30 bg-[#05060f] mt-auto">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
          Hack the North 2026
        </p>
        <p className="text-xs text-slate-500">
          Built with care for HTN
        </p>
      </div>
    </footer>
  );
}
