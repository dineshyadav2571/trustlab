"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/app/admin/LogoutButton";

type SidebarNavProps = {
  adminName: string;
  adminEmail: string;
};

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/website-data", label: "Website Data" },
  { href: "/admin/admins", label: "Admin Management" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/research-areas", label: "Research Areas" },
  { href: "/admin/peoples", label: "Peoples" },
  { href: "/admin/publications", label: "Publications" },
  { href: "/admin/patents", label: "Patents" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/news-highlights", label: "News & highlights" },
  { href: "/admin/opportunities", label: "Opportunities" },
  { href: "/admin/collaborations", label: "Collaborations" },
  { href: "/admin/research-projects", label: "Research Projects" },
  { href: "/admin/workspace", label: "Workspace" },
];

export function SidebarNav({ adminName, adminEmail }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside className="flex max-h-[min(52vh,22rem)] w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900 text-slate-100 shadow-md md:max-h-none md:h-full md:w-[240px] md:self-stretch">
      <div className="shrink-0 border-b border-slate-800/80 px-4 pb-4 pt-4 md:px-5 md:pt-5">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-slate-400">TrustLab</p>
        <h1 className="mt-1.5 text-lg font-semibold tracking-tight text-white md:text-xl">Admin Panel</h1>
        <p className="mt-2 truncate text-xs text-slate-400" title={`${adminName} · ${adminEmail}`}><span className="font-medium text-slate-200">{adminName}</span><span className="text-slate-500"> · </span><span className="text-slate-400">{adminEmail}</span></p>
      </div>
      <nav className="admin-scroll-region min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-y-contain px-2 py-3 scroll-py-2 md:px-3" aria-label="Admin sections">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={`block rounded-lg border-l-2 py-2 pl-3 pr-2 text-sm transition-colors md:py-2.5 ${active ? "border-[var(--btrust-teal)] bg-slate-800/90 font-medium text-white" : "border-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white"}`}>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-slate-800/80 px-3 py-3 md:px-4 md:py-4"><LogoutButton /></div>
    </aside>
  );
}
