import { Lightbulb } from "lucide-react"

export default function NonXpInfoBanner() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 flex items-start gap-3">
      <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-orange-700 text-sm mb-0.5">Mode Non-XP</p>
        <p className="text-sm text-yellow-800/70">
          PvP tidak menghasilkan XP, tapi pemenang mendapat <strong>100 Koin</strong> dan poin klasemen PvP!
        </p>
      </div>
    </div>
  )
}
