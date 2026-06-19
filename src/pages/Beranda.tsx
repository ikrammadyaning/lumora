import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import QuickActions from "@/components/QuickActions"
import SideQuestCard from "@/components/SideQuestCard"
import JalurBelajar from "@/components/JalurBelajar"
import PetaKurikulum from "@/components/PetaKurikulum"
import LeaderboardMini from "@/components/LeaderboardMini"
import PvpLeaderboardMini from "@/components/PvpLeaderboardMini"
import StreakPopup from "@/components/StreakPopup"
import { useSocketPlayer } from "@/hooks/useSocketPlayer"

export default function BerandaPage() {
  const { player, loading, showStreakPopup, streakPopup, closeStreakPopup } =
    useSocketPlayer()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2e2a] flex items-center justify-center">
        <p className="text-white/60 text-sm">Memuat...</p>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-[#1a2e2a] flex items-center justify-center">
        <p className="text-white/60 text-sm">Silakan login terlebih dahulu.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
          <HeroSection />
          <QuickActions />

          <div className="grid lg:grid-cols-2 gap-6">
            <SideQuestCard />
            <JalurBelajar />
          </div>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                🗺️ Peta Kurikulum
              </h2>
              <a
                href="#"
                className="text-xs font-semibold text-emerald-500 hover:text-emerald-600"
              >
                Lihat Semua →
              </a>
            </div>
            <PetaKurikulum />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LeaderboardMini />
            <PvpLeaderboardMini />
          </div>
        </main>
      </div>

      {streakPopup && (
        <StreakPopup
          isOpen={showStreakPopup}
          streakCount={streakPopup.streakCount}
          nextTarget={streakPopup.nextTarget}
          onClose={closeStreakPopup}
        />
      )}
    </div>
  )
}
