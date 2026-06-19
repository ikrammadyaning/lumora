import { useSocketPlayer } from "@/hooks/useSocketPlayer"

export default function SideQuestCard() {
  const { player, completeQuest } = useSocketPlayer()

  if (!player) return null

  const quest = player.quests.find((q) => !q.is_completed) || player.quests[0]
  if (!quest) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/60">
        <p className="text-sm text-amber-600">Belum ada quest tersedia.</p>
      </div>
    )
  }

  const progressPercent = (quest.progress / quest.total) * 100

  const handleComplete = () => {
    if (!quest.is_completed) {
      completeQuest(quest.id)
    }
  }

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        handleComplete()
      }}
      className="block bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/60 hover:border-amber-300 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className={`inline-block text-[11px] font-bold text-white px-2.5 py-1 rounded-full ${quest.category_color}`}
          >
            ⚡ {quest.category}
          </span>
          <h3 className="text-base font-bold text-gray-800 mt-2 group-hover:text-amber-600 transition-colors">
            {quest.title}
          </h3>
        </div>
        <span className="text-2xl opacity-50 group-hover:scale-110 transition-transform">
          ⚡
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-amber-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-bold text-amber-600">
          {quest.progress}/{quest.total}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
          ⭐ +{quest.reward_xp} XP
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
          🪙 +{quest.reward_coins}
        </span>
      </div>
    </a>
  )
}
