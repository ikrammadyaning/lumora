import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { X, Swords } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import BattleModeSelectCard from "@/components/pvp/BattleModeSelectCard"
import MapelSelectCard from "@/components/pvp/MapelSelectCard"
import { useSocketContext } from "@/context/SocketProvider"
import { useUser } from "@/context/UserContext"

const battleModes = [
  { id: "tembak-soal", nama: "Tembak Soal", icon: "🎯", description: "Jawab sebanyak mungkin soal, poin terbanyak menang" },
  { id: "kilat-menjawab", nama: "Kilat Menjawab", icon: "⚡", description: "Siapa tercepat menjawab soal dengan benar" },
  { id: "teka-teki-silang", nama: "Teka-Teki Silang", icon: "🔤", description: "Selesaikan TTS lebih cepat dari lawan" },
  { id: "koreksi-kalimat", nama: "Koreksi Kalimat", icon: "✏️", description: "Temukan dan perbaiki kalimat yang salah" },
]

const daftarMapel = [
  { id: "aqidah-dasar", nama: "Aqidah Dasar", icon: "🛡️" },
  { id: "nahwu-level-1", nama: "Nahwu (Level 1)", icon: "💬" },
  { id: "shorof-level-1", nama: "Shorof (Level 1)", icon: "✨" },
  { id: "fiqh-ibadah", nama: "Fiqh Ibadah", icon: "📖" },
  { id: "tajwid-tahsin", nama: "Tajwid & Tahsin", icon: "🎵" },
  { id: "adab-akhlaq", nama: "Adab & Akhlaq", icon: "⭐" },
  { id: "sirah-nabawiyah", nama: "Sirah Nabawiyah", icon: "🌍" },
  { id: "tafsir-juz-amma", nama: "Tafsir Juz Amma", icon: "🌙" },
]

export default function BuatRoomPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { socket } = useSocketContext()
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [selectedMapel, setSelectedMapel] = useState<string | null>(null)

  const isReadyToCreate = selectedMode !== null && selectedMapel !== null

  useEffect(() => {
    if (!socket) return

    const onRoomCreated = ({ roomCode }: { roomCode: string }) => {
      navigate(`/pvp-battle/room/${roomCode}`)
    }

    const onRoomError = ({ message }: { message: string }) => {
      alert(message)
    }

    socket.on("room_created", onRoomCreated)
    socket.on("room_error", onRoomError)

    return () => {
      socket.off("room_created", onRoomCreated)
      socket.off("room_error", onRoomError)
    }
  }, [socket, navigate])

  const handleBuatRoom = () => {
    if (!isReadyToCreate || !user) return

    socket?.emit("create_room", {
      userId: user.id,
      mode: selectedMode,
      mapelId: selectedMapel,
    })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">Kembali</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <div className="rounded-2xl shadow-sm p-6 lg:p-8" style={{ backgroundColor: 'var(--card-bg)' }}>
              <h2 className="text-lg font-bold text-gray-900 mb-5">🎯 Pilih Jenis Pertarungan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {battleModes.map((mode) => (
                  <BattleModeSelectCard
                    key={mode.id}
                    mode={mode}
                    selected={selectedMode === mode.id}
                    onSelect={() => setSelectedMode(mode.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="rounded-2xl shadow-sm p-6 lg:p-8" style={{ backgroundColor: 'var(--card-bg)' }}>
              <h2 className="text-lg font-bold text-gray-900 mb-5">📚 Pilih Pelajaran</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {daftarMapel.map((mapel) => (
                  <MapelSelectCard
                    key={mapel.id}
                    mapel={mapel}
                    selected={selectedMapel === mapel.id}
                    onSelect={() => setSelectedMapel(mapel.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <button
              onClick={handleBuatRoom}
              disabled={!isReadyToCreate}
              className={`w-full h-14 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 ${
                isReadyToCreate
                  ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 active:scale-[0.98] shadow-md"
                  : "bg-gray-300 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Swords className="w-5 h-5" />
              Buat Room Sekarang
            </button>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
