import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useSocketPlayer } from "@/hooks/useSocketPlayer"
import { useCourseProgress } from "@/hooks/useCourseProgress"

export default function JalurBelajar() {
  const { player } = useSocketPlayer()
  const { courses, lessonsByCourse, completedLessons } = useCourseProgress()

  if (!player) return null

  const activeCourse = courses.find((c) => {
    const lessons = lessonsByCourse[c.id] || []
    const completed = lessons.filter((l) => completedLessons.includes(l.id)).length
    return completed > 0 && completed < lessons.length
  }) || courses[0]

  if (!activeCourse) {
    return (
      <div className="rounded-2xl border border-gray-100 p-5" style={{ backgroundColor: 'var(--card-bg)' }}>
        <p className="text-sm text-gray-400">Belum ada kursus tersedia.</p>
      </div>
    )
  }

  const lessons = lessonsByCourse[activeCourse.id] || []
  const completedCount = lessons.filter((l) => completedLessons.includes(l.id)).length
  const progressPercent = lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : 0

  return (
    <div className="rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl shrink-0">
            {activeCourse.icon}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">
              {progressPercent >= 100 ? "Selesai" : completedCount > 0 ? "Sedang Dipelajari" : "Belum Mulai"}
            </p>
            <h3 className="text-base font-bold text-gray-800 mt-0.5">
              {activeCourse.kitab || activeCourse.name}
            </h3>
            {activeCourse.ustadz && (
              <p className="text-xs text-gray-400 mt-0.5">
                🎙️ {activeCourse.ustadz}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-gray-500 font-medium">{activeCourse.name}</span>
          <span className="font-bold text-emerald-600">{progressPercent}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </div>

      <Link
        to="/jalur-belajar"
        className="inline-block mt-4 text-sm font-bold text-white hover:bg-emerald-600 px-5 py-2.5 rounded-xl transition-colors" style={{ backgroundColor: 'var(--accent-color)' }}
      >
        {progressPercent >= 100 ? "Ulangi" : completedCount > 0 ? "Lanjutkan Belajar" : "Mulai Belajar"}
      </Link>
    </div>
  )
}
