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
  { href: "/admin/admins", label: "Admin Management" },
  { href: "/admin/workspace", label: "Workspace" },
];

export function SidebarNav({ adminName, adminEmail }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside className="h-full rounded-2xl border bg-slate-900 p-5 text-slate-100 shadow-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">TrustLab</p>
      <h1 className="mt-2 text-xl font-semibold">Admin Panel</h1>
      <p className="mt-1 text-xs text-slate-300">
        {adminName} ({adminEmail})
      </p>

      <nav className="mt-8 space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm ${
                active
                  ? "bg-slate-800 font-medium text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-slate-800 pt-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
