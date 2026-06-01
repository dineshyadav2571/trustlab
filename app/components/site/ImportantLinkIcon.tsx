import type { ImportantLinkIcon as IconKey } from "@/lib/important-link-types";

const iconClass = "h-6 w-6 text-[var(--btrust-teal)]";

export function ImportantLinkIcon({ icon }: { icon: IconKey }) {
  switch (icon) {
    case "globe":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path stroke="currentColor" strokeWidth="2" d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>
      );
    case "water":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M12 3c3 4 6 7 6 10a6 6 0 1 1-12 0c0-3 3-6 6-10Z"
          />
        </svg>
      );
    case "monitor":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
          <path stroke="currentColor" strokeWidth="2" d="M8 20h8" />
        </svg>
      );
    case "map":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            d="m3 7 7-3 7 3 7-3 7 3 4-2V5L3 7Z"
          />
        </svg>
      );
    case "laptop":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="4" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
          <path stroke="currentColor" strokeWidth="2" d="M2 19h20" />
        </svg>
      );
    case "book":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path stroke="currentColor" strokeWidth="2" d="M5 4h8a4 4 0 0 1 4 4v14H9a4 4 0 0 0-4 4V4Z" />
          <path stroke="currentColor" strokeWidth="2" d="M5 18h12" />
        </svg>
      );
    case "chart":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path stroke="currentColor" strokeWidth="2" d="M4 19V5M4 19h16" />
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M8 15V9M12 17V7M16 13v-2" />
        </svg>
      );
    case "database":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="2" />
          <path stroke="currentColor" strokeWidth="2" d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        </svg>
      );
    case "mail":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m3 7 9 6 9-6" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M10 13a5 5 0 0 1 7 0M14 7h.01M8 11h.01M12 11h.01M16 11h.01"
          />
          <path stroke="currentColor" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        </svg>
      );
  }
}
