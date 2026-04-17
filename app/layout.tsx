import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getPublicWebsiteData } from "@/lib/website-data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const websiteData = await getPublicWebsiteData();
  const iconUrl =
    websiteData.branding.iconMimeType && websiteData.branding.iconBase64
      ? `data:${websiteData.branding.iconMimeType};base64,${websiteData.branding.iconBase64}`
      : undefined;

  return {
    title: {
      default: websiteData.branding.siteTitle,
      template: `%s | ${websiteData.branding.siteTitle}`,
    },
    description: websiteData.branding.siteDescription,
    icons: iconUrl
      ? {
          icon: [{ url: iconUrl }],
          shortcut: [{ url: iconUrl }],
          apple: [{ url: iconUrl }],
        }
      : undefined,
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
