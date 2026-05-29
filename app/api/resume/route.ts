import { NextResponse } from "next/server";
import { gatherResumeData, resumePdfFilename } from "@/lib/resume/gather-resume-data";
import { generateResumePdf } from "@/lib/resume/generate-resume-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await gatherResumeData();
    const pdf = await generateResumePdf(data);
    const filename = resumePdfFilename(data.lead.name);

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[resume]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not generate resume PDF.",
      },
      { status: 500 },
    );
  }
}
