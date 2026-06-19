interface JalurAktifCardProps {
  icon: string
  name: string
  kitab: string | null
  bgColor: string
  completedCount: number
  totalCount: number
}

export default function JalurAktifCard({
  icon,
  name,
  kitab,
  bgColor,
  completedCount,
  totalCount,
}: JalurAktifCardProps) {
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const bgClass = bgColor ? bgColor.split(" ")[0] : "bg-emerald-700"

  return (
    <div className={`rounded-2xl ${bgClass} p-5 text-white shadow-lg`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎯</span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">
          Jalur Aktif
        </span>
      </div>

      <h3 className="text-lg font-bold leading-tight">
        {icon} {name}
      </h3>
      {kitab && (
        <p className="text-sm text-white/80 mt-1 font-medium">📖 {kitab}</p>
      )}

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-white/70 font-medium">Progress</span>
          <span className="font-bold text-white/90">{progress}% selesai</span>
        </div>
        <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-white/80 to-white rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
