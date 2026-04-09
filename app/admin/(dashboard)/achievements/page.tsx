import { AchievementsManagement } from "@/app/admin/AchievementsManagement";

export default function AchievementsPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Achievements</h2>
        <p className="mt-1 text-sm text-slate-600">
          Achievements, invited talks, or short-term programs—with text for each.
        </p>
      </header>
      <AchievementsManagement />
    </div>
  );
}
