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
    <main className="min-h-screen p-3 md:p-4">
      <div className="grid min-h-[calc(100vh-1.5rem)] w-full grid-cols-1 gap-3 md:grid-cols-[230px_1fr]">
        <SidebarNav adminName={currentAdmin.name} adminEmail={currentAdmin.email} />
        <section className="h-full min-w-0 rounded-2xl border bg-white p-4 shadow-sm md:p-6">
          {children}
        </section>
      </div>
    </main>
  );
}
