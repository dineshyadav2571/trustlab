import type { Metadata } from "next";
import { StudentsPageContent } from "@/app/components/site/StudentsSection";
import { getPublicSupervisedStudents } from "@/lib/supervised-students";

export const metadata: Metadata = {
  title: "Students",
  description: "Thesis supervised — Ph.D., M.Tech, B.Tech, and external students.",
};

export default async function StudentsPage() {
  let students: Awaited<ReturnType<typeof getPublicSupervisedStudents>> = [];
  try {
    students = await getPublicSupervisedStudents();
  } catch {
    students = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <StudentsPageContent students={students} />
      </div>
    </div>
  );
}
