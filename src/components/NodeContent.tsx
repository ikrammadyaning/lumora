import VideoPlayer from "./VideoPlayer"
import MateriContent from "./MateriContent"
import LatihanContent from "./LatihanContent"
import UjianContent from "./UjianContent"

interface SimpleNode {
  id: string
  judul: string
  tipe: "materi" | "video" | "latihan" | "ujian"
}

interface SimpleMapel {
  id: string
  nama: string
  icon: string
  kitab: string
  ustadz: string
}

interface NodeContentProps {
  node: SimpleNode
  mapel: SimpleMapel
  onComplete: () => void
  completing: boolean
}

export default function NodeContent({ node, mapel, onComplete, completing }: NodeContentProps) {
  const actionLabel = {
    video: "⚡ LANJUT PRAKTEK",
    materi: "✅ TANDAI SELESAI",
    latihan: "✅ SELESAI LATIHAN",
    ujian: "✅ MULAI UJIAN",
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {node.tipe === "video" && <VideoPlayer title={node.judul} />}

      {node.tipe !== "video" && (
        <div className="flex-1 p-4 lg:p-6">
          {node.tipe === "materi" && <MateriContent title={node.judul} />}
          {node.tipe === "latihan" && <LatihanContent title={node.judul} />}
          {node.tipe === "ujian" && <UjianContent title={node.judul} />}
        </div>
      )}

      <div className="bg-white border-t border-gray-100 p-4 lg:p-6 lg:mt-auto">
        <p className="text-center text-sm font-medium text-gray-500 mb-3">
          {node.tipe === "video" ? "Selesai menyimak?" : "Selesaikan bagian ini?"}
        </p>
        <button
          onClick={onComplete}
          disabled={completing}
          className="w-full h-14 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98]" style={{ backgroundColor: 'var(--accent-color)' }}
        >
          {completing ? "⏳ Memproses..." : actionLabel[node.tipe]}
        </button>
      </div>
    </div>
  )
}
