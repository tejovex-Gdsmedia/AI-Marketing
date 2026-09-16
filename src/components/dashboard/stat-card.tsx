import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'amber' | 'blue' | 'green' | 'purple' | 'red'
  onClick?: () => void
}

const colorMap = {
  amber: {
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    text: 'text-amber-400',
    icon: 'bg-amber-400/20',
  },
  blue: {
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    text: 'text-blue-400',
    icon: 'bg-blue-400/20',
  },
  green: {
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
    text: 'text-green-400',
    icon: 'bg-green-400/20',
  },
  purple: {
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    text: 'text-purple-400',
    icon: 'bg-purple-400/20',
  },
  red: {
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    text: 'text-red-400',
    icon: 'bg-red-400/20',
  },
}

export function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  color = 'amber',
  onClick,
}: StatCardProps) {
  const colors = colorMap[color]

  return (
    <div
      onClick={onClick}
      className={`
        p-6 rounded-2xl border backdrop-blur-sm transition-all
        ${colors.bg} ${colors.border}
        ${onClick ? 'cursor-pointer hover:scale-105 hover:border-opacity-100' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-white/50 font-medium uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{value}</span>
            {unit && <span className="text-sm text-white/40">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.icon}`}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={trend.isPositive ? 'text-green-400 rotate-180' : 'text-red-400'}
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}% this month
          </span>
        </div>
      )}
    </div>
  )
}
