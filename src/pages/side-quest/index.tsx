import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { X, Zap, Loader2 } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import QuestBanner from "@/components/side-quest/QuestBanner"
import QuestCard from "@/components/side-quest/QuestCard"
import { useUser } from "@/context/UserContext"
import { useQuestList } from "@/hooks/useQuestList"

const filters = ["Semua", "Mudah", "Menengah", "Sulit"] as const

export default function SideQuestPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { quests, submittedIds, loading } = useQuestList(user?.id || "")
  const [activeFilter, setActiveFilter] = useState<string>("Semua")

  const available = quests.filter((q) => !submittedIds.has(q.id))
  const completed = quests.filter((q) => submittedIds.has(q.id))

  const filtered =
    activeFilter === "Semua"
      ? quests
      : quests.filter((q) => q.tingkat === activeFilter)

  if (loading) {
    return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="lg:ml-[260px] min-h-screen flex flex-col">
          <div className="px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-20 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

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
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-500" />
                Side Quest
              </h1>
              <p className="text-sm text-gray-400">
                Misi sampingan yang menggiurkan ✨
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors shrink-0"
              aria-label="Kembali"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>

          <QuestBanner
            availableCount={available.length}
            completedCount={completed.length}
          />

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeFilter === f
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {quests.length === 0 && (
            <div className="text-center py-16">
              <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Belum ada quest tersedia</p>
            </div>
          )}

          {filtered.length === 0 && quests.length > 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">
                Tidak ada quest dengan tingkat "{activeFilter}"
              </p>
            </div>
          )}

          <div className="space-y-3">
            {filtered.map((quest, i) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isCompleted={submittedIds.has(quest.id)}
                index={i}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
