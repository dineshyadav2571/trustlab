import type { Metadata } from "next";
import {
  ResearchProjectsPageContent,
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
    }));
  } catch {
    projects = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <ResearchProjectsPageContent projects={projects} />
      </div>
    </div>
  );
}
