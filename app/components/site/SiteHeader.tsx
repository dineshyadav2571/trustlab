"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BTrustLogo } from "@/app/components/site/BTrustLogo";

type SiteHeaderProps = {
  branding: {
    shortName: string;
    tagline: string;
    iconMimeType: string;
    iconBase64: string;
  };
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/people", label: "People" },
  { href: "/publications", label: "Publications" },
  { href: "/projects", label: "Research Projects" },
  { href: "/patents", label: "Patents" },
  { href: "/achievements", label: "Achievements" },
  { href: "/news", label: "News & Highlights" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/collaborations", label: "Collaborations" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ branding }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="shrink-0">
          <BTrustLogo
            shortName={branding.shortName}
            tagline={branding.tagline}
            iconMimeType={branding.iconMimeType}
            iconBase64={branding.iconBase64}
          />
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm font-medium text-slate-600 md:gap-x-6">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={
                  active
                    ? "text-[var(--btrust-teal)]"
                    : "transition-colors hover:text-[var(--btrust-teal)]"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
