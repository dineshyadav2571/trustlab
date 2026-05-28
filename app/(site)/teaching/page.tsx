import type { Metadata } from "next";
import {
  TeachingPageContent,
  type TeachingCoursePublic,
} from "@/app/components/site/TeachingSection";
import { connectToDb } from "@/lib/db";
import { TeachingCourse } from "@/lib/models/TeachingCourse";

export const metadata: Metadata = {
  title: "Teaching",
  description: "Courses taught by the lab.",
};

export default async function TeachingPage() {
  let courses: TeachingCoursePublic[] = [];
  try {
    await connectToDb();
    const docs = await TeachingCourse.find({}).sort({ createdAt: 1 }).lean();
    courses = docs.map((course) => ({
      id: String(course._id),
      name: course.name,
    }));
  } catch {
    courses = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <TeachingPageContent courses={courses} />
      </div>
    </div>
  );
}
