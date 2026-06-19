import { useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import NodeContent from "@/components/NodeContent"
import XpToast from "@/components/XpToast"
import LevelUpPopup from "@/components/LevelUpPopup"
import { useSocketPlayer } from "@/hooks/useSocketPlayer"
import { useCourseProgress } from "@/hooks/useCourseProgress"

export default function JalurBelajarNodePage() {
  const { mapel: mapelId, nodeId } = useParams<{ mapel: string; nodeId: string }>()
  const navigate = useNavigate()
  const [completing, setCompleting] = useState(false)

  const {
    player, xpToast, levelUpData, clearXpToast, clearLevelUp,
  } = useSocketPlayer()

  const { courses, lessonsByCourse, completedLessons, addCompletedLesson } = useCourseProgress()

  const course = courses.find((c) => c.id === mapelId) || null
  const lessons = course ? lessonsByCourse[course.id] || [] : []
  const lesson = lessons.find((l) => l.id === nodeId) || null

  const handleComplete = useCallback(() => {
    if (!lesson || completing) return
    setCompleting(true)
    addCompletedLesson(lesson.id)
    setTimeout(() => {
      navigate(`/jalur-belajar`, { replace: true })
    }, 1500)
  }, [lesson, addCompletedLesson, navigate, completing])

  const mapel = course ? { id: course.id, nama: course.name, icon: course.icon, kitab: course.kitab || '', ustadz: course.ustadz || '' } : null

  if (!mapel || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">Materi tidak ditemukan</p>
          <button
            onClick={() => navigate("/jalur-belajar")}
            className="text-emerald-500 font-semibold text-sm hover:underline"
          >
            Kembali ke Jalur Belajar
          </button>
        </div>
      </div>
    )
  }

  const node = { id: lesson.id, judul: lesson.title, tipe: lesson.type }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
            <button
              onClick={() => navigate("/jalur-belajar")}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
            <h1 className="text-sm font-bold text-gray-800 truncate flex-1">
              {course?.icon} {lesson.title}
            </h1>
          </div>
        </header>

        <div className="flex-1 flex flex-col">
          <NodeContent
            node={node}
            mapel={mapel}
            onComplete={handleComplete}
            completing={completing}
          />
        </div>
      </div>

      {xpToast && <XpToast xpGained={xpToast.xpGained} onComplete={clearXpToast} />}

      {levelUpData && (
        <LevelUpPopup newLevel={levelUpData.newLevel} onClose={clearLevelUp} />
      )}
    </div>
  )
}
