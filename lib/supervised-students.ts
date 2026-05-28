import { dbQuery } from "@/lib/db";
import { defaultSupervisedStudents } from "@/lib/defaults/supervised-students";
import {
  supervisedStudentCategories,
  SupervisedStudent,
  type SupervisedStudentCategory,
} from "@/lib/models/SupervisedStudent";

export type SupervisedStudentPublic = {
  id: string;
  category: SupervisedStudentCategory;
  nameLine: string;
  topic: string;
  sortOrder: number;
};

export async function ensureSupervisedStudentsSeeded() {
  await dbQuery(async () => {
    const count = await SupervisedStudent.countDocuments();
    if (count > 0) return;
    await SupervisedStudent.insertMany(defaultSupervisedStudents);
  });
}

export async function getPublicSupervisedStudents(): Promise<SupervisedStudentPublic[]> {
  await ensureSupervisedStudentsSeeded();

  const docs = await dbQuery(() => SupervisedStudent.find({}).lean());
  const categoryOrder = new Map(
    supervisedStudentCategories.map((category, index) => [category, index]),
  );

  const sorted = [...docs].sort((a, b) => {
    const categoryDiff =
      (categoryOrder.get(a.category) ?? 0) - (categoryOrder.get(b.category) ?? 0);
    if (categoryDiff !== 0) return categoryDiff;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return sorted.map((doc) => ({
    id: String(doc._id),
    category: doc.category,
    nameLine: doc.nameLine,
    topic: doc.topic,
    sortOrder: doc.sortOrder,
  }));
}
