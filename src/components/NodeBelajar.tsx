import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Lesson } from "@/hooks/useCourseProgress"

interface NodeBelajarProps {
  lesson: Lesson
  courseId: string
  status: "selesai" | "aktif" | "terkunci"
  isLast: boolean
}

export default function NodeBelajar({ lesson, courseId, status, isLast }: NodeBelajarProps) {
  const navigate = useNavigate()
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = () => {
    if (status === "aktif" || status === "selesai") {
      navigate(`/jalur-belajar/${courseId}/${lesson.id}`)
    }
  }

  const statusConfig = {
    selesai: {
      bg: "bg-emerald-500",
      icon: "✔",
      ring: "ring-emerald-200",
    },
    aktif: {
      bg: "bg-white",
      icon: "▶",
      ring: "ring-emerald-400 ring-2 shadow-lg shadow-emerald-200/50",
    },
    terkunci: {
      bg: "bg-gray-300",
      icon: "🔒",
      ring: "ring-gray-200",
    },
  }

  const config = statusConfig[status]

  return (
    <div className="relative flex items-start gap-4">
      <div className="flex flex-col items-center">
        <button
          onClick={handleClick}
          disabled={status === "terkunci"}
          onMouseEnter={() => status === "terkunci" && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center text-sm ${config.bg} ring-4 ${config.ring} transition-all duration-200 ${
            status === "aktif"
              ? "animate-pulse cursor-pointer hover:scale-110"
              : status === "selesai"
                ? "cursor-pointer hover:scale-105"
                : "opacity-50 cursor-not-allowed"
          }`}
        >
          <span className="text-base font-bold">{config.icon}</span>
        </button>
        {!isLast && (
          <div className="w-0.5 flex-1 min-h-[40px] bg-gray-200 my-1" />
        )}
      </div>

      <div className={`pt-1.5 flex-1 ${status === "terkunci" ? "opacity-40" : ""}`}>
        <button
          onClick={handleClick}
          disabled={status === "terkunci"}
          className={`text-sm font-semibold text-left ${
            status === "terkunci"
              ? "text-gray-400"
              : status === "aktif"
                ? "text-emerald-700 hover:text-emerald-600"
                : "text-gray-700 hover:text-gray-600"
          }`}
        >
          {lesson.title}
        </button>
        <span className="block text-[11px] font-medium text-gray-400 mt-0.5 capitalize">
          {lesson.type === "video"
            ? "🎬 Video"
            : lesson.type === "materi"
              ? "📖 Materi"
              : lesson.type === "latihan"
                ? "✍️ Latihan"
                : "📋 Ujian"}
        </span>
      </div>

      {showTooltip && status === "terkunci" && (
        <div className="absolute left-14 top-0 z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
          Selesaikan materi sebelumnya dulu!
          <div className="absolute left-0 top-3 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  )
}
