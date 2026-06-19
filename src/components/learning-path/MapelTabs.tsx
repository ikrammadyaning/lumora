import { useRef, useEffect } from "react"
import type { Course } from "@/hooks/useCourseProgress"

interface MapelTabsProps {
  courses: Course[]
  activeId: string
  onSelect: (id: string) => void
}

export default function MapelTabs({ courses, activeId, onSelect }: MapelTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current
      const el = activeRef.current
      const offset = el.offsetLeft - container.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2
      container.scrollTo({ left: offset, behavior: "smooth" })
    }
  }, [activeId])

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0"
    >
      <div className="flex gap-2 pb-1 min-w-max">
        {courses.map((course) => (
          <button
            key={course.id}
            ref={course.id === activeId ? activeRef : undefined}
            onClick={() => onSelect(course.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeId === course.id
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
          >
            <span className="text-base">{course.icon}</span>
            <span>{course.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
