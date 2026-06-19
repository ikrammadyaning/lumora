import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { X, Key, Swords } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useSocketContext } from "@/context/SocketProvider"
import { useUser } from "@/context/UserContext"

export default function GabungRoomPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { socket } = useSocketContext()
  const [kodeRoom, setKodeRoom] = useState("")

  useEffect(() => {
    if (!socket) return

    const onRoomUpdated = ({ room }: { room: { roomCode: string } }) => {
      navigate(`/pvp-battle/room/${room.roomCode}`, { state: { room } })
    }

    const onRoomError = ({ message }: { message: string }) => {
      alert(message)
    }

    socket.on("room_updated", onRoomUpdated)
    socket.on("room_error", onRoomError)

    return () => {
      socket.off("room_updated", onRoomUpdated)
      socket.off("room_error", onRoomError)
    }
  }, [socket, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKodeRoom(e.target.value.toUpperCase().slice(0, 6))
  }

  const handleGabung = () => {
    if (!kodeRoom || !user) return

    socket?.emit("join_room", {
      userId: user.id,
      roomCode: kodeRoom,
    })
  }

  const isDisabled = kodeRoom.length === 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center px-4 py-6 pb-24 lg:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors mb-6"
            >
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">Kembali</span>
            </button>

            <div className="rounded-2xl shadow-lg p-8 text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                <Key className="w-full h-full" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Masukkan Kode Room
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Minta kode dari temanmu yang membuat room
              </p>

              <input
                type="text"
                placeholder="CONTOH: AB12CD"
                value={kodeRoom}
                onChange={handleInputChange}
                maxLength={6}
                className="w-full text-center text-2xl font-bold tracking-[0.3em] uppercase px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-300 placeholder:tracking-[0.3em]"
              />

              <button
                onClick={handleGabung}
                disabled={isDisabled}
                className={`w-full mt-6 h-14 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all ${
                  isDisabled
                    ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:scale-[0.98] shadow-md"
                }`}
              >
                Gabung Battle! <Swords className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
