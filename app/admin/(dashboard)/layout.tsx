import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthenticatedAdminFromCookies } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import { Admin } from "@/lib/models/Admin";
import { SidebarNav } from "@/app/admin/(dashboard)/SidebarNav";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const auth = await getAuthenticatedAdminFromCookies();

  if (!auth) {
    redirect("/admin/login");
  }

  await connectToDb();
  const currentAdmin = await Admin.findById(auth.sub).lean();
  if (!currentAdmin || !currentAdmin.isActive) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-100/90 md:h-svh md:overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col gap-3 p-3 min-h-0 md:flex-row md:gap-4 md:p-4">
        <SidebarNav adminName={currentAdmin.name} adminEmail={currentAdmin.email} />
        <section className="flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm md:overflow-hidden md:shadow-md">
          <div className="admin-scroll-region min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4 md:p-6">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
