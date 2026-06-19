interface LatihanContentProps {
  title: string
}

export default function LatihanContent({ title }: LatihanContentProps) {
  return (
    <div className="rounded-2xl p-6 shadow-sm border border-gray-100 text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">
        Soal latihan akan segera hadir
      </p>
    </div>
  )
}
