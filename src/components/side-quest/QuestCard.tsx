import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import type { Quest } from "@/hooks/useQuestList"

interface QuestCardProps {
  quest: Quest
  isCompleted: boolean
  index: number
}

const borderColor: Record<string, string> = {
  Mudah: "border-l-blue-500",
  Menengah: "border-l-amber-500",
  Sulit: "border-l-red-500",
}

const tingkatBadge: Record<string, string> = {
  Mudah: "bg-blue-100 text-blue-700",
  Menengah: "bg-amber-100 text-amber-700",
  Sulit: "bg-red-100 text-red-700",
}

function getDaysLeft(createdAt: string, deadlineDays: number): { label: string; expired: boolean } {
  const created = new Date(createdAt)
  const deadline = new Date(created)
  deadline.setDate(deadline.getDate() + deadlineDays)
  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()
  if (diffMs <= 0) return { label: "Berakhir", expired: true }
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return { label: `${days} hari lagi`, expired: false }
}

export default function QuestCard({ quest, isCompleted, index }: QuestCardProps) {
  const navigate = useNavigate()
  const deadline = getDaysLeft(quest.created_at, quest.deadline_days)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`relative rounded-2xl bg-white border border-gray-100 border-l-4 ${borderColor[quest.tingkat] || "border-l-gray-300"} overflow-hidden transition-all duration-200 ${
        isCompleted
          ? "opacity-70 cursor-default"
          : "hover:shadow-md hover:border-gray-200 cursor-pointer active:scale-[0.99]"
      }`}
      onClick={() => {
        if (!isCompleted) navigate(`/side-quest/${quest.id}`)
      }}
    >
      <div className="p-4 lg:p-5">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ backgroundColor: quest.icon_bg || "#e5e7eb" }}
          >
            {quest.icon || "📋"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${tingkatBadge[quest.tingkat] || "bg-gray-100 text-gray-600"}`}
              >
                {quest.tingkat}
              </span>
              <span className="text-[11px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {quest.mapel}
              </span>
            </div>

            <h3 className="text-sm font-bold text-gray-800 leading-snug">
              {quest.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
              {quest.description}
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="font-semibold text-amber-600">
                ⭐ +{quest.xp_reward} XP
              </span>
              <span className="font-semibold text-amber-600">
                🪙 +{quest.koin_reward} Koin
              </span>
            </div>
          </div>
        </div>

        {isCompleted ? (
          <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
            SELESAI ✓
          </span>
        ) : (
          <div className="absolute top-3 right-3">
            <span
              className={`text-[11px] font-medium ${
                deadline.expired ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {deadline.expired ? "⏰ Berakhir" : `⏳ ${deadline.label}`}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
