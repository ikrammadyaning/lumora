export default function QuickActions() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <a
        href="#"
        className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-orange-500 to-red-600 text-white group cursor-pointer"
      >
        <div className="absolute top-3 right-3 text-3xl opacity-30 group-hover:scale-110 transition-transform duration-300">
          ⚔️
        </div>
        <div className="relative z-10">
          <p className="text-sm font-medium text-orange-100">Battle Now</p>
          <h3 className="text-xl font-bold mt-0.5">PvP Battle</h3>
          <p className="text-xs text-orange-100/70 mt-1.5">
            Tantang santri lain dalam duel ilmu!
          </p>
          <span className="inline-block mt-3 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
            Mulai →
          </span>
        </div>
      </a>

      <a
        href="/toko-item"
        className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-purple-500 to-violet-600 text-white group cursor-pointer"
      >
        <div className="absolute top-3 right-3 text-3xl opacity-30 group-hover:scale-110 transition-transform duration-300">
          🛒
        </div>
        <div className="relative z-10">
          <p className="text-sm font-medium text-purple-100">Redeem Points</p>
          <h3 className="text-xl font-bold mt-0.5">Toko Item</h3>
          <p className="text-xs text-purple-100/70 mt-1.5">
            Tukarkan koin-mu dengan item eksklusif!
          </p>
          <span className="inline-block mt-3 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
            Belanja →
          </span>
        </div>
      </a>
    </div>
  )
}
