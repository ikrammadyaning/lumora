import { useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { X, Loader2, BookOpen } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import VideoPlayerPlaceholder from "@/components/learning-path/VideoPlayerPlaceholder"
import RewardToast from "@/components/learning-path/RewardToast"
import { completeLesson } from "@/lib/completeLesson"
import { useUser } from "@/context/UserContext"
import { useSocketContext } from "@/context/SocketProvider"
import { useCourseProgress } from "@/hooks/useCourseProgress"

export default function MateriDetailPage() {
  const { mapel: mapelId, materi: lessonId } = useParams<{ mapel: string; materi: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const { socket } = useSocketContext()
  const [completing, setCompleting] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [rewardData, setRewardData] = useState<{ xpGained: number; coinGained: number } | null>(null)

  const { courses, lessonsByCourse, loading, addCompletedLesson } = useCourseProgress()

  const course = courses.find((c) => c.id === mapelId) || null
  const lessons = course ? lessonsByCourse[course.id] || [] : []
  const lesson = lessons.find((l) => l.id === lessonId) || null

  const handleRewardComplete = useCallback(() => {
    setShowReward(false)
    setRewardData(null)
    navigate("/jalur-belajar", { replace: true })
  }, [navigate])

  const handleComplete = useCallback(async () => {
    if (!lesson || !user || completing) return
    setCompleting(true)

    const result = await completeLesson(
      user.id,
      lesson.id,
      lesson.xp_reward,
      lesson.diamond_reward
    )

    if (result.alreadyCompleted) {
      setCompleting(false)
      alert("Materi ini sudah pernah diselesaikan")
      return
    }

    if (!result.success) {
      setCompleting(false)
      alert("Gagal menyimpan progress: " + (result.error || "Terjadi kesalahan"))
      console.error("[handleComplete] Error:", result.error)
      return
    }

    addCompletedLesson(lesson.id)
    setRewardData({ xpGained: lesson.xp_reward, coinGained: lesson.diamond_reward })

    if (socket?.connected) {
      socket.emit("notify_xp", {
        userId: user.id,
        xpGained: lesson.xp_reward,
        coinsGained: lesson.diamond_reward,
        newXp: result.newXp,
        newCoins: result.newCoins,
        newLevel: result.newLevel,
        leveledUp: result.leveledUp,
      })
    }

    setShowReward(true)
    setCompleting(false)
  }, [lesson, user, completing, addCompletedLesson, socket])

  const handleBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center px-4">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-4">Materi tidak ditemukan</p>
          <button
            onClick={() => navigate("/jalur-belajar")}
            className="text-emerald-500 font-semibold text-sm hover:underline"
          >
            Kembali ke Peta Belajar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-14">
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors shrink-0"
              aria-label="Kembali"
            >
              <X className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-bold text-gray-800 truncate">
              {lesson.title}
            </h1>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Area */}
          <motion.div
            className="w-full bg-black"
            style={{ height: "65vh" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <VideoPlayerPlaceholder
              videoUrl={lesson.video_url}
              title={lesson.title}
              ustadz={course.kitab || null}
            />
          </motion.div>

          {/* Info Ustadz - inside black area */}
          <div className="bg-black/90 px-4 lg:px-8 py-3">
            <p className="text-gray-400 text-xs">
              🎙️ Ust. {course.name}
            </p>
          </div>

          {/* Bottom Action Area */}
          <div className="flex-1 bg-white px-4 lg:px-8 py-6 flex flex-col justify-center">
            <motion.div
              className="max-w-lg mx-auto w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <p className="text-center text-sm font-medium text-gray-600 mb-4">
                Selesai menyimak?
              </p>
              <button
                onClick={handleComplete}
                disabled={completing}
                className="w-full h-14 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-emerald-200" style={{ backgroundColor: 'var(--accent-color)' }}
              >
                {completing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "⚡ LANJUT PRAKTEK"
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reward Toast */}
      <RewardToast
        show={showReward}
        xpGained={rewardData?.xpGained ?? 50}
        coinGained={rewardData?.coinGained ?? 0}
        onComplete={handleRewardComplete}
      />
    </div>
  )
}
