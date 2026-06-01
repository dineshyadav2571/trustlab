"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BTrustLogo } from "@/app/components/site/BTrustLogo";
import { UserHeaderAccess } from "@/app/components/user/UserContentFab";

type SiteHeaderProps = {
  branding: {
    headerName: string;
    iconMimeType: string;
    iconBase64: string;
  };
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/other-activities", label: "Other Activities" },
  { href: "/publications", label: "Publications" },
  { href: "/projects", label: "Projects" },
  { href: "/teaching", label: "Teaching" },
  { href: "/students", label: "Students" },
  { href: "/administration", label: "Administration" },
  { href: "/important-links", label: "Important Links" },
] as const;

function navLinkClass(active: boolean) {
  return active
    ? "rounded-md bg-[var(--btrust-teal)] px-3 py-1.5 text-white"
    : "rounded-md px-3 py-1.5 text-slate-700 transition-colors hover:text-[var(--btrust-teal)]";
}

export function SiteHeader({ branding }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-4 md:px-6">
        <Link href="/" className="min-w-0 shrink">
          <BTrustLogo
            shortName={branding.headerName}
            iconMimeType={branding.iconMimeType}
            iconBase64={branding.iconBase64}
          />
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-end gap-0.5 overflow-x-auto whitespace-nowrap text-sm font-medium lg:flex xl:gap-1"
          aria-label="Main"
        >
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(isActive(item.href))}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <UserHeaderAccess />
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-3 sm:px-4" aria-label="Main">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-[var(--btrust-teal)] text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <UserHeaderAccess />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
