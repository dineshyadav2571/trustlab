"use client";

import { useEffect, useState } from "react";
import { AdminImageField } from "@/app/components/admin/AdminImageField";
import {
  adminBtnPrimary,
  adminBtnSecondary,
  adminBtnOutline,
  adminBtnDangerOutline,
} from "@/app/admin/admin-styles";

type ProfileLink = { id: string; label: string; url: string; sortOrder: number };
type EmploymentEntry = {
  id: string;
  title: string;
  period: string;
  description: string;
  sortOrder: number;
};
type EducationEntry = {
  id: string;
  degree: string;
  period: string;
  details: string;
  thesisUrl: string;
  sortOrder: number;
};

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
    iconUrl: string;
  };
  about: {
    title: string;
    body: string;
    imageMimeType: string;
    imageBase64: string;
    imageUrl: string;
  };
  lead: {
    name: string;
    role: string;
    location: string;
    phone: string;
    cvUrl: string;
    bio: string;
    scholarUrl: string;
    researchGateUrl: string;
    imageMimeType: string;
    imageBase64: string;
    imageUrl: string;
  };
  home: {
    aboutSummary: string;
    highlightsText: string;
    researchInterestsText: string;
    recentProjectsLimit: number;
    recentPublicationsLimit: number;
    profileLinks: ProfileLink[];
    employment: EmploymentEntry[];
    education: EducationEntry[];
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

type ApiWebsiteData = Omit<WebsiteData, "home"> & {
  home: {
    aboutSummary: string;
    highlights: string[];
    researchInterests: string[];
    recentProjectsLimit: number;
    recentPublicationsLimit: number;
    profileLinks: ProfileLink[];
    employment: EmploymentEntry[];
    education: EducationEntry[];
  };
};

function newId() {
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeFromApi(raw: ApiWebsiteData): WebsiteData {
  return {
    ...raw,
    lead: {
      ...raw.lead,
      location: raw.lead.location ?? "",
      phone: raw.lead.phone ?? "",
      cvUrl: raw.lead.cvUrl ?? "",
    },
    home: {
      aboutSummary: raw.home.aboutSummary,
      highlightsText: raw.home.highlights.join("\n"),
      researchInterestsText: raw.home.researchInterests.join("\n"),
      recentProjectsLimit: raw.home.recentProjectsLimit,
      recentPublicationsLimit: raw.home.recentPublicationsLimit,
      profileLinks: raw.home.profileLinks,
      employment: raw.home.employment,
      education: raw.home.education,
    },
  };
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
  const [imageCacheKey, setImageCacheKey] = useState(0);

  async function loadWebsiteData() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/website-data", { cache: "no-store", credentials: "include" });
      const json = (await response.json()) as { websiteData?: ApiWebsiteData; error?: string };
      if (!response.ok || !json.websiteData) {
        setError(json.error ?? "Could not load website data.");
        return;
      }
      setData(normalizeFromApi(json.websiteData));
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

  function updateHome(patch: Partial<WebsiteData["home"]>) {
    setData((prev) => (prev ? { ...prev, home: { ...prev.home, ...patch } } : prev));
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
      formData.append("lead.location", data.lead.location);
      formData.append("lead.phone", data.lead.phone);
      formData.append("lead.cvUrl", data.lead.cvUrl);
      formData.append("lead.bio", data.lead.bio);
      formData.append("lead.scholarUrl", data.lead.scholarUrl);
      formData.append("lead.researchGateUrl", data.lead.researchGateUrl);
      formData.append("home.aboutSummary", data.home.aboutSummary);
      formData.append("home.highlightsText", data.home.highlightsText);
      formData.append("home.researchInterestsText", data.home.researchInterestsText);
      formData.append("home.recentProjectsLimit", String(data.home.recentProjectsLimit));
      formData.append("home.recentPublicationsLimit", String(data.home.recentPublicationsLimit));
      formData.append(
        "home.profileLinks",
        JSON.stringify(
          data.home.profileLinks.map(({ label, url, sortOrder }) => ({ label, url, sortOrder })),
        ),
      );
      formData.append(
        "home.employment",
        JSON.stringify(
          data.home.employment.map(({ title, period, description, sortOrder }) => ({
            title,
            period,
            description,
            sortOrder,
          })),
        ),
      );
      formData.append(
        "home.education",
        JSON.stringify(
          data.home.education.map(({ degree, period, details, thesisUrl, sortOrder }) => ({
            degree,
            period,
            details,
            thesisUrl,
            sortOrder,
          })),
        ),
      );
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

      const response = await fetch("/api/website-data", {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
      const json = (await response.json()) as { websiteData?: ApiWebsiteData; error?: string };
      if (!response.ok || !json.websiteData) {
        setError(json.error ?? `Could not save website data (${response.status}).`);
        return;
      }
      setData(normalizeFromApi(json.websiteData));
      setBrandingIcon(null);
      setAboutImage(null);
      setLeadImage(null);
      setImageCacheKey((k) => k + 1);
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
        <h3 className="text-lg font-semibold text-slate-900">Home page</h3>
        <p className="mt-1 text-sm text-slate-600">
          Profile card, about summary, employment, and education on the home page. Highlight
          carousel images are managed under Admin → Highlights.
          Recent publications and projects are pulled automatically from their admin modules.
        </p>
        <div className="mt-4 grid gap-3">
          <textarea
            value={data.home.aboutSummary}
            onChange={(e) => updateHome({ aboutSummary: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            rows={4}
            placeholder="Short about paragraph for home page"
            required
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Research interests (one per line)
            </label>
            <textarea
              value={data.home.researchInterestsText}
              onChange={(e) => updateHome({ researchInterestsText: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              rows={6}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Recent projects count
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={data.home.recentProjectsLimit}
                onChange={(e) =>
                  updateHome({ recentProjectsLimit: Number(e.target.value) || 5 })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Recent publications count
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={data.home.recentPublicationsLimit}
                onChange={(e) =>
                  updateHome({ recentPublicationsLimit: Number(e.target.value) || 5 })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-800">Profile links</h4>
              <button
                type="button"
                className={adminBtnOutline}
                onClick={() =>
                  updateHome({
                    profileLinks: [
                      ...data.home.profileLinks,
                      { id: newId(), label: "", url: "", sortOrder: data.home.profileLinks.length },
                    ],
                  })
                }
              >
                Add link
              </button>
            </div>
            {data.home.profileLinks.map((link, index) => (
              <div key={link.id} className="grid gap-2 rounded-md border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto]">
                <input
                  value={link.label}
                  onChange={(e) => {
                    const profileLinks = [...data.home.profileLinks];
                    profileLinks[index] = { ...profileLinks[index], label: e.target.value };
                    updateHome({ profileLinks });
                  }}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Label (e.g. Faculty Profile)"
                />
                <input
                  value={link.url}
                  onChange={(e) => {
                    const profileLinks = [...data.home.profileLinks];
                    profileLinks[index] = { ...profileLinks[index], url: e.target.value };
                    updateHome({ profileLinks });
                  }}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="https://"
                />
                <button
                  type="button"
                  className={adminBtnDangerOutline}
                  onClick={() =>
                    updateHome({
                      profileLinks: data.home.profileLinks.filter((item) => item.id !== link.id),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-800">Employment history</h4>
              <button
                type="button"
                className={adminBtnOutline}
                onClick={() =>
                  updateHome({
                    employment: [
                      ...data.home.employment,
                      {
                        id: newId(),
                        title: "",
                        period: "",
                        description: "",
                        sortOrder: data.home.employment.length,
                      },
                    ],
                  })
                }
              >
                Add entry
              </button>
            </div>
            {data.home.employment.map((entry, index) => (
              <div key={entry.id} className="space-y-2 rounded-md border border-slate-200 p-3">
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={entry.title}
                    onChange={(e) => {
                      const employment = [...data.home.employment];
                      employment[index] = { ...employment[index], title: e.target.value };
                      updateHome({ employment });
                    }}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Job title"
                  />
                  <input
                    value={entry.period}
                    onChange={(e) => {
                      const employment = [...data.home.employment];
                      employment[index] = { ...employment[index], period: e.target.value };
                      updateHome({ employment });
                    }}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="April 2023 – Present"
                  />
                </div>
                <textarea
                  value={entry.description}
                  onChange={(e) => {
                    const employment = [...data.home.employment];
                    employment[index] = { ...employment[index], description: e.target.value };
                    updateHome({ employment });
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Institution and department"
                />
                <button
                  type="button"
                  className={adminBtnDangerOutline}
                  onClick={() =>
                    updateHome({
                      employment: data.home.employment.filter((item) => item.id !== entry.id),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-800">Education</h4>
              <button
                type="button"
                className={adminBtnOutline}
                onClick={() =>
                  updateHome({
                    education: [
                      ...data.home.education,
                      {
                        id: newId(),
                        degree: "",
                        period: "",
                        details: "",
                        thesisUrl: "",
                        sortOrder: data.home.education.length,
                      },
                    ],
                  })
                }
              >
                Add entry
              </button>
            </div>
            {data.home.education.map((entry, index) => (
              <div key={entry.id} className="space-y-2 rounded-md border border-slate-200 p-3">
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={entry.degree}
                    onChange={(e) => {
                      const education = [...data.home.education];
                      education[index] = { ...education[index], degree: e.target.value };
                      updateHome({ education });
                    }}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Ph.D."
                  />
                  <input
                    value={entry.period}
                    onChange={(e) => {
                      const education = [...data.home.education];
                      education[index] = { ...education[index], period: e.target.value };
                      updateHome({ education });
                    }}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="June 2012 – August 2018"
                  />
                </div>
                <textarea
                  value={entry.details}
                  onChange={(e) => {
                    const education = [...data.home.education];
                    education[index] = { ...education[index], details: e.target.value };
                    updateHome({ education });
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Field and department"
                />
                <input
                  value={entry.thesisUrl}
                  onChange={(e) => {
                    const education = [...data.home.education];
                    education[index] = { ...education[index], thesisUrl: e.target.value };
                    updateHome({ education });
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Thesis URL (optional)"
                />
                <button
                  type="button"
                  className={adminBtnDangerOutline}
                  onClick={() =>
                    updateHome({
                      education: data.home.education.filter((item) => item.id !== entry.id),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

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
          <div className="md:col-span-2">
            <AdminImageField
              label="Site icon (header logo)"
              hint="Shown next to the site name in the navigation bar."
              variant="icon"
              currentMimeType={data.branding.iconMimeType}
              currentBase64={data.branding.iconBase64}
              currentUrl={
                data.branding.iconUrl
                  ? `${data.branding.iconUrl}?v=${imageCacheKey}`
                  : ""
              }
              pendingFile={brandingIcon}
              onFileChange={setBrandingIcon}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">About page</h3>
        <div className="mt-4 grid gap-3">
          <input value={data.about.title} onChange={(e) => update("about", { title: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="About title" required />
          <textarea value={data.about.body} onChange={(e) => update("about", { body: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" rows={10} placeholder="About content" required />
          <AdminImageField
            label="About page image"
            hint="Optional image for the legacy about content block in the database."
            variant="banner"
            currentMimeType={data.about.imageMimeType}
            currentBase64={data.about.imageBase64}
            currentUrl={
              data.about.imageUrl ? `${data.about.imageUrl}?v=${imageCacheKey}` : ""
            }
            pendingFile={aboutImage}
            onFileChange={setAboutImage}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Lead person (home profile)</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={data.lead.name} onChange={(e) => update("lead", { name: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Name" required />
          <input value={data.lead.role} onChange={(e) => update("lead", { role: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Role / affiliation" required />
          <input value={data.lead.location} onChange={(e) => update("lead", { location: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Location (e.g. Varanasi, India)" />
          <input value={data.lead.phone} onChange={(e) => update("lead", { phone: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Phone" />
          <input value={data.lead.cvUrl} onChange={(e) => update("lead", { cvUrl: e.target.value })} className="md:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="CV download URL" />
          <input value={data.lead.scholarUrl} onChange={(e) => update("lead", { scholarUrl: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Google Scholar URL" required />
          <input value={data.lead.researchGateUrl} onChange={(e) => update("lead", { researchGateUrl: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="ResearchGate URL" required />
          <textarea value={data.lead.bio} onChange={(e) => update("lead", { bio: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2" rows={10} placeholder="Full bio (used on About page)" required />
          <div className="md:col-span-2">
            <AdminImageField
              label="Profile photo (home page)"
              hint="Displayed on the home page profile card and in the downloadable resume PDF."
              variant="portrait"
              currentMimeType={data.lead.imageMimeType}
              currentBase64={data.lead.imageBase64}
              currentUrl={
                data.lead.imageUrl ? `${data.lead.imageUrl}?v=${imageCacheKey}` : ""
              }
              pendingFile={leadImage}
              onFileChange={setLeadImage}
            />
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
