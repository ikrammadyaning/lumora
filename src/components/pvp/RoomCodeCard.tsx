import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Copy } from "lucide-react"

interface RoomCodeCardProps {
  roomCode: string
}

export default function RoomCodeCard({ roomCode }: RoomCodeCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [roomCode])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl shadow-sm p-6 lg:p-8 text-center" style={{ backgroundColor: 'var(--card-bg)' }}
    >
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-3">
        KODE ROOM
      </p>
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-3xl lg:text-4xl font-bold font-mono tracking-[0.2em] text-gray-900 select-all">
          {roomCode}
        </span>
        <button
          onClick={handleCopy}
          className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shrink-0 relative"
          aria-label="Salin kode room"
        >
          <Copy className="w-4 h-4" />
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap shadow-lg">
              Disalin!
            </span>
          )}
        </button>
      </div>
      <p className="text-sm text-gray-400">
        Bagikan kode ini ke temanmu — maks. 5 pemain
      </p>
    </motion.div>
  )
}
