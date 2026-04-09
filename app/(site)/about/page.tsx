import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | BTrust Lab @ IIITM Gwalior",
  description:
    "BTrust Lab (Blockchain Technology Lab) at IIITM Gwalior — mission, research focus, and team.",
};

export default function AboutPage() {
  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h1 className="mb-12 text-center text-3xl font-semibold text-[var(--btrust-teal)] md:text-4xl">
          About Us
        </h1>

        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
          <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
            <Image
              src="/about-team.png"
              alt="BTrust Lab team at IIITM Gwalior"
              width={1200}
              height={900}
              className="h-auto w-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-5 text-left text-[15px] leading-relaxed text-slate-700 md:text-base">
            <p>
              The <strong className="font-semibold text-slate-900">BTrust Lab</strong>{" "}
              (Blockchain Technology Lab) is integral to the dynamic academic community at
              the Indian Institute of Information Technology and Management Gwalior
              (IIITM). Its mission is to conduct innovative research in information security,
              decision systems, Internet of Vehicles (IoV), Internet of Things (IoT), electric
              vehicles, electronic healthcare records (EHR), and real estate. The ultimate goal
              of this research is to address complex problems within various social welfare
              contexts.
            </p>
            <p>
              With the rapid advancement of technology in areas such as the Internet of Things
              (IoT), big data, communications, computing, crowd sensing, and social networking,
              vast amounts of data are being generated, presenting opportunities for discovery.
              To address challenges related to this data&apos;s size, speed, diversity, and
              complexity, our study aims to understand and analyse it to extract precise and
              actionable insights.
            </p>
            <p>
              Our team, consisting of seasoned experts and dynamic young scholars, is dedicated
              to advancing the frontiers of security. Every project we embark on is fueled by a
              deep passion for knowledge and a commitment to crafting cutting-edge solutions. We
              are committed to nurturing the BTrust Lab&apos;s collaborative and inclusive
              research culture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
