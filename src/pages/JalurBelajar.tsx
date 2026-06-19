import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import StreakPopup from "@/components/StreakPopup"
import MapelTabs from "@/components/MapelTabs"
import JalurAktifCard from "@/components/JalurAktifCard"
import PetaBelajar from "@/components/PetaBelajar"
import XpToast from "@/components/XpToast"
import LevelUpPopup from "@/components/LevelUpPopup"
import { useSocketPlayer } from "@/hooks/useSocketPlayer"
import { useSocket } from "@/hooks/useSocket"
import { useCourseProgress } from "@/hooks/useCourseProgress"

export default function JalurBelajarPage() {
  const {
    player, loading: playerLoading, showStreakPopup, streakPopup, closeStreakPopup,
    xpToast, levelUpData, clearXpToast, clearLevelUp,
  } = useSocketPlayer()
  const { courses, lessonsByCourse, completedLessons, lessonsReady, loading: dataLoading, addCompletedLesson } = useCourseProgress()
  const { lessonCompleted, clearLessonCompleted } = useSocket()

  const [activeCourseId, setActiveCourseId] = useState<string>("")

  useEffect(() => {
    if (courses.length > 0 && !activeCourseId) {
      setActiveCourseId(courses[0].id)
    }
  }, [courses])

  useEffect(() => {
    if (!lessonCompleted) return
    addCompletedLesson(lessonCompleted.lessonId)
    clearLessonCompleted()
  }, [lessonCompleted])

  const loading = playerLoading || dataLoading

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2e2a] flex items-center justify-center">
        <p className="text-white/60 text-sm">Memuat...</p>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-[#1a2e2a] flex items-center justify-center">
        <p className="text-white/60 text-sm">Silakan login terlebih dahulu.</p>
      </div>
    )
  }

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0]
  const activeLessons = activeCourse ? lessonsByCourse[activeCourse.id] || [] : []

  const completedCount = activeLessons.filter((l) => completedLessons.includes(l.id)).length

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">📚 Jalur Belajar</h1>
            <p className="text-sm text-gray-400">Pilih mata pelajaran dan ikuti peta belajarmu</p>
          </div>

          <MapelTabs
            courses={courses}
            activeId={activeCourseId}
            onSelect={setActiveCourseId}
          />

          {activeCourse && (
            <JalurAktifCard
              icon={activeCourse.icon}
              name={activeCourse.name}
              kitab={activeCourse.kitab}
              bgColor={activeCourse.color}
              completedCount={completedCount}
              totalCount={activeLessons.length}
            />
          )}

          {!lessonsReady && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-400 text-sm font-medium">Materi sedang disiapkan</p>
              <p className="text-gray-300 text-xs mt-1">Tim pengajar kami sedang menyusun materi untuk mapel ini</p>
            </div>
          )}

          {lessonsReady && activeCourse && activeLessons.length > 0 && (
            <PetaBelajar
              courseId={activeCourse.id}
              lessons={activeLessons}
              completedLessons={completedLessons}
            />
          )}

          {lessonsReady && activeCourse && activeLessons.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-400 text-sm font-medium">Materi sedang disiapkan</p>
              <p className="text-gray-300 text-xs mt-1">Tim pengajar kami sedang menyusun materi untuk mapel ini</p>
            </div>
          )}
        </main>
      </div>

      {xpToast && <XpToast xpGained={xpToast.xpGained} onComplete={clearXpToast} />}

      {levelUpData && (
        <LevelUpPopup newLevel={levelUpData.newLevel} onClose={clearLevelUp} />
      )}

      {streakPopup && (
        <StreakPopup
          isOpen={showStreakPopup}
          streakCount={streakPopup.streakCount}
          nextTarget={streakPopup.nextTarget}
          onClose={closeStreakPopup}
        />
      )}
    </div>
  )
}
