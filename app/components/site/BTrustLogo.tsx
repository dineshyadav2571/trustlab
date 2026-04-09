export function BTrustLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
        aria-hidden
      >
        <svg viewBox="0 0 48 48" className="h-10 w-10">
          <circle cx="24" cy="12" r="3" fill="#ec4899" />
          <circle cx="36" cy="28" r="3" fill="#eab308" />
          <circle cx="12" cy="28" r="3" fill="#3b82f6" />
          <circle cx="24" cy="38" r="3" fill="#22c55e" />
          <line
            x1="24"
            y1="12"
            x2="36"
            y2="28"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
          <line
            x1="24"
            y1="12"
            x2="12"
            y2="28"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
          <line
            x1="12"
            y1="28"
            x2="24"
            y2="38"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
          <line
            x1="36"
            y1="28"
            x2="24"
            y2="38"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
          <line
            x1="12"
            y1="28"
            x2="36"
            y2="28"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
        </svg>
      </div>
      <div className="leading-tight">
        <span className="text-lg font-semibold tracking-tight text-[var(--btrust-teal)]">
          BTrust LAB
        </span>
        <p className="text-[11px] text-slate-500">Securing the Data</p>
      </div>
    </div>
  );
}
