import { Play } from "lucide-react"

interface VideoPlayerPlaceholderProps {
  videoUrl?: string | null
  title: string
  ustadz?: string | null
}

export default function VideoPlayerPlaceholder({ videoUrl, title, ustadz }: VideoPlayerPlaceholderProps) {
  if (videoUrl) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
          playsInline
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl mx-auto mb-4 hover:bg-emerald-400 transition-colors cursor-pointer">
          <Play className="w-8 h-8 text-white ml-1" fill="white" />
        </div>
        <h3 className="text-white font-bold text-lg">Penjelasan Ustadz</h3>
        <p className="text-gray-400 text-sm mt-1">Video akan tersedia segera</p>
        {ustadz && (
          <p className="text-gray-500 text-xs mt-3">🎙️ {ustadz}</p>
        )}
      </div>
    </div>
  )
}
