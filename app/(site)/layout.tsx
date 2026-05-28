import { ReactNode } from "react";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { getSiteLayoutData } from "@/lib/website-data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const site = await getSiteLayoutData();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader branding={site.branding} />
      <main className="flex-1">{children}</main>
      <SiteFooter labName={site.labName} footerText={site.footerText} />
    </div>
  );
}
