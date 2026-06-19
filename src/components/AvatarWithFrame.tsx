interface AvatarWithFrameProps {
  avatarUrl: string | null
  initial: string
  frameConfig: Record<string, any> | null
  size?: 'sm' | 'md' | 'lg'
}

export function AvatarWithFrame({ avatarUrl, initial, frameConfig, size = 'md' }: AvatarWithFrameProps) {
  const sizeClass = { sm: 'w-9 h-9', md: 'w-12 h-12', lg: 'w-24 h-24' }[size]
  const style = frameConfig
    ? {
        border: `${frameConfig.borderWidth || '3px'} ${frameConfig.borderStyle || 'solid'} ${frameConfig.borderColor || '#10b981'}`,
        boxShadow: `0 0 12px ${frameConfig.glowColor || 'transparent'}`,
      }
    : { border: '2px solid #e5e7eb' }

  return (
    <div
      className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center bg-gray-800 text-white font-bold shrink-0`}
      style={style}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm">{initial}</span>
      )}
    </div>
  )
}
