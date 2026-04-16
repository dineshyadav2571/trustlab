import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getPublicWebsiteData } from "@/lib/website-data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const websiteData = await getPublicWebsiteData();

  return {
    title: {
      default: websiteData.branding.siteTitle,
      template: `%s | ${websiteData.branding.siteTitle}`,
    },
    description: websiteData.branding.siteDescription,
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
