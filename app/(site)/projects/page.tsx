import type { Metadata } from "next";
import {
  ResearchProjectsPageGrid,
  type ResearchProjectPublic,
} from "@/app/components/site/ResearchProjectsSection";
import { connectToDb } from "@/lib/db";
import { ResearchProject } from "@/lib/models/ResearchProject";

export const metadata: Metadata = {
  title: "Research Projects",
  description: "Sponsored and collaborative research projects.",
};

export default async function ProjectsPage() {
  let projects: ResearchProjectPublic[] = [];
  try {
    await connectToDb();
    const projectDocs = await ResearchProject.find({}).sort({ createdAt: -1 });
    projects = projectDocs.map((p) => ({
      id: String(p._id),
      title: p.title,
      clgName: p.clgName,
      bugged: p.bugged,
      imageMimeType: p.imageMimeType,
      imageBase64: p.imageData.toString("base64"),
    }));
  } catch {
    projects = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h1 className="mx-auto mb-12 w-max text-center text-3xl font-semibold text-[var(--btrust-teal)] md:mb-14 md:text-4xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">
            Research Projects
          </span>
        </h1>

        <ResearchProjectsPageGrid projects={projects} />
      </div>
    </div>
  );
}
