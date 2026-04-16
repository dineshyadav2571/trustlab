import Image from "next/image";

type BTrustLogoProps = {
  className?: string;
  shortName: string;
  iconMimeType?: string;
  iconBase64?: string;
};

function DefaultLogoIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10">
      <circle cx="24" cy="12" r="3" fill="#ec4899" />
      <circle cx="36" cy="28" r="3" fill="#eab308" />
      <circle cx="12" cy="28" r="3" fill="#3b82f6" />
      <circle cx="24" cy="38" r="3" fill="#22c55e" />
      <line x1="24" y1="12" x2="36" y2="28" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="24" y1="12" x2="12" y2="28" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="12" y1="28" x2="24" y2="38" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="36" y1="28" x2="24" y2="38" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="12" y1="28" x2="36" y2="28" stroke="#94a3b8" strokeWidth="1.2" />
    </svg>
  );
}

export function BTrustLogo({ className = "", shortName, iconMimeType = "", iconBase64 = "" }: BTrustLogoProps) {
  const hasUploadedIcon = iconMimeType && iconBase64;
  return (
    <div className={`flex min-w-0 items-center gap-3 ${className}`}>
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm sm:h-12 sm:w-12" aria-hidden>
        {hasUploadedIcon ? (
          <Image
            src={`data:${iconMimeType};base64,${iconBase64}`}
            alt=""
            fill
            unoptimized
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <DefaultLogoIcon />
        )}
      </div>
      <div className="min-w-0 truncate text-base font-semibold tracking-tight text-[var(--btrust-teal)] sm:text-lg">
        <span className="truncate">{shortName}</span>
      </div>
    </div>
  );
}
