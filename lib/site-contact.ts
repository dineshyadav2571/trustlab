/**
 * Static contact content for the public `/contact` page.
 * Replace map URL with the “Embed a map” snippet from Google Maps if you prefer.
 */
export const SITE_CONTACT = {
  /** Room and campus (shown under Address). */
  addressLine: "D Block Room No: 208\nABV-IIITM Gwalior",
  email: "asy@iiitm.ac.in",
  /** Institute / lab website — link text on the page is `webLinkLabel`. */
  webUrl: "https://www.iiitm.ac.in/",
  webLinkLabel: "Click here",
  /** Lab or faculty LinkedIn — update when you have the final URL. */
  linkedInUrl: "https://www.linkedin.com/",
  linkedInLabel: "Click here",
  /**
   * Google Maps iframe `src`. Coordinates point to ABV-IIITM Gwalior (Morena Rd area).
   * Optional: in Google Maps → Share → Embed a map → paste the `src` here instead.
   */
  mapEmbedUrl:
    "https://maps.google.com/maps?q=26.2494,78.1867&hl=en&z=16&ie=UTF8&output=embed",
} as const;
