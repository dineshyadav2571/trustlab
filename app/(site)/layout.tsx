import { ReactNode } from "react";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { UserContentFab } from "@/app/components/user/UserContentFab";
import { getPublicWebsiteData } from "@/lib/website-data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const websiteData = await getPublicWebsiteData();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader branding={websiteData.branding} />
      <main className="flex-1">{children}</main>
      <SiteFooter labName={websiteData.branding.labName} footerText={websiteData.branding.footerText} />
      <UserContentFab />
    </div>
  );
}
