export type TeachingCoursePublic = {
  id: string;
  name: string;
};

type TeachingPanelProps = {
  courses: TeachingCoursePublic[];
  showPanelTitle?: boolean;
};

function TeachingCourseList({ courses }: { courses: TeachingCoursePublic[] }) {
  if (courses.length === 0) {
    return (
      <p className="text-center text-slate-500">
        Courses will appear here once added in the admin panel.
      </p>
    );
  }

  return (
    <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-800 md:text-[15px]">
      {courses.map((course) => (
        <li key={course.id}>{course.name}</li>
      ))}
    </ul>
  );
}

function TeachingPanel({ courses, showPanelTitle = false }: TeachingPanelProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-sm md:px-8 md:py-8">
      {showPanelTitle ? (
        <h2 className="mb-4 border-b border-slate-200 pb-3 text-xl font-semibold text-[var(--btrust-teal)] md:text-2xl">
          Teaching
        </h2>
      ) : null}
      <h3 className="mb-4 text-base font-bold text-slate-900 md:text-lg">Courses Taught</h3>
      <TeachingCourseList courses={courses} />
    </div>
  );
}

/** Standalone content for `/teaching`. */
export function TeachingPageContent({ courses }: { courses: TeachingCoursePublic[] }) {
  return (
    <div className="mx-auto max-w-4xl">
      <TeachingPanel courses={courses} showPanelTitle />
    </div>
  );
}
