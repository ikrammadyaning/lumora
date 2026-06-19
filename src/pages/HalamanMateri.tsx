import { useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import VideoPlayer from "@/components/VideoPlayer"
import XpToast from "@/components/XpToast"
import LevelUpPopup from "@/components/LevelUpPopup"
import { completeLesson } from "@/lib/completeLesson"
import { useUser } from "@/context/UserContext"
import { useSocketContext } from "@/context/SocketProvider"
import { useSocketPlayer } from "@/hooks/useSocketPlayer"
import { useCourseProgress } from "@/hooks/useCourseProgress"

export default function HalamanMateri() {
  const { courseId: courseIdParam, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const { socket } = useSocketContext()
  const [completing, setCompleting] = useState(false)

  const {
    player, loading: playerLoading, xpToast, levelUpData, clearXpToast, clearLevelUp,
  } = useSocketPlayer()
  const { courses, lessonsByCourse, loading: dataLoading, addCompletedLesson } = useCourseProgress()

  const course = courseIdParam ? courses.find((c) => c.id === courseIdParam) : null
  const lessons = course ? lessonsByCourse[course.id] || [] : []
  const lesson = lessons.find((l) => l.id === lessonId)

  const handleComplete = useCallback(async () => {
    if (!lesson || !user || completing) return
    setCompleting(true)

    // lesson.diamond_reward TETAP dipakai sebagai sumber nilai
    // di tabel lessons, hanya saja hasilnya disimpan ke kolom coins
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

    setCompleting(false)
    setTimeout(() => {
      navigate("/jalur-belajar", { replace: true })
    }, 1500)
  }, [lesson, user, completing, addCompletedLesson, socket, navigate])

  const handleBack = useCallback(() => {
    navigate("/jalur-belajar")
  }, [navigate])

  const loading = playerLoading || dataLoading

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p className="text-gray-400 text-sm">Memuat...</p>
      </div>
    )
  }

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">Materi tidak ditemukan</p>
          <button
            onClick={handleBack}
            className="text-emerald-500 font-semibold text-sm hover:underline"
          >
            Kembali ke Jalur Belajar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
            <h1 className="text-sm font-bold text-gray-800 truncate flex-1">
              {lesson.title}
            </h1>
          </div>
        </header>

        <div className="flex-1 flex flex-col">
          {lesson.type === "video" ? (
            <>
              <div className="w-full bg-black" style={{ height: "65vh" }}>
                <VideoPlayer
                  videoUrl={lesson.video_url}
                  title={lesson.title}
                />
              </div>
              <div className="flex-1 bg-white px-4 lg:px-8 py-6 flex flex-col justify-center">
                <div className="max-w-lg mx-auto w-full">
                  <p className="text-center text-sm font-medium text-gray-500 mb-3">
                    Selesai menyimak?
                  </p>
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="w-full h-14 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98]" style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    {completing ? "⏳ Memproses..." : "⚡ SELESAI BELAJAR"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
                <div className="rounded-2xl p-6 shadow-sm border border-gray-100" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{lesson.title}</h3>
                  {lesson.content ? (
                    <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                      {lesson.content}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      {lesson.type === "latihan"
                        ? "Soal latihan akan segera hadir"
                        : lesson.type === "ujian"
                          ? "Ujian akan segera hadir"
                          : "Materi akan segera hadir"}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-white border-t border-gray-100 p-4 lg:p-6">
                <p className="text-center text-sm font-medium text-gray-500 mb-3">
                  Selesaikan bagian ini?
                </p>
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="w-full h-14 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98]" style={{ backgroundColor: 'var(--accent-color)' }}
                >
                  {completing
                    ? "⏳ Memproses..."
                    : lesson.type === "materi"
                      ? "✅ TANDAI SELESAI"
                      : lesson.type === "latihan"
                        ? "✅ SELESAI LATIHAN"
                        : "✅ MULAI UJIAN"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {xpToast && <XpToast xpGained={xpToast.xpGained} onComplete={clearXpToast} />}

      {levelUpData && (
        <LevelUpPopup newLevel={levelUpData.newLevel} onClose={clearLevelUp} />
      )}
    </div>
  )
}
