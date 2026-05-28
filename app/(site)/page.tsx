import { HomePageSections } from "@/app/components/site/home/HomePageSections";
import { getHomePageData } from "@/lib/home-summary";

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <div className="bg-slate-50 py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <HomePageSections data={data} />
      </div>
    </div>
  );
}
