import React from 'react'

interface ActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  actionLabel: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  badge?: string
}

export function ActionCard({
  title,
  description,
  icon,
  actionLabel,
  onClick,
  variant = 'secondary',
  badge,
}: ActionCardProps) {
  const isPrimary = variant === 'primary'

  return (
    <div
      className={`
        p-6 rounded-2xl border backdrop-blur-sm transition-all group
        ${
          isPrimary
            ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20 border-amber-400/30 hover:border-amber-400/50'
            : 'bg-white/5 border-white/10 hover:border-white/20'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${isPrimary ? 'bg-amber-400/20' : 'bg-white/10'}
            group-hover:scale-110 transition-transform
          `}
        >
          {icon}
        </div>
        {badge && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-amber-400/20 text-amber-400 font-medium">
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-white/60 mb-4 leading-relaxed">{description}</p>

      <button
        onClick={onClick}
        className={`
          w-full py-2.5 rounded-lg text-sm font-medium transition-all
          ${
            isPrimary
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:opacity-90'
              : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
          }
        `}
      >
        {actionLabel}
      </button>
    </div>
  )
}
