import { HeroSection } from "@/app/components/site/HeroSection";
import {
  ResearchAreasSection,
  type ResearchAreaPublic,
} from "@/app/components/site/ResearchAreasSection";
import {
  ResearchProjectsSection,
  type ResearchProjectPublic,
} from "@/app/components/site/ResearchProjectsSection";
import { connectToDb } from "@/lib/db";
import { ResearchArea } from "@/lib/models/ResearchArea";
import { ResearchProject } from "@/lib/models/ResearchProject";

export default async function HomePage() {
  let areas: ResearchAreaPublic[] = [];
  let projects: ResearchProjectPublic[] = [];
  try {
    await connectToDb();
    const areaDocs = await ResearchArea.find({}).sort({ createdAt: -1 });
    areas = areaDocs.map((a) => ({
      id: String(a._id),
      title: a.title,
      description: a.description,
      imageMimeType: a.imageMimeType,
      imageBase64: a.imageData.toString("base64"),
    }));

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
    areas = [];
    projects = [];
  }

  return (
    <>
      <HeroSection />
      <ResearchAreasSection areas={areas} />
      <ResearchProjectsSection projects={projects} />
    </>
  );
}
