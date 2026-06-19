import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Sidebar from "@/components/Sidebar"
import BattleHeader from "@/components/pvp/BattleHeader"
import TeamScoreBar from "@/components/pvp/TeamScoreBar"
import QuestionCard from "@/components/pvp/QuestionCard"
import MiniScoreboard from "@/components/pvp/MiniScoreboard"
import BattleResultPopup from "@/components/pvp/BattleResultPopup"
import { useSocketContext } from "@/context/SocketProvider"
import { useUser } from "@/context/UserContext"

interface PlayerData {
  userId: string
  nama: string
  score: number
  team: string
  isBot: boolean
}

interface NextQuestionData {
  questionNumber: number
  totalQuestions: number
  questionText: string
  options: Record<string, string>
  timeLimitSeconds: number
  yourScore: number
  teamScore: number
}

interface AnswerResultData {
  isCorrect: boolean
  correctOption: string
  pointsGained: number
  newScore: number
}

interface ScoreboardUpdateData {
  players: PlayerData[]
  teamAScore: number
  teamBScore: number
}

interface BattleResultData {
  isWinner: boolean
  isDraw: boolean
  yourTeamScore: number
  opponentTeamScore: number
  yourScore: number
  totalQuestions: number
  correctCount: number
  answeredLog: { question: string; isCorrect: boolean }[]
  coinsEarned: number
}

interface AnsweredLog {
  questionText: string
  isCorrect: boolean
}

export default function BattlePage() {
  const { roomCode } = useParams<{ roomCode: string }>()
  const navigate = useNavigate()
  const { socket } = useSocketContext()
  const { user } = useUser()

  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState("tembak-soal")
  const [timeLeft, setTimeLeft] = useState(0)
  const [playerScore, setPlayerScore] = useState(0)
  const [teamAScore, setTeamAScore] = useState(0)
  const [teamBScore, setTeamBScore] = useState(0)
  const [players, setPlayers] = useState<PlayerData[]>([])
  const [battleEndsAt, setBattleEndsAt] = useState<number | null>(null)

  const [currentQuestion, setCurrentQuestion] = useState<NextQuestionData | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [correctOption, setCorrectOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const correctOptionRef = useRef<string | null>(null)

  const [battleResult, setBattleResult] = useState<BattleResultData | null>(null)

  const battleEndRef = useRef(false)

  const myTeam = players.find(p => p.userId === user?.id)?.team || 'A'

  // Interval timer terpisah, berjalan selama battleEndsAt sudah ada
  useEffect(() => {
    if (!battleEndsAt) return

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((battleEndsAt - Date.now()) / 1000))
      setTimeLeft(remaining)
    }

    updateTimer()
    const intervalId = setInterval(updateTimer, 1000)

    return () => clearInterval(intervalId)
  }, [battleEndsAt])

  // Listener battle_started — untuk kasus host yang baru mulai
  useEffect(() => {
    if (!socket) return

    const onBattleStarted = ({ room }: { room: { battleEndsAt: number } }) => {
      console.log('[Frontend] battle_started diterima, battleEndsAt:', room.battleEndsAt)
      setBattleEndsAt(room.battleEndsAt)
    }

    socket.on("battle_started", onBattleStarted)
    return () => { socket.off("battle_started", onBattleStarted) }
  }, [socket])

  // Socket listeners
  useEffect(() => {
    if (!socket || !roomCode) return

    const onNextQuestion = (data: NextQuestionData) => {
      setCurrentQuestion(data)
      setSelectedOption(null)
      setCorrectOption(null)
      setIsAnswered(false)
      setIsCorrect(null)
      correctOptionRef.current = null
      setPlayerScore(data.yourScore)
    }

    const onAnswerResult = (data: AnswerResultData) => {
      setIsAnswered(true)
      setIsCorrect(data.isCorrect)
      setCorrectOption(data.correctOption)
      correctOptionRef.current = data.correctOption
      setPlayerScore(data.newScore)
    }

    const onScoreboardUpdate = (data: ScoreboardUpdateData) => {
      console.log('[Frontend] scoreboard_update - Tim A:', data.teamAScore, 'Tim B:', data.teamBScore)
      console.log('[Frontend] scoreboard_update detail:', data.players.map(p =>
        `${p.nama}(team:${p.team}, score:${p.score}, isBot:${p.isBot})`
      ))
      setPlayers(data.players)
      setTeamAScore(data.teamAScore)
      setTeamBScore(data.teamBScore)
    }

    const onBattleFinishedForPlayer = (data: { score: number }) => {
      // Player sudah menjawab semua soal
    }

    const onBattleResult = (data: BattleResultData) => {
      if (battleEndRef.current) return
      battleEndRef.current = true
      console.log('[Frontend] Battle result diterima:', data)
      setBattleResult(data)

      // Refresh data user supaya koin di header ikut update
      if (user) {
        socket.emit('user_login', { userId: user.id })
      }
    }

    const onBattleError = ({ message }: { message: string }) => {
      alert('Battle error: ' + message)
    }

    const onRoomUpdated = (data: {
      room: {
        status: string
        mode: string
        players: PlayerData[]
        battleEndsAt: number | null
      }
    }) => {
      console.log('[Frontend] room_updated diterima:', data.room)

      if (data.room.status === "battling") {
        setMode(data.room.mode || "tembak-soal")
        setPlayers(data.room.players || [])
        setLoading(false)

        if (data.room.battleEndsAt) {
          setBattleEndsAt(data.room.battleEndsAt)
        }

        const teamA = (data.room.players || [])
          .filter(p => p.team === 'A')
          .reduce((sum, p) => sum + p.score, 0)
        const teamB = (data.room.players || [])
          .filter(p => p.team === 'B')
          .reduce((sum, p) => sum + p.score, 0)
        setTeamAScore(teamA)
        setTeamBScore(teamB)

        if (socket && user) {
          socket.emit("request_current_question", { userId: user.id, roomCode })
        }
      }
    }

    socket.on("next_question", onNextQuestion)
    socket.on("answer_result", onAnswerResult)
    socket.on("scoreboard_update", onScoreboardUpdate)
    socket.on("battle_finished_for_player", onBattleFinishedForPlayer)
    socket.on("battle_result", onBattleResult)
    socket.on("battle_error", onBattleError)
    socket.on("room_updated", onRoomUpdated)

    // Request room state - if already battling, this will trigger onRoomUpdated
    socket.emit("request_room_state", { roomCode })

    // Fallback: if no event received after 5s, stop loading anyway
    const timeout = setTimeout(() => setLoading(false), 5000)

    return () => {
      clearTimeout(timeout)
      socket.off("next_question", onNextQuestion)
      socket.off("answer_result", onAnswerResult)
      socket.off("scoreboard_update", onScoreboardUpdate)
      socket.off("battle_finished_for_player", onBattleFinishedForPlayer)
      socket.off("battle_result", onBattleResult)
      socket.off("battle_error", onBattleError)
      socket.off("room_updated", onRoomUpdated)
    }
  }, [socket, roomCode, user?.id])

  const handleSelectOption = useCallback((option: string) => {
    if (isAnswered || !socket || !roomCode || !user) return
    setSelectedOption(option)
    socket.emit("submit_answer", {
      userId: user.id,
      roomCode,
      selectedOption: option,
    })
  }, [isAnswered, socket, roomCode, user])

  const handleExit = useCallback(() => {
    if (battleEndRef.current) return
    const confirmExit = window.confirm("Keluar battle = otomatis kalah. Lanjutkan?")
    if (!confirmExit) return

    if (socket && roomCode && user) {
      socket.emit("leave_battle", { userId: user.id, roomCode })
    }
    navigate("/pvp-battle")
  }, [socket, roomCode, user, navigate])

  const handleBackToArena = useCallback(() => {
    navigate("/pvp-battle")
  }, [navigate])

  // Polling re-sync tiap 10 detik untuk jaga-jaga reconnect
  useEffect(() => {
    if (!socket || !roomCode || battleResult) return

    const syncInterval = setInterval(() => {
      socket.emit("request_room_state", { roomCode })
    }, 10000)

    return () => clearInterval(syncInterval)
  }, [socket, roomCode, battleResult])

  // Build answered log from current question results
  const [answeredLog, setAnsweredLog] = useState<AnsweredLog[]>([])
  useEffect(() => {
    if (!isAnswered || !currentQuestion) return
    setAnsweredLog(prev => [
      ...prev,
      {
        questionText: currentQuestion.questionText,
        isCorrect: isCorrect === true,
      },
    ])
  }, [isAnswered])

  const myTeamScore = myTeam === 'A' ? teamAScore : teamBScore
  const oppTeamScore = myTeam === 'A' ? teamBScore : teamAScore

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <p className="text-4xl mb-4">⚔️</p>
          <p className="text-white font-bold text-lg">Memuat Battle...</p>
          <p className="text-gray-400 text-sm mt-1">Menyiapkan soal dan pemain</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />

      <div className="lg:ml-[260px]">
        <BattleHeader
          mode={mode}
          timeLeft={timeLeft}
          playerScore={playerScore}
          onExit={handleExit}
        />

        <div className="pt-16 pb-32">
          <TeamScoreBar teamAScore={myTeamScore} teamBScore={oppTeamScore} />

          <div className="px-4 py-6">
            {currentQuestion && (
              <QuestionCard
                questionNumber={currentQuestion.questionNumber}
                totalQuestions={currentQuestion.totalQuestions}
                questionText={currentQuestion.questionText}
                options={currentQuestion.options}
                selectedOption={selectedOption}
                correctOption={correctOption}
                isAnswered={isAnswered}
                isCorrect={isCorrect}
                onSelect={handleSelectOption}
              />
            )}
          </div>
        </div>

        <MiniScoreboard
          players={players}
          currentUserId={user?.id || ""}
        />

        {battleResult && (
          <BattleResultPopup
            isWinner={battleResult.isWinner}
            teamScore={battleResult.yourTeamScore}
            opponentScore={battleResult.opponentTeamScore}
            totalCorrect={battleResult.correctCount}
            totalQuestions={battleResult.totalQuestions}
            answeredLog={answeredLog.length > 0 ? answeredLog : battleResult.answeredLog.map(a => ({ questionText: a.question, isCorrect: a.isCorrect }))}
            coinsEarned={battleResult.coinsEarned}
            onBackToArena={handleBackToArena}
          />
        )}
      </div>
    </div>
  )
}
