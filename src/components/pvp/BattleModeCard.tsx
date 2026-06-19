interface BattleMode {
  id: string
  nama: string
  icon: string
  gradient: string
}

interface BattleModeCardProps {
  mode: BattleMode
}

export default function BattleModeCard({ mode }: BattleModeCardProps) {
  return (
    <button
      onClick={() => console.log(`TODO: pilih mode ${mode.nama}`)}
      className={`bg-gradient-to-br ${mode.gradient} rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-200 w-full`}
    >
      <span className="text-4xl block mb-3">{mode.icon}</span>
      <h4 className="text-white font-bold text-sm">{mode.nama}</h4>
    </button>
  )
}
