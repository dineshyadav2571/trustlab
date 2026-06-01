import PDFDocument from "pdfkit";
import type { ResumeData, ResumePublicationItem, ResumeTimelineEntry } from "@/lib/resume/types";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 54;
const MARGIN_TOP = 52;
const MARGIN_BOTTOM = 52;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const FOOTER_RESERVE = 32;

const ACCENT = "#8b1a1a";
const INK = "#111111";
const BODY = "#2a2a2a";
const MUTED = "#5c5c5c";
const LINK = "#1a56db";
const RULE = "#d1d5db";
const RULE_DARK = "#374151";

const DATE_COL_W = 112;
const GUTTER = 16;
const CONTENT_X = MARGIN_X + DATE_COL_W + GUTTER;
const CONTENT_COL_W = PAGE_WIDTH - MARGIN_X - CONTENT_X;

const PHOTO_W = 88;
const PHOTO_H = 108;
const ICON_W = 12;
const ICON_GAP = 10;
const TEXT_INDENT = ICON_W + ICON_GAP;

const PUBLICATION_CATEGORY_LABELS: Record<string, string> = {
  Journals: "Journal Articles",
  Conference: "Conference Proceedings",
  Books: "Books",
};

type PdfDoc = InstanceType<typeof PDFDocument>;

function displayName(name: string, education: ResumeTimelineEntry[]) {
  if (/ph\.?\s*d\.?/i.test(name)) return name;
  const hasPhd = education.some((e) => /ph\.?\s*d\.?/i.test(e.title));
  return hasPhd ? `${name}, Ph.D.` : name;
}

function safePdfLink(url?: string): string | undefined {
  if (!url?.trim()) return undefined;
  const trimmed = url.trim();
  try {
    if (trimmed.startsWith("mailto:")) return new URL(trimmed).href;
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(withProtocol).href;
  } catch {
    return undefined;
  }
}

function safeY(doc: PdfDoc, y: number) {
  return Number.isFinite(y) ? y : MARGIN_TOP;
}

function pageBottom(doc: PdfDoc) {
  return doc.page.height - MARGIN_BOTTOM - FOOTER_RESERVE;
}

function ensureSpace(doc: PdfDoc, needed: number) {
  if (doc.y + needed > pageBottom(doc)) {
    doc.addPage();
    doc.y = MARGIN_TOP;
  }
}

function setY(doc: PdfDoc, y: number) {
  doc.y = safeY(doc, y);
}

function drawRibbon(doc: PdfDoc, x: number, y: number) {
  doc.save();
  doc.fillColor(ACCENT);
  doc
    .moveTo(x, y)
    .lineTo(x + 8, y)
    .lineTo(x + 8, y + 13)
    .lineTo(x + 4, y + 10.5)
    .lineTo(x, y + 13)
    .closePath()
    .fill();
  doc.restore();
}

function drawSquareBullet(doc: PdfDoc, x: number, y: number) {
  doc.save();
  doc.fillColor(ACCENT);
  doc.rect(x, y + 2, 5, 5).fill();
  doc.restore();
}

function drawNumberBadge(doc: PdfDoc, x: number, y: number, num: number) {
  const r = 7;
  doc.save();
  doc.circle(x + r, y + r, r).fill(ACCENT);
  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(String(num), x, y + 3, { width: r * 2, align: "center" });
  doc.restore();
}

function sectionHeading(doc: PdfDoc, title: string) {
  ensureSpace(doc, 44);
  setY(doc, doc.y + 18);
  const y = doc.y;
  doc.font("Helvetica-Bold").fontSize(12.5).fillColor(INK).text(title, MARGIN_X, y, {
    width: CONTENT_WIDTH,
  });
  const ruleY = doc.y + 6;
  doc
    .moveTo(MARGIN_X, ruleY)
    .lineTo(MARGIN_X + CONTENT_WIDTH, ruleY)
    .strokeColor(RULE)
    .lineWidth(0.75)
    .stroke();
  setY(doc, ruleY + 14);
}

function drawContactBlock(
  doc: PdfDoc,
  parts: { label: string; url?: string }[],
  x: number,
  y: number,
  width: number,
) {
  if (!parts.length) return y;

  doc.font("Helvetica").fontSize(8.5);
  let cursorY = y;

  const linkParts = parts.filter((p) => safePdfLink(p.url));
  const plainParts = parts.filter((p) => !safePdfLink(p.url));

  if (linkParts.length) {
    const first = linkParts[0];
    const href = safePdfLink(first.url)!;
    doc.fillColor(LINK).text(first.label, x, cursorY, {
      width,
      link: href,
      underline: true,
      continued: linkParts.length > 1,
    });
    for (let i = 1; i < linkParts.length; i++) {
      doc.fillColor(MUTED).text("   |   ", { continued: true });
      const part = linkParts[i];
      const link = safePdfLink(part.url)!;
      doc.fillColor(LINK).text(part.label, {
        link,
        underline: true,
        continued: i < linkParts.length - 1,
      });
    }
    cursorY = doc.y + 2;
  }

  if (plainParts.length) {
    const plainLine = plainParts.map((p) => p.label).join("   |   ");
    doc.fillColor(BODY).text(plainLine, x, cursorY, { width, lineGap: 2 });
    cursorY = doc.y;
  }

  return cursorY;
}

function drawHeader(doc: PdfDoc, data: ResumeData) {
  const photoX = PAGE_WIDTH - MARGIN_X - PHOTO_W;
  const textWidth = photoX - MARGIN_X - 20;
  let y = MARGIN_TOP;

  if (data.lead.imageMimeType && data.lead.imageBase64) {
    try {
      const imageBuffer = Buffer.from(data.lead.imageBase64, "base64");
      doc.image(imageBuffer, photoX, y, { fit: [PHOTO_W, PHOTO_H], align: "center", valign: "center" });
      doc.rect(photoX, y, PHOTO_W, PHOTO_H).strokeColor(RULE).lineWidth(0.6).stroke();
    } catch {
      // skip bad image
    }
  }

  const fullName = displayName(data.lead.name, data.education);
  doc.font("Helvetica-Bold").fontSize(21).fillColor(INK).text(fullName, MARGIN_X, y, {
    width: textWidth,
    lineGap: 2,
  });
  y = doc.y + 8;

  if (data.lead.role) {
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(BODY)
      .text(data.lead.role, MARGIN_X, y, { width: textWidth, lineGap: 3 });
    y = doc.y + 10;
  }

  const linkParts: { label: string; url?: string }[] = [];
  if (data.contact.email) {
    linkParts.push({ label: data.contact.email, url: `mailto:${data.contact.email}` });
  }
  for (const link of data.links) {
    if (link.label && link.url) linkParts.push({ label: link.label, url: link.url });
  }

  y = drawContactBlock(doc, linkParts, MARGIN_X, y, textWidth) + 6;

  if (data.lead.phone?.trim()) {
    doc.font("Helvetica").fontSize(9).fillColor(BODY).text(data.lead.phone.trim(), MARGIN_X, y, {
      width: textWidth,
    });
    y = doc.y + 4;
  }

  const headerBottom = Math.max(y, MARGIN_TOP + PHOTO_H) + 16;
  doc
    .moveTo(MARGIN_X, headerBottom)
    .lineTo(MARGIN_X + CONTENT_WIDTH, headerBottom)
    .strokeColor(RULE_DARK)
    .lineWidth(0.5)
    .stroke();
  setY(doc, headerBottom + 20);
}

function measureBlock(doc: PdfDoc, text: string, width: number, font: string, size: number) {
  doc.font(font).fontSize(size);
  return doc.heightOfString(text || " ", { width, lineGap: 2 });
}

function drawTwoColumnTimeline(doc: PdfDoc, entries: ResumeTimelineEntry[]) {
  for (const entry of entries) {
    const title = entry.title?.trim() || "";
    const period = entry.period?.trim() || "";
    const description = entry.description?.trim() || "";

    const titleH = measureBlock(doc, title, CONTENT_COL_W - TEXT_INDENT, "Helvetica-Bold", 10);
    const descH = measureBlock(doc, description, CONTENT_COL_W - TEXT_INDENT, "Helvetica", 9.5);
    const periodH = measureBlock(doc, period, DATE_COL_W, "Helvetica", 9);
    const rowH = Math.max(periodH, titleH + descH + (entry.thesisUrl ? 12 : 4)) + 16;

    ensureSpace(doc, rowH);
    const rowTop = doc.y;

    doc.font("Helvetica").fontSize(9).fillColor(MUTED);
    doc.text(period, MARGIN_X, rowTop, { width: DATE_COL_W, lineGap: 2 });

    drawRibbon(doc, CONTENT_X, rowTop + 1);
    const textX = CONTENT_X + TEXT_INDENT;

    doc.font("Helvetica-Bold").fontSize(10).fillColor(INK).text(title, textX, rowTop, {
      width: CONTENT_COL_W - TEXT_INDENT,
      lineGap: 1,
    });

    if (description) {
      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor(BODY)
        .text(description, textX, doc.y + 3, {
          width: CONTENT_COL_W - TEXT_INDENT,
          lineGap: 2,
        });
    }

    const thesisLink = safePdfLink(entry.thesisUrl);
    if (thesisLink) {
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(LINK)
        .text("Thesis", textX, doc.y + 4, {
          link: thesisLink,
          underline: true,
        });
    }

    setY(doc, rowTop + rowH);
  }
}

function drawProjects(doc: PdfDoc, projects: ResumeData["projects"]) {
  for (const project of projects) {
    const titleH = measureBlock(
      doc,
      project.title,
      CONTENT_WIDTH - TEXT_INDENT,
      "Helvetica-Bold",
      9.5,
    );
    const metaH = measureBlock(
      doc,
      project.lines.join("  "),
      CONTENT_WIDTH - TEXT_INDENT,
      "Helvetica",
      9.5,
    );
    const rowH = titleH + metaH + 18;

    ensureSpace(doc, rowH);
    const rowTop = doc.y;
    drawRibbon(doc, MARGIN_X, rowTop + 1);
    const textX = MARGIN_X + TEXT_INDENT;

    doc
      .font("Helvetica-Bold")
      .fontSize(9.5)
      .fillColor(INK)
      .text(project.title, textX, rowTop, { width: CONTENT_WIDTH - TEXT_INDENT, lineGap: 1 });

    if (project.lines.length) {
      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor(BODY)
        .text(project.lines.join("   "), textX, doc.y + 4, {
          width: CONTENT_WIDTH - TEXT_INDENT,
          lineGap: 2,
        });
    }

    setY(doc, rowTop + rowH);
  }
}

function drawPublicationItem(doc: PdfDoc, item: ResumePublicationItem, index: number) {
  const textW = CONTENT_WIDTH - 26;
  const bodyH = measureBlock(doc, item.text, textW, "Helvetica", 9.5);
  const linkH = item.link && safePdfLink(item.link) ? 11 : 0;
  const rowH = Math.max(bodyH, 14) + linkH + 12;

  ensureSpace(doc, rowH);
  const rowTop = doc.y;
  const textX = MARGIN_X + 26;

  drawNumberBadge(doc, MARGIN_X + 1, rowTop, index + 1);

  doc.font("Helvetica").fontSize(9.5).fillColor(BODY).text(item.text, textX, rowTop + 2, {
    width: textW,
    lineGap: 2,
  });

  const pubLink = safePdfLink(item.link);
  if (pubLink) {
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(LINK)
      .text("Link", textX, doc.y + 3, { link: pubLink, underline: true });
  }

  setY(doc, rowTop + rowH);
}

function drawPublications(doc: PdfDoc, groups: ResumeData["publications"]) {
  for (const group of groups) {
    ensureSpace(doc, 28);
    const subTitle = PUBLICATION_CATEGORY_LABELS[group.category] ?? group.category;
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(INK)
      .text(subTitle, MARGIN_X, doc.y, { width: CONTENT_WIDTH });
    setY(doc, doc.y + 10);

    group.items.forEach((item, index) => drawPublicationItem(doc, item, index));
    setY(doc, doc.y + 6);
  }
}

function drawSquareBulletList(doc: PdfDoc, items: string[]) {
  for (const item of items) {
    const text = item.trim();
    if (!text) continue;

    const h = measureBlock(doc, text, CONTENT_WIDTH - TEXT_INDENT, "Helvetica", 9.5) + 12;
    ensureSpace(doc, h);
    const rowTop = doc.y;

    drawSquareBullet(doc, MARGIN_X, rowTop);
    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor(BODY)
      .text(text, MARGIN_X + TEXT_INDENT, rowTop, {
        width: CONTENT_WIDTH - TEXT_INDENT,
        lineGap: 2,
      });

    setY(doc, rowTop + h);
  }
}

function drawSubheading(doc: PdfDoc, title: string) {
  ensureSpace(doc, 22);
  setY(doc, doc.y + 8);
  doc.font("Helvetica-Bold").fontSize(10).fillColor(INK).text(title, MARGIN_X, doc.y, {
    width: CONTENT_WIDTH,
  });
  setY(doc, doc.y + 8);
}

function drawStudents(doc: PdfDoc, groups: ResumeData["students"]) {
  for (const group of groups) {
    drawSubheading(doc, group.category);
    for (const entry of group.entries) {
      const line = entry.topic.trim()
        ? `${entry.nameLine} — ${entry.topic}`
        : entry.nameLine;
      drawSquareBulletList(doc, [line]);
    }
    setY(doc, doc.y + 4);
  }
}

function drawAdminSection(doc: PdfDoc, section: ResumeData["administration"][number]) {
  drawSubheading(doc, section.title);
  drawSquareBulletList(doc, section.items);
}

function addPageNumbers(doc: PdfDoc) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(MUTED)
      .text(String(i - range.start + 1), 0, PAGE_HEIGHT - MARGIN_BOTTOM + 6, {
        width: PAGE_WIDTH,
        align: "center",
      });
  }
}

export function generateResumePdf(data: ResumeData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: MARGIN_X, right: MARGIN_X },
      bufferPages: true,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    setY(doc, MARGIN_TOP);
    drawHeader(doc, data);

    if (data.employment.length) {
      sectionHeading(doc, "Employment History");
      drawTwoColumnTimeline(doc, data.employment);
    }

    if (data.education.length) {
      sectionHeading(doc, "Education");
      drawTwoColumnTimeline(doc, data.education);
    }

    if (data.projects.length) {
      sectionHeading(doc, "Research Projects");
      drawProjects(doc, data.projects);
    }

    if (data.publications.length) {
      sectionHeading(doc, "Research Publications");
      drawPublications(doc, data.publications);
    }

    if (data.teaching.length) {
      sectionHeading(doc, "Teaching");
      drawSquareBulletList(doc, data.teaching);
    }

    if (data.students.length) {
      sectionHeading(doc, "Students Supervised");
      drawStudents(doc, data.students);
    }

    if (data.administration.length) {
      sectionHeading(doc, "Administration");
      for (const section of data.administration) {
        drawAdminSection(doc, section);
      }
    }

    addPageNumbers(doc);
    doc.end();
  });
}
