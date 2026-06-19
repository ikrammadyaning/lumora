import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { X, Loader2, BookOpen, AlertCircle } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import QuestSuccessPopup from "@/components/side-quest/QuestSuccessPopup"
import { supabase } from "@/lib/supabase"
import { giveReward } from "@/lib/rewardHandler"
import { useUser } from "@/context/UserContext"
import { useSocketContext } from "@/context/SocketProvider"
import type { Quest } from "@/hooks/useQuestList"

const tingkatBadge: Record<string, string> = {
  Mudah: "bg-blue-100 text-blue-700",
  Menengah: "bg-amber-100 text-amber-700",
  Sulit: "bg-red-100 text-red-700",
}

function getDeadlineInfo(createdAt: string, deadlineDays: number) {
  const created = new Date(createdAt)
  const deadline = new Date(created)
  deadline.setDate(deadline.getDate() + deadlineDays)
  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()
  if (diffMs <= 0) return { label: "Waktu habis", expired: true }
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  if (days > 0) return { label: `${days} hari ${hours} jam lagi`, expired: false }
  return { label: `${hours} jam lagi`, expired: false }
}

export default function QuestDetailPage() {
  const { questId } = useParams<{ questId: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const { socket } = useSocketContext()

  const [quest, setQuest] = useState<Quest | null>(null)
  const [loading, setLoading] = useState(true)
  const [esaiText, setEsaiText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [alreadyDone, setAlreadyDone] = useState(false)

  useEffect(() => {
  if (!questId) return

  const loadQuest = async () => {
    setLoading(true)

    try {
      // Ambil data quest
      const { data, error } = await supabase
        .from("quests")
        .select("*")
        .eq("id", questId)
        .single()

      if (error || !data) {
        setQuest(null)
      } else {
        setQuest(data as Quest)
      }

      // Cek apakah user sudah pernah mengerjakan
      if (user) {
        const { data: submission } = await supabase
          .from("quest_submissions")
          .select("id")
          .eq("user_id", user.id)
          .eq("quest_id", questId)
          .maybeSingle()

        setAlreadyDone(!!submission)
      }
    } catch (err) {
      console.error(err)
      setQuest(null)
    } finally {
      setLoading(false)
    }
  }

  loadQuest()
}, [questId, user])

  const handleSubmit = useCallback(async () => {
    if (!quest || !user || submitting) return
    setSubmitting(true)
    setError("")

    const { error: insertError } = await supabase
      .from("quest_submissions")
      .insert({
        user_id: user.id,
        quest_id: quest.id,
        jawaban: esaiText,
        xp_gained: quest.xp_reward,
        koin_gained: quest.koin_reward,
      })

    if (insertError) {
      if (insertError.code === "23505") {
        setError("Quest ini sudah pernah kamu kerjakan")
      } else {
        setError(insertError.message)
      }
      setSubmitting(false)
      return
    }

    const result = await giveReward(
      user.id,
      quest.xp_reward,
      ((quest as any).diamond_reward || 0) + (quest.koin_reward || 0)
    )

    if (!result.success) {
      setError(result.error || "Gagal menyimpan reward")
      setSubmitting(false)
      return
    }

    if (socket?.connected) {
      socket.emit("notify_xp", {
        userId: user.id,
        xpGained: quest.xp_reward,
        coinsGained: ((quest as any).diamond_reward || 0) + (quest.koin_reward || 0),
        newXp: result.newXp,
        newCoins: result.newCoins,
        newLevel: result.newLevel,
        leveledUp: result.leveledUp,
      })
    }

    setShowSuccess(true)
    setSubmitting(false)
  }, [quest, user, esaiText, submitting, socket])

  useEffect(() => {
    if (!showSuccess) return
    const timer = setTimeout(() => {
      setShowSuccess(false)
      navigate("/side-quest")
    }, 2000)
    return () => clearTimeout(timer)
  }, [showSuccess, navigate])

  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false)
    navigate("/side-quest")
  }, [navigate])

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

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center px-4">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-4">Quest tidak ditemukan</p>
          <button
            onClick={() => navigate("/side-quest")}
            className="text-emerald-500 font-semibold text-sm hover:underline"
          >
            Kembali ke Side Quest
          </button>
        </div>
      </div>
    )
  }

  const deadline = getDeadlineInfo(quest.created_at, quest.deadline_days)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
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
              {quest.title}
            </h1>
          </div>
        </header>

        <div className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-5 max-w-2xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${tingkatBadge[quest.tingkat] || "bg-gray-100 text-gray-600"}`}
              >
                {quest.tingkat}
              </span>
              <span className="text-xs font-medium bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                {quest.mapel}
              </span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {quest.description}
              </p>
            </div>

            <div className="flex items-center gap-5 text-sm">
              <div className="flex items-center gap-1.5 font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                <span>⭐</span>
                <span>+{quest.xp_reward} XP</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                <span>🪙</span>
                <span>+{quest.koin_reward} Koin</span>
              </div>
              <span
                className={`text-xs font-medium ${
                  deadline.expired ? "text-gray-400" : "text-gray-500"
                }`}
              >
                ⏳ {deadline.label}
              </span>
            </div>

            {alreadyDone && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    Quest sudah selesai
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    Kamu sudah mengerjakan quest ini sebelumnya
                  </p>
                </div>
              </div>
            )}

            {!alreadyDone && !deadline.expired && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Tuliskan jawabanmu
                  </label>
                  <textarea
                    value={esaiText}
                    onChange={(e) => setEsaiText(e.target.value)}
                    placeholder="Tuliskan jawabanmu di sini..."
                    rows={8}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 resize-none transition-all"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={
                        esaiText.length < 100
                          ? "text-gray-400"
                          : "text-emerald-500 font-medium"
                      }
                    >
                      {esaiText.length} karakter
                      {esaiText.length < 100 &&
                        ` (minimal ${100 - esaiText.length} lagi)`}
                    </span>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 font-medium">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={esaiText.length < 100 || submitting}
                  className="w-full h-14 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:shadow-none" style={{ backgroundColor: 'var(--accent-color)' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "KUMPULKAN ESAI ⚡"
                  )}
                </button>
              </>
            )}

            {deadline.expired && !alreadyDone && (
              <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-700">
                    Waktu pengerjaan habis
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Batas waktu quest ini sudah berakhir
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <QuestSuccessPopup
        show={showSuccess}
        xpGained={quest.xp_reward}
        koinGained={quest.koin_reward}
        onComplete={handleSuccessClose}
      />
    </div>
  )
}
