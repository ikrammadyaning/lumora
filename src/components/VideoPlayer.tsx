interface VideoPlayerProps {
  videoUrl?: string | null
  title: string
  poster?: string
}

export default function VideoPlayer({ videoUrl, title, poster }: VideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl mx-auto">
            <span className="text-3xl text-white ml-1">▶</span>
          </div>
          <p className="text-white font-bold text-lg mt-4">Penjelasan Ustadz</p>
          <p className="text-white/50 text-sm mt-1">Video akan tersedia segera</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video
        src={videoUrl}
        poster={poster || undefined}
        controls
        className="w-full h-full object-contain"
      />
    </div>
  )
}
