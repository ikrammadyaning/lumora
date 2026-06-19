import { motion } from "framer-motion"
import NodeBelajar from "./NodeBelajar"
import type { Lesson } from "@/hooks/useCourseProgress"

interface PetaBelajarProps {
  courseId: string
  lessons: Lesson[]
  completedLessons: string[]
}

function getNodeStatus(
  lessonId: string,
  completedIds: string[],
  allLessons: Lesson[]
): "selesai" | "aktif" | "terkunci" {
  if (completedIds.includes(lessonId)) return "selesai"
  const firstIncomplete = allLessons.find((l) => !completedIds.includes(l.id))
  if (firstIncomplete?.id === lessonId) return "aktif"
  return "terkunci"
}

export default function PetaBelajar({
  courseId,
  lessons,
  completedLessons,
}: PetaBelajarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="py-4">
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🗺️</span>
          <span>Peta Belajar</span>
        </h3>

        <div className="relative pl-2">
          {lessons.map((lesson, i) => {
            const status = getNodeStatus(lesson.id, completedLessons, lessons)
            return (
              <NodeBelajar
                key={lesson.id}
                lesson={lesson}
                courseId={courseId}
                status={status}
                isLast={i === lessons.length - 1}
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
