import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Check, Play, Lock, BookOpen, FileText, PenTool, ClipboardList } from "lucide-react"
import type { Lesson } from "@/hooks/useCourseProgress"

interface LearningPathZigZagProps {
  lessons: Lesson[]
  completedLessons: string[]
  courseId: string
}

type NodeStatus = "selesai" | "aktif" | "terkunci"

function getNodeStatus(lessonId: string, completedIds: string[], all: Lesson[]): NodeStatus {
  if (completedIds.includes(lessonId)) return "selesai"
  const firstIncomplete = all.find((l) => !completedIds.includes(l.id))
  if (firstIncomplete?.id === lessonId) return "aktif"
  return "terkunci"
}

const typeIcons: Record<string, typeof BookOpen> = {
  video: Play,
  materi: BookOpen,
  latihan: PenTool,
  ujian: ClipboardList,
}

const typeLabels: Record<string, string> = {
  video: "Video",
  materi: "Materi",
  latihan: "Latihan",
  ujian: "Ujian",
}

function NodeCircle({
  status,
  lesson,
}: {
  status: NodeStatus
  lesson: Lesson
}) {
  if (status === "selesai") {
    return (
      <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-emerald-100 shadow-md">
        <Check className="w-5 h-5 text-white" strokeWidth={3} />
      </div>
    )
  }

  if (status === "aktif") {
    return (
      <div className="w-12 h-12 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center ring-4 ring-emerald-100 shadow-lg shadow-emerald-200/50 animate-pulse">
        <Play className="w-5 h-5 text-emerald-500 ml-0.5" fill="#10b981" />
      </div>
    )
  }

  return (
    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-gray-100">
      <Lock className="w-5 h-5 text-gray-400" />
    </div>
  )
}

export default function LearningPathZigZag({
  lessons,
  completedLessons,
  courseId,
}: LearningPathZigZagProps) {
  const navigate = useNavigate()
  const [tooltipId, setTooltipId] = useState<string | null>(null)

  const handleNodeClick = (lessonId: string, status: NodeStatus) => {
    if (status === "aktif" || status === "selesai") {
      navigate(`/jalur-belajar/${courseId}/${lessonId}`)
    }
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400 text-sm font-medium">Materi segera hadir</p>
        <p className="text-gray-300 text-xs mt-1">Tim pengajar sedang menyusun materi untuk mapel ini</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Center dashed line - desktop only */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
        <div className="w-full h-full border-l-2 border-dashed border-gray-300" />
      </div>

      {/* Mobile left line */}
      <div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5">
        <div className="w-full h-full border-l-2 border-dashed border-gray-300" />
      </div>

      <div className="space-y-0">
        {lessons.map((lesson, i) => {
          const status = getNodeStatus(lesson.id, completedLessons, lessons)
          const isLeft = i % 2 === 0
          const TypeIcon = typeIcons[lesson.type] || BookOpen

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="relative"
            >
              {/* Desktop alternating layout */}
              <div className="hidden md:flex items-center py-4">
                {/* Left content */}
                <div className={`w-[calc(50%-2rem)] ${isLeft ? "text-right pr-8" : "text-left pl-8 order-3"}`}>
                  <div className={`inline-block ${!isLeft ? "text-left" : "text-right"}`}>
                    <button
                      onClick={() => handleNodeClick(lesson.id, status)}
                      disabled={status === "terkunci"}
                      className={`text-sm font-semibold leading-tight transition-colors ${
                        status === "terkunci"
                          ? "text-gray-400 cursor-not-allowed"
                          : status === "aktif"
                            ? "text-emerald-700 hover:text-emerald-600"
                            : "text-gray-800 hover:text-emerald-600"
                      }`}
                    >
                      {lesson.title}
                    </button>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                      <TypeIcon className="w-3.5 h-3.5" />
                      <span>{typeLabels[lesson.type]}</span>
                    </div>
                  </div>
                </div>

                {/* Center node */}
                <div className="relative z-10 flex justify-center w-16 shrink-0">
                  <div
                    className="relative"
                    onMouseEnter={() => status === "terkunci" && setTooltipId(lesson.id)}
                    onMouseLeave={() => setTooltipId(null)}
                  >
                    <button
                      onClick={() => handleNodeClick(lesson.id, status)}
                      disabled={status === "terkunci"}
                      className={`transition-transform ${
                        status === "aktif"
                          ? "cursor-pointer hover:scale-110"
                          : status === "selesai"
                            ? "cursor-pointer hover:scale-105"
                            : "cursor-not-allowed"
                      }`}
                    >
                      <NodeCircle status={status} lesson={lesson} />
                    </button>

                    {tooltipId === lesson.id && status === "terkunci" && (
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                        Selesaikan materi sebelumnya dulu!
                        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-900 rotate-45" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right spacer */}
                <div className="w-[calc(50%-2rem)]" />
              </div>

              {/* Mobile layout (all on left) */}
              <div className="md:hidden flex items-start gap-4 py-4 pl-0">
                <div className="relative z-10 shrink-0 ml-4">
                  <button
                    onClick={() => handleNodeClick(lesson.id, status)}
                    disabled={status === "terkunci"}
                    onMouseEnter={() => status === "terkunci" && setTooltipId(lesson.id)}
                    onMouseLeave={() => setTooltipId(null)}
                    className={`transition-transform ${
                      status === "aktif"
                        ? "cursor-pointer hover:scale-110"
                        : status === "selesai"
                          ? "cursor-pointer hover:scale-105"
                          : "cursor-not-allowed"
                    }`}
                  >
                    <NodeCircle status={status} lesson={lesson} />
                  </button>

                  {tooltipId === lesson.id && status === "terkunci" && (
                    <div className="absolute left-14 top-0 z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                      Selesaikan materi sebelumnya dulu!
                      <div className="absolute left-0 top-3 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </div>

                <div className={`flex-1 min-w-0 pt-2 ${status === "terkunci" ? "opacity-50" : ""}`}>
                  <button
                    onClick={() => handleNodeClick(lesson.id, status)}
                    disabled={status === "terkunci"}
                    className={`text-sm font-semibold text-left leading-tight ${
                      status === "terkunci"
                        ? "text-gray-400"
                        : status === "aktif"
                          ? "text-emerald-700"
                          : "text-gray-800"
                    }`}
                  >
                    {lesson.title}
                  </button>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                    <TypeIcon className="w-3.5 h-3.5" />
                    <span>{typeLabels[lesson.type]}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
          </div>
          <span>Selesai</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
            <Play className="w-2.5 h-2.5 text-emerald-500 ml-0.5" fill="#10b981" />
          </div>
          <span>Aktif</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 text-gray-400" />
          </div>
          <span>Terkunci</span>
        </div>
      </div>
    </div>
  )
}
