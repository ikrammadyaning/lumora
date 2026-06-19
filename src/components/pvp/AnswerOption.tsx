import { motion } from "framer-motion"

interface AnswerOptionProps {
  label: string
  text: string
  selected: boolean
  isCorrect: boolean | null
  isWrong: boolean | null
  disabled: boolean
  onSelect: () => void
}

export default function AnswerOption({
  label, text, selected, isCorrect, isWrong, disabled, onSelect
}: AnswerOptionProps) {
  let bgClass = "bg-gray-700/50 hover:bg-gray-600/50 border-gray-600"
  let ringClass = ""

  if (isCorrect === true) {
    bgClass = "bg-emerald-900/40 border-emerald-500"
    ringClass = "ring-2 ring-emerald-500"
  } else if (isWrong === true) {
    bgClass = "bg-red-900/40 border-red-500"
    ringClass = "ring-2 ring-red-500"
  } else if (selected) {
    bgClass = "bg-blue-900/40 border-blue-500"
    ringClass = "ring-2 ring-blue-500"
  }

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onSelect}
      disabled={disabled}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${bgClass} ${ringClass} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
        isCorrect === true ? "bg-emerald-500 text-white" :
        isWrong === true ? "bg-red-500 text-white" :
        "bg-gray-600 text-gray-200"
      }`}>
        {label}
      </span>
      <span className={`text-left text-sm font-medium ${
        isCorrect === true ? "text-emerald-200" :
        isWrong === true ? "text-red-200" :
        "text-gray-100"
      }`}>
        {text}
      </span>
    </motion.button>
  )
}
