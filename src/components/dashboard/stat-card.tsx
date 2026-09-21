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
  color?: 'amber' | 'blue' | 'green' | 'purple' | 'red' | 'monochrome'
  onClick?: () => void
}

const colorMap = {
  amber: {
    bg: 'bg-neutral-800/40',
    border: 'border-neutral-700',
    text: 'text-white',
    icon: 'bg-neutral-800',
  },
  blue: {
    bg: 'bg-neutral-800/40',
    border: 'border-neutral-700',
    text: 'text-white',
    icon: 'bg-neutral-800',
  },
  green: {
    bg: 'bg-neutral-800/40',
    border: 'border-neutral-700',
    text: 'text-white',
    icon: 'bg-neutral-800',
  },
  purple: {
    bg: 'bg-neutral-800/40',
    border: 'border-neutral-700',
    text: 'text-white',
    icon: 'bg-neutral-800',
  },
  red: {
    bg: 'bg-neutral-800/40',
    border: 'border-neutral-700',
    text: 'text-white',
    icon: 'bg-neutral-800',
  },
  monochrome: {
    bg: 'bg-white/[0.03]',
    border: 'border-white/10',
    text: 'text-white',
    icon: 'bg-white/10',
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
