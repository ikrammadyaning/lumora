import { useSocketPlayer } from "@/hooks/useSocketPlayer"
import { useCourseProgress } from "@/hooks/useCourseProgress"

export default function PetaKurikulum() {
  const { player, loading } = useSocketPlayer()
  const { courses, lessonsByCourse, completedLessons } = useCourseProgress()

  const getProgress = (courseId: string) => {
    const lessons = lessonsByCourse[courseId] || []
    if (lessons.length === 0) return 0
    const completed = lessons.filter((l) => completedLessons.includes(l.id)).length
    return Math.round((completed / lessons.length) * 100)
  }

  if (loading || !player) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-4 border border-gray-100 animate-pulse" style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 mb-3" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {courses.map((item) => {
        const progressPercent = getProgress(item.id)

        const statusLabel =
          progressPercent >= 100
            ? "Selesai"
            : progressPercent > 0
              ? "Sedang Belajar"
              : "Belum Mulai"

        const statusColor =
          progressPercent >= 100
            ? "text-emerald-600"
            : progressPercent > 0
              ? "text-blue-600"
              : "text-gray-400"

        return (
          <a
            key={item.id}
            href="#"
            className="group rounded-2xl p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200" style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <div
              className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform duration-200`}
            >
              {item.icon}
            </div>

            <h4 className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
              {item.name}
            </h4>

            <p className={`text-[10px] font-semibold mt-0.5 ${statusColor}`}>
              {statusLabel}
            </p>

            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < Math.round(progressPercent / 20)
                      ? "bg-emerald-400"
                      : "bg-gray-200"
                  }`}
                />
              ))}
              <span className="text-[10px] font-semibold text-gray-400 ml-1">
                {progressPercent}%
              </span>
            </div>
          </a>
        )
      })}
    </div>
  )
}
