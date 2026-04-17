"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BTrustLogo } from "@/app/components/site/BTrustLogo";
import { UserHeaderAccess } from "@/app/components/user/UserContentFab";

type SiteHeaderProps = {
  branding: {
    shortName: string;
    tagline: string;
    iconMimeType: string;
    iconBase64: string;
  };
};

const primaryItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/people", label: "People" },
];

const groupedItems = [
  {
    label: "Research",
    items: [
      { href: "/publications", label: "Publications" },
      { href: "/projects", label: "Research Projects" },
      { href: "/patents", label: "Patents" },
    ],
  },
  {
    label: "Updates",
    items: [
      { href: "/achievements", label: "Achievements" },
      { href: "/news", label: "News & Highlights" },
      { href: "/opportunities", label: "Opportunities" },
    ],
  },
  {
    label: "Connect",
    items: [
      { href: "/collaborations", label: "Collaborations" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

export function SiteHeader({ branding }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-4 md:px-6">
        <Link href="/" className="min-w-0 shrink">
          <BTrustLogo
            shortName={branding.shortName}
            iconMimeType={branding.iconMimeType}
            iconBase64={branding.iconBase64}
          />
        </Link>
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 lg:flex">
          <nav className="flex items-center gap-x-4 whitespace-nowrap text-sm font-medium text-slate-600 lg:gap-x-6">
            {primaryItems.map((item) => {
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
            {groupedItems.map((group) => {
              const active = group.items.some((item) => pathname === item.href);
              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(group.label)}
                  onMouseLeave={() => setOpenGroup((prev) => (prev === group.label ? null : prev))}
                >
                  <button
                    type="button"
                    className={
                      active
                        ? "inline-flex items-center gap-1 text-[var(--btrust-teal)]"
                        : "inline-flex items-center gap-1 transition-colors hover:text-[var(--btrust-teal)]"
                    }
                    aria-expanded={openGroup === group.label}
                  >
                    {group.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {openGroup === group.label ? (
                    <div className="absolute left-0 top-full z-20 min-w-[220px] pt-2">
                      <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                        {group.items.map((item) => {
                          const itemActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block rounded-lg px-3 py-2 ${
                                itemActive
                                  ? "bg-teal-50 text-[var(--btrust-teal)]"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </div>
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
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-3 sm:px-4">
            {primaryItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    active
                      ? "bg-teal-50 text-[var(--btrust-teal)]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {groupedItems.map((group) => (
              <details
                key={group.label}
                className="rounded-md border border-slate-200"
                open={group.items.some((item) => pathname === item.href)}
              >
                <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-slate-800">
                  <div className="flex items-center justify-between">
                    <span>{group.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </summary>
                <div className="flex flex-col gap-1 px-2 pb-2">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                          active
                            ? "bg-teal-50 text-[var(--btrust-teal)]"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </details>
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
