import { useEffect, useCallback, useState } from "react"
import { useSocketContext } from "@/context/SocketProvider"
import { useUser } from "@/context/UserContext"

export interface LessonCompletedData {
  lessonId: string
  xpGained: number
  newXp: number
  newLevel: number
  leveledUp: boolean
  updatedProgress: string[]
  nextLessonId: string | null
}

export function useSocket() {
  const { socket } = useSocketContext()
  const { user } = useUser()
  const [lessonCompleted, setLessonCompleted] = useState<LessonCompletedData | null>(null)
  const [lessonAlreadyDone, setLessonAlreadyDone] = useState<string | null>(null)

  useEffect(() => {
    if (!socket) return

    const onLessonCompleted = (data: LessonCompletedData) => {
      setLessonCompleted(data)
    }

    const onLessonAlreadyDone = (data: { lessonId: string }) => {
      setLessonAlreadyDone(data.lessonId)
    }

    socket.on("lesson_completed", onLessonCompleted)
    socket.on("lesson_already_done", onLessonAlreadyDone)

    return () => {
      socket.off("lesson_completed", onLessonCompleted)
      socket.off("lesson_already_done", onLessonAlreadyDone)
    }
  }, [socket])

  const completeLesson = useCallback(
    (lessonId: string) => {
      if (!user || !socket) return
      socket.emit("complete_lesson", { userId: user.id, lessonId })
    },
    [user?.id, socket]
  )

  const clearLessonCompleted = useCallback(() => setLessonCompleted(null), [])
  const clearLessonAlreadyDone = useCallback(() => setLessonAlreadyDone(null), [])

  return {
    lessonCompleted,
    lessonAlreadyDone,
    completeLesson,
    clearLessonCompleted,
    clearLessonAlreadyDone,
  }
}
