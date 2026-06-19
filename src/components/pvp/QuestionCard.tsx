import { motion } from "framer-motion"
import AnswerOption from "./AnswerOption"

interface QuestionCardProps {
  questionNumber: number
  totalQuestions: number
  questionText: string
  options: Record<string, string>
  selectedOption: string | null
  correctOption: string | null
  isAnswered: boolean
  isCorrect: boolean | null
  onSelect: (option: string) => void
}

export default function QuestionCard({
  questionNumber, totalQuestions, questionText, options,
  selectedOption, correctOption, isAnswered, isCorrect, onSelect
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={questionNumber}
      className="w-full max-w-lg mx-auto space-y-4"
    >
      <div className="text-center">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          SOAL {questionNumber}/{totalQuestions}
        </span>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
        <p className="text-white text-lg font-semibold leading-relaxed">
          {questionText}
        </p>
      </div>

      <div className="space-y-2.5">
        {Object.entries(options).filter(([, v]) => v).map(([key, value]) => (
          <AnswerOption
            key={key}
            label={key}
            text={value}
            selected={selectedOption === key}
            isCorrect={isAnswered ? key === correctOption : null}
            isWrong={isAnswered ? selectedOption === key && key !== correctOption : null}
            disabled={isAnswered}
            onSelect={() => onSelect(key)}
          />
        ))}
      </div>

      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center text-sm font-semibold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {isCorrect ? '✅ Jawaban Benar!' : '❌ Jawaban Salah'}
        </motion.div>
      )}
    </motion.div>
  )
}
