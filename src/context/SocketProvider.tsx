import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react"
import { io, type Socket } from "socket.io-client"
import { useUser } from "@/context/UserContext"
import { getCourses, type Course } from "@/lib/queries"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001"

export interface PlayerState {
  userId: string
  username: string
  avatarUrl: string | null
  level: number
  xp: number
  xpCurrent: number
  xpMax: number
  coins: number
  streak: number
  lastLoginDate: string | null
  completedNodes: string[]
  quests: Array<{
    id: string
    title: string
    category: string
    category_color: string
    progress: number
    total: number
    reward_xp: number
    reward_coins: number
    is_completed: boolean
  }>
  leaderboard: Array<{
    id: string
    username: string
    full_name: string
    xp: number
    level: number
    avatarUrl: string | null
    frameConfig: Record<string, any> | null
  }>
}

export interface StreakPopupData {
  streakCount: number
  nextTarget: number
  reward: number
  message: string
}

export interface XpToastData {
  xpGained: number
}

export interface LevelUpData {
  newLevel: number
  userId: string
}

interface SocketContextType {
  socket: Socket | null
  connected: boolean
  player: PlayerState | null
  streakPopup: StreakPopupData | null
  showStreakPopup: boolean
  xpToast: XpToastData | null
  levelUpData: LevelUpData | null
  courses: Course[]
  leaderboard: Array<{ id: string; username: string; full_name: string; xp: number; level: number; avatarUrl: string | null; frameConfig: Record<string, any> | null }>
  loading: boolean
  closeStreakPopup: () => void
  clearXpToast: () => void
  clearLevelUp: () => void
  gainXp: (amount: number) => void
  gainCoins: (amount: number) => void
  completeQuest: (questId: string) => void
  completeNode: (nodeId: string, tipe: string) => void
}

const SocketContext = createContext<SocketContextType | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user: authUser, loading: authLoading } = useUser()
  const socketRef = useRef<Socket | null>(null)
  const hasLoggedInRef = useRef(false)

  const [connected, setConnected] = useState(false)
  const [player, setPlayer] = useState<PlayerState | null>(null)
  const [streakPopup, setStreakPopup] = useState<StreakPopupData | null>(null)
  const [showStreakPopup, setShowStreakPopup] = useState(false)
  const [xpToast, setXpToast] = useState<XpToastData | null>(null)
  const [levelUpData, setLevelUpData] = useState<LevelUpData | null>(null)
  const [courses, setCourses] = useState<Course[]>([])

  const leaderboard = player?.leaderboard ?? []

  useEffect(() => {
    getCourses().then(setCourses)
  }, [])

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnection: true,
      })
    }

    const socket = socketRef.current

    const onConnect = () => {
      console.log("Socket Connected:", socket.id)
      setConnected(true)
    }

    const onDisconnect = () => {
      console.log("Socket Disconnected:", socket.id)
      setConnected(false)
    }

    const onPlayerState = (data: PlayerState | null) => {
      setPlayer(data)
    }

    const onStreakPopup = (data: StreakPopupData) => {
      setStreakPopup(data)
      const today = new Date().toISOString().split("T")[0]
      const key = `streak_shown_${today}`
      if (!localStorage.getItem(key)) {
        setShowStreakPopup(true)
        localStorage.setItem(key, "true")
      }
    }

    const onXpToast = (data: XpToastData) => {
      setXpToast(data)
    }

    const onLevelUp = (data: LevelUpData) => {
      setLevelUpData(data)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("player_state", onPlayerState)
    socket.on("show_streak_popup", onStreakPopup)
    socket.on("xp_toast", onXpToast)
    socket.on("level_up", onLevelUp)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("player_state", onPlayerState)
      socket.off("show_streak_popup", onStreakPopup)
      socket.off("xp_toast", onXpToast)
      socket.off("level_up", onLevelUp)
    }
  }, [])

  useEffect(() => {
    if (authLoading) return

    const socket = socketRef.current
    if (!socket) return

    if (!authUser) {
      if (socket.connected) {
        socket.disconnect()
      }
      hasLoggedInRef.current = false
      setConnected(false)
      setPlayer(null)
      setStreakPopup(null)
      setShowStreakPopup(false)
      setXpToast(null)
      setLevelUpData(null)
      return
    }

    if (!socket.connected) return

    if (!hasLoggedInRef.current) {
      console.log("Emit user_login:", authUser.id)
      socket.emit("user_login", { userId: authUser.id })
      hasLoggedInRef.current = true
    }
  }, [authUser?.id, authLoading, connected])

  const closeStreakPopup = useCallback(() => {
    setShowStreakPopup(false)
  }, [])

  const clearXpToast = useCallback(() => setXpToast(null), [])
  const clearLevelUp = useCallback(() => setLevelUpData(null), [])

  const gainXp = useCallback(
    (amount: number) => {
      if (!authUser || !socketRef.current?.connected) return
      socketRef.current.emit("gain_xp", { userId: authUser.id, amount })
    },
    [authUser?.id]
  )

  const gainCoins = useCallback(
    (amount: number) => {
      if (!authUser || !socketRef.current?.connected) return
      socketRef.current.emit("gain_coins", { userId: authUser.id, amount })
    },
    [authUser?.id]
  )

  const completeQuest = useCallback(
    (questId: string) => {
      if (!authUser || !socketRef.current?.connected) return
      socketRef.current.emit("complete_quest", { userId: authUser.id, questId })
    },
    [authUser?.id]
  )

  const completeNode = useCallback(
    (nodeId: string, tipe: string) => {
      if (!authUser || !socketRef.current?.connected) return
      socketRef.current.emit("complete_node", {
        userId: authUser.id,
        nodeId,
        tipe,
      })
    },
    [authUser?.id]
  )

  const loading = authLoading || (!player && !authLoading && !!authUser)

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        player,
        streakPopup,
        showStreakPopup,
        xpToast,
        levelUpData,
        courses,
        leaderboard,
        loading,
        closeStreakPopup,
        clearXpToast,
        clearLevelUp,
        gainXp,
        gainCoins,
        completeQuest,
        completeNode,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const ctx = useContext(SocketContext)
  if (!ctx) {
    throw new Error("useSocketContext must be used within a SocketProvider")
  }
  return ctx
}
