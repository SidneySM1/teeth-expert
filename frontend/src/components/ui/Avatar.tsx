import { avatarColor, initials } from '@/lib/format'

export function Avatar({ name, size = 38 }: { name: string; size?: number }) {
  const color = avatarColor(name)
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 700,
        fontSize: size * 0.36,
        color: '#fff',
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        boxShadow: `0 4px 12px -4px ${color}99`,
      }}
    >
      {initials(name)}
    </div>
  )
}
