import { dbQuery } from "@/lib/db";
import { Publication } from "@/lib/models/Publication";
import { ResearchProject } from "@/lib/models/ResearchProject";
import { getPublicWebsiteData, type PublicWebsiteData } from "@/lib/website-data";

export type HomePublicationSummary = {
  id: string;
  text: string;
  link: string;
};

export type HomeProjectSummary = {
  id: string;
  title: string;
  clgName: string;
  bugged: string;
};

export type HomePageData = {
  website: PublicWebsiteData;
  recentPublications: HomePublicationSummary[];
  recentProjects: HomeProjectSummary[];
};

export async function getHomePageData(): Promise<HomePageData> {
  const website = await getPublicWebsiteData();

  let recentPublications: HomePublicationSummary[] = [];
  let recentProjects: HomeProjectSummary[] = [];

  try {
    const pubLimit = website.home.recentPublicationsLimit || 5;
    const projectLimit = website.home.recentProjectsLimit || 5;

    const [pubDocs, projectDocs] = await dbQuery(() =>
      Promise.all([
        Publication.find({}).sort({ createdAt: -1 }).limit(pubLimit).lean(),
        ResearchProject.find({}).sort({ createdAt: -1 }).limit(projectLimit).lean(),
      ]),
    );

    recentPublications = pubDocs.map((p) => ({
      id: String(p._id),
      text: p.text,
      link: p.link ?? "",
    }));

    recentProjects = projectDocs.map((p) => ({
      id: String(p._id),
      title: p.title,
      clgName: p.clgName,
      bugged: p.bugged,
    }));
  } catch {
    recentPublications = [];
    recentProjects = [];
  }

  return { website, recentPublications, recentProjects };
}
