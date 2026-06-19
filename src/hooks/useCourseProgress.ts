import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/context/UserContext"

export interface Course {
  id: string
  name: string
  icon: string
  color: string
  kitab: string | null
  ustadz: string | null
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  type: "video" | "materi" | "latihan" | "ujian"
  video_url: string | null
  content: string | null
  xp_reward: number
  diamond_reward: number
  order_number: number
}

export function useCourseProgress() {
  const { user } = useUser()
  const [courses, setCourses] = useState<Course[]>([])
  const [lessonsByCourse, setLessonsByCourse] = useState<Record<string, Lesson[]>>({})
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [lessonsReady, setLessonsReady] = useState(true)

  const fetchProgress = useCallback(async () => {
    if (!user) return
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("completed", true)

    setCompletedLessons((progress || []).map((p) => p.lesson_id))
  }, [user?.id])

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)

      const { data: coursesData } = await supabase
        .from("courses")
        .select("*")

      if (cancelled) return
      setCourses(coursesData || [])

      if (coursesData && coursesData.length > 0) {
        const courseIds = coursesData.map((c) => c.id)
        const { data: lessonsData, error } = await supabase
          .from("lessons")
          .select("*")
          .in("course_id", courseIds)
          .order("order_number", { ascending: true })

        if (error && error.code === "PGRST116") {
          setLessonsReady(false)
        } else if (!cancelled) {
          setLessonsReady(true)
          const grouped: Record<string, Lesson[]> = {}
          for (const lesson of lessonsData || []) {
            if (!grouped[lesson.course_id]) grouped[lesson.course_id] = []
            grouped[lesson.course_id].push(lesson)
          }
          setLessonsByCourse(grouped)
        }
      }

      await fetchProgress()
      if (!cancelled) setLoading(false)
    }

    fetchData()
    return () => { cancelled = true }
  }, [user?.id])

  const addCompletedLesson = useCallback((lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev
      return [...prev, lessonId]
    })
  }, [])

  return {
    courses,
    lessonsByCourse,
    completedLessons,
    loading,
    lessonsReady,
    addCompletedLesson,
    refetchProgress: fetchProgress,
  }
}
