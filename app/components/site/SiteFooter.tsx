import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-100 py-4">
      <p className="text-center text-sm text-slate-600">
        © {new Date().getFullYear()}{" "}
        <Link
          href="/"
          className="font-medium text-[var(--btrust-teal)] hover:underline"
        >
          BTrust Lab
        </Link>{" "}
        IIITM Gwalior. All rights reserved.
      </p>
    </footer>
  );
}
