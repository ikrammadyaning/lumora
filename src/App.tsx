import { Routes, Route, Navigate } from "react-router-dom"
import { UserProvider } from "@/context/UserContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { SocketProvider } from "@/context/SocketProvider"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Beranda from "./pages/Beranda"
import JalurBelajar from "./pages/jalur-belajar/index"
import MateriDetail from "./pages/jalur-belajar/[mapel]/[materi]/page"
import SideQuest from "./pages/side-quest/index"
import QuestDetail from "./pages/side-quest/[questId]/page"
import PvpBattle from "./pages/pvp-battle/index"
import GabungRoom from "./pages/pvp-battle/gabung-room/index"
import BuatRoom from "./pages/pvp-battle/buat-room/index"
import RoomLobby from "./pages/pvp-battle/room/[roomCode]/index"
import BattlePage from "./pages/pvp-battle/battle/[roomCode]/index"
import PvpLeaderboardPage from "./pages/pvp-battle/leaderboard/index"
import ProfilPage from "./pages/profil/index"
import TokoItemPage from "./pages/toko-item/index"
import LeaderboardPage from "./pages/leaderboard/index"

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider>
      <SocketProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/beranda" element={<Beranda />} />
          <Route path="/jalur-belajar" element={<JalurBelajar />} />
          <Route path="/jalur-belajar/:mapel/:materi" element={<MateriDetail />} />
          <Route path="/side-quest" element={<SideQuest />} />
          <Route path="/side-quest/:questId" element={<QuestDetail />} />
          <Route path="/pvp-battle" element={<PvpBattle />} />
          <Route path="/pvp-battle/leaderboard" element={<PvpLeaderboardPage />} />
          <Route path="/pvp-battle/gabung-room" element={<GabungRoom />} />
          <Route path="/pvp-battle/buat-room" element={<BuatRoom />} />
          <Route path="/pvp-battle/room/:roomCode" element={<RoomLobby />} />
          <Route path="/pvp-battle/battle/:roomCode" element={<BattlePage />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/toko-item" element={<TokoItemPage />} />
          <Route path="*" element={<Navigate to="/beranda" replace />} />
        </Routes>
      </SocketProvider>
      </ThemeProvider>
    </UserProvider>
  )
}
