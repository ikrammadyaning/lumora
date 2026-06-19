import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Loader2 } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import MapelTabs from "@/components/learning-path/MapelTabs"
import ActiveCourseCard from "@/components/learning-path/ActiveCourseCard"
import LearningPathZigZag from "@/components/learning-path/LearningPathZigZag"
import { useCourseProgress } from "@/hooks/useCourseProgress"
import { useSocketPlayer } from "@/hooks/useSocketPlayer"
import { useSocket } from "@/hooks/useSocket"

function Skeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <div className="px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-28 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JalurBelajarPage() {
  const { player, loading: playerLoading } = useSocketPlayer()
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
    return <Skeleton />
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Memuat data pengguna...</p>
        </div>
      </div>
    )
  }

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0] || null
  const activeLessons = activeCourse ? lessonsByCourse[activeCourse.id] || [] : []
  const completedCount = activeLessons.filter((l) => completedLessons.includes(l.id)).length

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-500" />
              Jalur Belajar
            </h1>
            <p className="text-sm text-gray-400">Pilih mata pelajaran dan ikuti peta belajarmu</p>
          </motion.div>

          {courses.length > 0 && (
            <MapelTabs
              courses={courses}
              activeId={activeCourseId}
              onSelect={setActiveCourseId}
            />
          )}

          {courses.length === 0 && (
            <div className="text-center py-10">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Belum ada mata pelajaran tersedia</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeCourse && (
              <motion.div
                key={activeCourseId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <ActiveCourseCard
                  course={activeCourse}
                  completedCount={completedCount}
                  totalCount={activeLessons.length}
                />

                <LearningPathZigZag
                  lessons={activeLessons}
                  completedLessons={completedLessons}
                  courseId={activeCourse.id}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
