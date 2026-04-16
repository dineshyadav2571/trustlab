"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/app/admin/admin-styles";

type WebsiteData = {
  branding: {
    labName: string;
    shortName: string;
    siteTitle: string;
    siteDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    tagline: string;
    footerText: string;
    iconMimeType: string;
    iconBase64: string;
  };
  about: {
    title: string;
    body: string;
    imageMimeType: string;
    imageBase64: string;
  };
  lead: {
    name: string;
    role: string;
    bio: string;
    scholarUrl: string;
    researchGateUrl: string;
    imageMimeType: string;
    imageBase64: string;
  };
  contact: {
    addressLine: string;
    email: string;
    webUrl: string;
    webLinkLabel: string;
    linkedInUrl: string;
    linkedInLabel: string;
    mapEmbedUrl: string;
  };
};

function PreviewImage({ mimeType, base64, alt }: { mimeType: string; base64: string; alt: string }) {
  if (!mimeType || !base64) return null;
  return (
    <Image
      src={`data:${mimeType};base64,${base64}`}
      alt={alt}
      width={600}
      height={320}
      unoptimized
      className="h-32 w-full rounded-md border border-slate-200 object-cover md:w-auto"
    />
  );
}

export function WebsiteDataManagement() {
  const [data, setData] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [brandingIcon, setBrandingIcon] = useState<File | null>(null);
  const [aboutImage, setAboutImage] = useState<File | null>(null);
  const [leadImage, setLeadImage] = useState<File | null>(null);

  async function loadWebsiteData() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/website-data", { cache: "no-store" });
      const json = (await response.json()) as { websiteData?: WebsiteData; error?: string };
      if (!response.ok || !json.websiteData) {
        setError(json.error ?? "Could not load website data.");
        return;
      }
      setData(json.websiteData);
    } catch {
      setError("Could not load website data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWebsiteData();
  }, []);

  function update<K extends keyof WebsiteData>(section: K, patch: Partial<WebsiteData[K]>) {
    setData((prev) => (prev ? { ...prev, [section]: { ...prev[section], ...patch } } : prev));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data) return;
    setSaving(true);
    setError("");
    setInfo("");
    try {
      const formData = new FormData();
      formData.append("branding.labName", data.branding.labName);
      formData.append("branding.shortName", data.branding.shortName);
      formData.append("branding.siteTitle", data.branding.siteTitle);
      formData.append("branding.siteDescription", data.branding.siteDescription);
      formData.append("branding.heroTitle", data.branding.heroTitle);
      formData.append("branding.heroSubtitle", data.branding.heroSubtitle);
      formData.append("branding.tagline", data.branding.tagline);
      formData.append("branding.footerText", data.branding.footerText);
      formData.append("about.title", data.about.title);
      formData.append("about.body", data.about.body);
      formData.append("lead.name", data.lead.name);
      formData.append("lead.role", data.lead.role);
      formData.append("lead.bio", data.lead.bio);
      formData.append("lead.scholarUrl", data.lead.scholarUrl);
      formData.append("lead.researchGateUrl", data.lead.researchGateUrl);
      formData.append("contact.addressLine", data.contact.addressLine);
      formData.append("contact.email", data.contact.email);
      formData.append("contact.webUrl", data.contact.webUrl);
      formData.append("contact.webLinkLabel", data.contact.webLinkLabel);
      formData.append("contact.linkedInUrl", data.contact.linkedInUrl);
      formData.append("contact.linkedInLabel", data.contact.linkedInLabel);
      formData.append("contact.mapEmbedUrl", data.contact.mapEmbedUrl);
      if (brandingIcon) formData.append("branding.icon", brandingIcon);
      if (aboutImage) formData.append("about.image", aboutImage);
      if (leadImage) formData.append("lead.image", leadImage);

      const response = await fetch("/api/website-data", { method: "PATCH", body: formData });
      const json = (await response.json()) as { websiteData?: WebsiteData; error?: string };
      if (!response.ok || !json.websiteData) {
        setError(json.error ?? "Could not save website data.");
        return;
      }
      setData(json.websiteData);
      setBrandingIcon(null);
      setAboutImage(null);
      setLeadImage(null);
      setInfo("Website data updated.");
    } catch {
      setError("Could not save website data.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading website data...</p>;
  if (!data) return <p className="text-sm text-red-600">{error || "Could not load website data."}</p>;

  return (
    <form onSubmit={save} className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Branding & hero</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={data.branding.labName} onChange={(e) => update("branding", { labName: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Lab name" required />
          <input value={data.branding.shortName} onChange={(e) => update("branding", { shortName: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Short name" required />
          <input value={data.branding.siteTitle} onChange={(e) => update("branding", { siteTitle: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Website title shown in browser tab" required />
          <textarea value={data.branding.siteDescription} onChange={(e) => update("branding", { siteDescription: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" rows={3} placeholder="Website description for metadata" required />
          <input value={data.branding.heroTitle} onChange={(e) => update("branding", { heroTitle: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Hero title" required />
          <input value={data.branding.heroSubtitle} onChange={(e) => update("branding", { heroSubtitle: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Hero subtitle" required />
          <input value={data.branding.tagline} onChange={(e) => update("branding", { tagline: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Tagline" required />
          <input value={data.branding.footerText} onChange={(e) => update("branding", { footerText: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Footer text" required />
          <div className="md:col-span-2 space-y-2">
            <input type="file" accept="image/*" onChange={(e) => setBrandingIcon(e.target.files?.[0] ?? null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <PreviewImage mimeType={data.branding.iconMimeType} base64={data.branding.iconBase64} alt="Brand icon" />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">About page</h3>
        <div className="mt-4 grid gap-3">
          <input value={data.about.title} onChange={(e) => update("about", { title: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="About title" required />
          <textarea value={data.about.body} onChange={(e) => update("about", { body: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" rows={10} placeholder="About content" required />
          <input type="file" accept="image/*" onChange={(e) => setAboutImage(e.target.files?.[0] ?? null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <PreviewImage mimeType={data.about.imageMimeType} base64={data.about.imageBase64} alt="About image" />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Lead person</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={data.lead.name} onChange={(e) => update("lead", { name: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Name" required />
          <input value={data.lead.role} onChange={(e) => update("lead", { role: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Role" required />
          <input value={data.lead.scholarUrl} onChange={(e) => update("lead", { scholarUrl: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Scholar URL" required />
          <input value={data.lead.researchGateUrl} onChange={(e) => update("lead", { researchGateUrl: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="ResearchGate URL" required />
          <textarea value={data.lead.bio} onChange={(e) => update("lead", { bio: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" rows={10} placeholder="Lead bio" required />
          <div className="md:col-span-2 space-y-2">
            <input type="file" accept="image/*" onChange={(e) => setLeadImage(e.target.files?.[0] ?? null)} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <PreviewImage mimeType={data.lead.imageMimeType} base64={data.lead.imageBase64} alt="Lead image" />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Contact page</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <textarea value={data.contact.addressLine} onChange={(e) => update("contact", { addressLine: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" rows={3} placeholder="Address" required />
          <input value={data.contact.email} onChange={(e) => update("contact", { email: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Email" required />
          <input value={data.contact.webUrl} onChange={(e) => update("contact", { webUrl: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Website URL" required />
          <input value={data.contact.webLinkLabel} onChange={(e) => update("contact", { webLinkLabel: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Website link label" required />
          <input value={data.contact.linkedInUrl} onChange={(e) => update("contact", { linkedInUrl: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="LinkedIn URL" required />
          <input value={data.contact.linkedInLabel} onChange={(e) => update("contact", { linkedInLabel: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="LinkedIn label" required />
          <textarea value={data.contact.mapEmbedUrl} onChange={(e) => update("contact", { mapEmbedUrl: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" rows={4} placeholder="Google Maps embed URL" required />
        </div>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {info ? <p className="text-sm text-emerald-700">{info}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={saving} className={adminBtnPrimary}>{saving ? "Saving..." : "Save website data"}</button>
        <button type="button" onClick={() => void loadWebsiteData()} className={adminBtnSecondary}>Reload</button>
      </div>
    </form>
  );
}
