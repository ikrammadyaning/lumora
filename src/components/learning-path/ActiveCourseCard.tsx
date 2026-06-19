import type { Course } from "@/hooks/useCourseProgress"

interface ActiveCourseCardProps {
  course: Course
  completedCount: number
  totalCount: number
}

export default function ActiveCourseCard({ course, completedCount, totalCount }: ActiveCourseCardProps) {
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-sm">🎯</span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
          Jalur Aktif
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 leading-tight">
        {course.icon} {course.name}
      </h3>
      {course.kitab && (
        <p className="text-sm text-gray-500 mt-0.5">📖 {course.kitab}</p>
      )}

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-gray-500 font-medium">Progress</span>
          <span className="font-semibold text-emerald-600">{progress}% selesai</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>⭐</span>
          <span>+50 XP</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>💎</span>
          <span>+20 Diamond</span>
        </div>
      </div>
    </div>
  )
}
