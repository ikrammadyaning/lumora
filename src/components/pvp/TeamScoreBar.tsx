import { motion } from "framer-motion"

interface TeamScoreBarProps {
  teamAScore: number
  teamBScore: number
}

export default function TeamScoreBar({ teamAScore, teamBScore }: TeamScoreBarProps) {
  const total = teamAScore + teamBScore || 1
  const aPercent = (teamAScore / total) * 100

  return (
    <div className="w-full px-4 py-2">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-blue-400 w-16 text-right">Tim A: {teamAScore}</span>
        <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              width: `${aPercent}%`,
            }}
            animate={{ width: `${aPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <span className="text-xs font-bold text-red-400 w-16">Tim B: {teamBScore}</span>
      </div>
    </div>
  )
}
