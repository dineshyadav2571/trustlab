import {
  supervisedStudentCategories,
  type SupervisedStudentCategory,
} from "@/lib/models/SupervisedStudent";
import type { SupervisedStudentPublic } from "@/lib/supervised-students";

function groupByCategory(students: SupervisedStudentPublic[]) {
  const groups = new Map<SupervisedStudentCategory, SupervisedStudentPublic[]>();

  for (const category of supervisedStudentCategories) {
    groups.set(category, []);
  }

  for (const student of students) {
    const list = groups.get(student.category);
    if (list) {
      list.push(student);
    }
  }

  return supervisedStudentCategories
    .map((category) => ({ category, students: groups.get(category) ?? [] }))
    .filter((group) => group.students.length > 0);
}

function StudentEntry({ student }: { student: SupervisedStudentPublic }) {
  return (
    <li className="space-y-0.5">
      <p className="text-sm font-bold leading-snug text-slate-900 md:text-[15px]">
        {student.nameLine}
      </p>
      <p className="text-sm leading-relaxed text-slate-600 md:text-[15px]">{student.topic}</p>
    </li>
  );
}

type StudentsPanelProps = {
  students: SupervisedStudentPublic[];
  showPanelTitle?: boolean;
};

export function StudentsPanel({ students, showPanelTitle = true }: StudentsPanelProps) {
  const groups = groupByCategory(students);

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-sm md:px-8 md:py-8">
      {showPanelTitle ? (
        <h2 className="mb-6 border-b border-slate-200 pb-3 text-xl font-semibold text-[var(--btrust-teal)] md:text-2xl">
          Thesis Supervised
        </h2>
      ) : null}

      {groups.length === 0 ? (
        <p className="text-center text-slate-500">
          Supervised students will appear here once added in the admin panel.
        </p>
      ) : (
        <div className="space-y-8">
          {groups.map((group, index) => (
            <section key={group.category}>
              <h3 className="mb-4 text-base font-bold text-slate-900 md:text-lg">
                {group.category}
              </h3>
              <ul className="list-disc space-y-4 pl-5">
                {group.students.map((student) => (
                  <StudentEntry key={student.id} student={student} />
                ))}
              </ul>
              {index < groups.length - 1 ? (
                <hr className="mt-8 border-0 border-t border-dashed border-slate-300" />
              ) : null}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export function StudentsPageContent({ students }: { students: SupervisedStudentPublic[] }) {
  return (
    <div className="mx-auto max-w-4xl">
      <StudentsPanel students={students} />
    </div>
  );
}
