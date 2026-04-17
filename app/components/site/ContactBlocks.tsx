import Link from "next/link";
import type { ReactNode } from "react";
import type { PublicWebsiteData } from "@/lib/website-data";

type ContactBlocksProps = {
  contact: PublicWebsiteData["contact"];
};

function iconClass() {
  return "h-7 w-7 text-[var(--btrust-teal)]";
}

function IconPin() { return <svg className={iconClass()} viewBox="0 0 24 24" fill="none" aria-hidden><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10Z" /><circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="2" /></svg>; }
function IconMail() { return <svg className={iconClass()} viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m3 7 9 6 9-6" /></svg>; }
function IconGlobe() { return <svg className={iconClass()} viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path stroke="currentColor" strokeWidth="2" d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>; }
function IconLinkedIn() { return <svg className={iconClass()} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6.5 8.5h-3V21h3V8.5ZM5.25 3.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5ZM13 8.5h-2.9V21H13v-6.3c0-1.7.6-2.9 2.2-2.9 1.2 0 1.8.8 1.8 2.3V21h3v-7.4c0-3.2-1.7-4.6-4-4.6-1.8 0-2.6 1-3 1.7h-.03V8.5Z" /></svg>; }

function Block({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <div className="flex flex-col items-center text-center"><div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--btrust-teal)] bg-white shadow-sm" aria-hidden>{icon}</div><h3 className="text-base font-bold text-slate-900">{title}</h3><div className="mt-2 text-sm leading-relaxed text-slate-600">{children}</div></div>;
}

export function ContactBlocks({ contact }: ContactBlocksProps) {
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      <Block icon={<IconPin />} title="Address"><p className="whitespace-pre-line">{contact.addressLine}</p></Block>
      <Block icon={<IconMail />} title="Email"><a href={`mailto:${contact.email}`} className="text-[var(--btrust-teal)] underline hover:opacity-90">{contact.email}</a></Block>
      <Block icon={<IconGlobe />} title="Web Link"><Link href={contact.webUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--btrust-teal)] underline hover:opacity-90">{contact.webLinkLabel}</Link></Block>
      <Block icon={<IconLinkedIn />} title="LinkedIn"><Link href={contact.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--btrust-teal)] underline hover:opacity-90">{contact.linkedInLabel}</Link></Block>
    </div>
  );
}
