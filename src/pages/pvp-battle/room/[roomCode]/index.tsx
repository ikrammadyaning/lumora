import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import RoomCodeCard from "@/components/pvp/RoomCodeCard"
import PlayerSlotList from "@/components/pvp/PlayerSlotList"
import RoomActionButtons from "@/components/pvp/RoomActionButtons"
import { useSocketContext } from "@/context/SocketProvider"
import { useUser } from "@/context/UserContext"
import type { PlayerData } from "@/components/pvp/PlayerSlotItem"

export interface RoomData {
  roomCode: string
  hostId: string
  mode: string
  mapelId: string
  status: "lobby" | "battling" | "finished"
  players: Array<{
    userId: string
    nama: string
    asalSekolah: string
    avatarUrl: string | null
    isReady: boolean
    isBot: boolean
    socketId: string | null
    score: number
  }>
  createdAt: number
}

export default function RoomLobbyPage() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()
  const { socket } = useSocketContext()
  const [room, setRoom] = useState<RoomData | null>((location.state as { room?: RoomData })?.room ?? null)

  useEffect(() => {
    if (!socket || !roomCode) return

    const onRoomUpdated = ({ room }: { room: RoomData }) => {
      setRoom(room)
    }

    const onBattleStarted = ({ room }: { room: RoomData }) => {
      setRoom(room)
      navigate(`/pvp-battle/battle/${roomCode}`)
    }

    const onRoomError = ({ message }: { message: string }) => {
      alert(message)
    }

    socket.on("room_updated", onRoomUpdated)
    socket.on("battle_started", onBattleStarted)
    socket.on("room_error", onRoomError)

    socket.emit("request_room_state", { roomCode })

    return () => {
      socket.off("room_updated", onRoomUpdated)
      socket.off("battle_started", onBattleStarted)
      socket.off("room_error", onRoomError)
    }
  }, [socket, roomCode, navigate])

  const toggleReady = () => {
    if (!user || !roomCode) return
    socket?.emit("toggle_ready", { userId: user.id, roomCode })
  }

  const handleMulaiBattle = () => {
    if (!user || !roomCode) return
    socket?.emit("start_battle", { userId: user.id, roomCode })
  }

  const myPlayer = room?.players.find(p => p.userId === user?.id)
  const isHost = room?.hostId === user?.id
  const allHumanPlayersReady = room?.players
    .filter(p => !p.isBot)
    .every(p => p.isReady) ?? false
  const canStartBattle = isHost && allHumanPlayersReady
  const isRoomLobby = room?.status === "lobby"

  const displayCode = roomCode || ""

  const players: PlayerData[] = (room?.players ?? []).map(p => ({
    userId: p.userId,
    nama: p.nama,
    asalSekolah: p.asalSekolah,
    avatarUrl: p.avatarUrl,
    frameConfig: (p as any).frameConfig || null,
    isReady: p.isReady,
    isBot: p.isBot,
    score: p.score,
    isMe: p.userId === user?.id,
  }))

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Sidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 px-4 lg:px-8 py-6 pb-32 lg:pb-28">
          <div className="max-w-xl mx-auto space-y-5">
            <RoomCodeCard roomCode={displayCode} />
            <PlayerSlotList players={players} />
          </div>
        </main>

        <RoomActionButtons
          isReady={myPlayer?.isReady ?? false}
          isHost={isHost}
          canStartBattle={canStartBattle}
          isRoomLobby={isRoomLobby}
          onToggleReady={toggleReady}
          onMulaiBattle={handleMulaiBattle}
        />
      </div>
    </div>
  )
}
