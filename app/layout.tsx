import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getWebsiteBrandingForMetadata } from "@/lib/website-data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getWebsiteBrandingForMetadata();
  const iconUrl =
    branding.iconMimeType && branding.iconBase64
      ? `data:${branding.iconMimeType};base64,${branding.iconBase64}`
      : undefined;

  return {
    title: {
      default: branding.siteTitle,
      template: `%s | ${branding.siteTitle}`,
    },
    description: branding.siteDescription,
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
