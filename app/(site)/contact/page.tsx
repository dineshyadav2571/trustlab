import type { Metadata } from "next";
import { ContactBlocks } from "@/app/components/site/ContactBlocks";
import { getPublicWebsiteData } from "@/lib/website-data";

export const metadata: Metadata = {
  title: "Contact | BTrust Lab @ IIITM Gwalior",
  description: "Visit BTrust Lab at ABV-IIITM Gwalior - address, email, and links.",
};

export default async function ContactPage() {
  const websiteData = await getPublicWebsiteData();

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h1 className="mx-auto mb-10 w-max text-center text-3xl font-semibold text-[var(--btrust-teal)] md:mb-12 md:text-4xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">Contact</span>
        </h1>

        <section className="mb-12 md:mb-16">
          <p className="mb-3 text-sm font-medium text-slate-700 md:text-base">Visit location:</p>
          <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
            <iframe
              title="ABV-IIITM Gwalior on Google Maps"
              src={websiteData.contact.mapEmbedUrl}
              className="h-[min(420px,55vh)] w-full border-0 md:h-[440px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>

        <ContactBlocks contact={websiteData.contact} />
      </div>
    </div>
  );
}
