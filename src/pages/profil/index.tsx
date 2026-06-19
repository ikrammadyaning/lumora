import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Camera } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/context/UserContext"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { AvatarWithFrame } from "@/components/AvatarWithFrame"
import { useEquippedFrame } from "@/hooks/useEquippedFrame"
import { calcLevelProgress } from "@/lib/levelHelper"

const KELAS_OPTIONS = ["SD/MI", "SMP/MTs", "SMA/MA", "Mahasiswa", "Umum"]

const REGIONAL_OPTIONS = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi",
  "Sumatera Selatan", "Bengkulu", "Lampung", "Kepulauan Bangka Belitung",
  "Kepulauan Riau", "DKI Jakarta", "Jawa Barat", "Jawa Tengah",
  "DI Yogyakarta", "Jawa Timur", "Banten", "Bali",
  "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat",
  "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur",
  "Kalimantan Utara", "Sulawesi Utara", "Sulawesi Tengah",
  "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo",
  "Sulawesi Barat", "Maluku", "Maluku Utara", "Papua", "Papua Barat",
]

function getLevelTitle(level: number): string {
  if (level >= 1 && level <= 3) return "Santri Baru"
  if (level >= 4 && level <= 6) return "Santri Tekun"
  if (level >= 7 && level <= 9) return "Thalib Ilmi"
  if (level >= 10 && level <= 14) return "Thalib Mahir"
  if (level >= 15 && level <= 19) return "Santri Ahli"
  return "Ustadz Muda"
}

interface ProfileData {
  fullName: string
  schoolName: string
  kelas: string
  regional: string
  avatarUrl: string | null
  xp: number
  level: number
  streak: number
}

export default function ProfilPage() {
  const { user, loading: authLoading } = useUser()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const [fullName, setFullName] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [kelas, setKelas] = useState("")
  const [regional, setRegional] = useState("")
  const [fetchError, setFetchError] = useState<string | null>(null)
  const frameConfig = useEquippedFrame()

  useEffect(() => {
    console.log("[ProfilPage] authLoading:", authLoading, "user:", user)

    if (authLoading) return
    if (!user) {
      console.log("[ProfilPage] User tidak ada setelah authLoading selesai")
      setLoading(false)
      return
    }

    setFetchError(null)

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("full_name, school_name, kelas, regional, avatar_url, xp, level, streak")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("[ProfilPage] Gagal fetch profil:", error.message)
        setFetchError(error.message)
        setLoading(false)
        return
      }

      setProfile({
        fullName: data.full_name || "",
        schoolName: data.school_name || "",
        kelas: data.kelas || "",
        regional: data.regional || "",
        avatarUrl: data.avatar_url || null,
        xp: data.xp || 0,
        level: data.level || 1,
        streak: data.streak || 0,
      })
      setFullName(data.full_name || "")
      setSchoolName(data.school_name || "")
      setKelas(data.kelas || "")
      setRegional(data.regional || "")
      setLoading(false)
    }

    fetchProfile()
  }, [user, authLoading])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB")
      return
    }

    setUploadingAvatar(true)

    const fileExt = file.name.split(".").pop()
    const filePath = `${user.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error("[handleAvatarUpload] Gagal upload:", uploadError.message)
      alert("Gagal upload foto: " + uploadError.message)
      setUploadingAvatar(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id)

    if (updateError) {
      console.error("[handleAvatarUpload] Gagal update avatar_url:", updateError.message)
      alert("Gagal menyimpan foto profil")
      setUploadingAvatar(false)
      return
    }

    setProfile((prev) =>
      prev ? { ...prev, avatarUrl: publicUrl } : prev
    )
    setUploadingAvatar(false)
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)

    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        school_name: schoolName,
        kelas: kelas,
        regional: regional,
      })
      .eq("id", user.id)

    if (error) {
      console.error("[handleSaveProfile] Gagal simpan:", error.message)
      alert("Gagal menyimpan profil: " + error.message)
      setSaving(false)
      return
    }

    setProfile((prev) =>
      prev ? { ...prev, fullName, schoolName, kelas, regional } : prev
    )
    setSaving(false)
    alert("Profil berhasil disimpan!")
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Sidebar />
        <div className="lg:ml-[260px] min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">
            <div className="animate-pulse space-y-6">
              <div className="bg-gradient-to-br from-[#1a2e2a] to-[#0f1f1c] rounded-3xl p-8">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-white/10" />
                <div className="h-5 w-40 mx-auto mt-4 rounded bg-white/10" />
                <div className="h-4 w-24 mx-auto mt-2 rounded bg-white/10" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-gray-200" />
                ))}
              </div>
              <div className="h-32 rounded-2xl bg-gray-200" />
              <div className="h-72 rounded-2xl bg-gray-200" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p className="text-gray-400 text-sm">Silakan login terlebih dahulu.</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p className="text-gray-400 text-sm">Gagal memuat data profil.</p>
        {fetchError && (
          <p className="text-gray-400 text-xs">{fetchError}</p>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-emerald-500 text-white text-sm rounded-xl hover:bg-emerald-600 transition-colors"
        >
          Muat Ulang
        </button>
      </div>
    )
  }

  const progress = calcLevelProgress(profile.xp)
  const levelTitle = getLevelTitle(profile.level)
  const initial = profile.fullName.slice(0, 2).toUpperCase() || "??"

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 space-y-6">

          {/* 1. HERO CARD */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#1a2e2a] to-[#0f1f1c] rounded-3xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="relative w-24 h-24 mx-auto">
                <label className="cursor-pointer block w-full h-full">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                  <AvatarWithFrame
                    avatarUrl={profile.avatarUrl}
                    initial={initial}
                    frameConfig={frameConfig}
                    size="lg"
                  />
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">Mengunggah...</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-1.5 border-2 border-white">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </div>
                </label>
              </div>

              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full">
                <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                  🏆 Lv.{profile.level}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h1 className="text-xl font-bold text-white">
                {profile.fullName || "Santri"}
              </h1>
              <p className="text-emerald-400/80 text-sm font-medium mt-0.5">
                {levelTitle}
              </p>
            </div>
          </motion.div>

          {/* 2. STAT BOX */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="rounded-2xl p-4 shadow-sm border border-gray-100 text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
              <span className="text-2xl">🔥</span>
              <p className="text-2xl font-bold text-gray-800 mt-1">{profile.streak}</p>
              <p className="text-[11px] font-medium text-gray-400">Streak</p>
            </div>
            <div className="rounded-2xl p-4 shadow-sm border border-gray-100 text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
              <span className="text-2xl">🏅</span>
              <p className="text-2xl font-bold text-gray-800 mt-1">{profile.xp.toLocaleString()}</p>
              <p className="text-[11px] font-medium text-gray-400">Total XP</p>
            </div>
            <div className="rounded-2xl p-4 shadow-sm border border-gray-100 text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
              <span className="text-2xl">📈</span>
              <p className="text-2xl font-bold text-gray-800 mt-1">{profile.level}</p>
              <p className="text-[11px] font-medium text-gray-400">Level</p>
            </div>
          </motion.div>

          {/* 3. PROGRESS LEVEL CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-2xl p-5 shadow-sm border border-gray-100" style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <h3 className="text-sm font-bold text-gray-700 mb-4">
              Progress Menuju Level Berikutnya
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500">
                Lv.{profile.level}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                Lv.{profile.level + 1}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, (progress.current / progress.max) * 100)}%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-center text-[11px] font-medium text-gray-400 mt-2">
              {progress.current} / {progress.max} XP
            </p>
          </motion.div>

          {/* 4. DATA SANTRI CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="rounded-2xl p-5 shadow-sm border border-gray-100" style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <h3 className="text-sm font-bold text-gray-700 mb-5">
              👤 Data Santri
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Pondok Pesantren / Sekolah
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Contoh: Ponpes Darunnajah / SMA Negeri 1 Jakarta"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Kelas
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all appearance-none"
                >
                  <option value="">Pilih Kelas</option>
                  {KELAS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Regional
                </label>
                <select
                  value={regional}
                  onChange={(e) => setRegional(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all appearance-none"
                >
                  <option value="">Pilih Provinsi</option>
                  {REGIONAL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full mt-2 py-3 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold text-sm rounded-xl transition-colors" style={{ backgroundColor: 'var(--accent-color)' }}
              >
                {saving ? "Menyimpan..." : "💾 SIMPAN PROFIL"}
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
