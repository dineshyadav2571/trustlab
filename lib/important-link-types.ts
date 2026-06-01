/** Client-safe constants and types (no Mongoose). */

export const importantLinkLayouts = ["simple", "grouped"] as const;
export type ImportantLinkLayout = (typeof importantLinkLayouts)[number];

export const importantLinkIcons = [
  "globe",
  "water",
  "monitor",
  "map",
  "laptop",
  "book",
  "link",
  "chart",
  "database",
  "mail",
] as const;
export type ImportantLinkIcon = (typeof importantLinkIcons)[number];

export function isImportantLinkLayout(value: string): value is ImportantLinkLayout {
  return importantLinkLayouts.includes(value as ImportantLinkLayout);
}

export function normalizeImportantLinkIcon(value: string): ImportantLinkIcon {
  return importantLinkIcons.includes(value as ImportantLinkIcon)
    ? (value as ImportantLinkIcon)
    : "link";
}
