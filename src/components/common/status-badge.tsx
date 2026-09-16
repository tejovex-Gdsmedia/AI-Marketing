import React from 'react'

type StatusType = 'success' | 'pending' | 'failed' | 'processing' | 'idle'

interface StatusBadgeProps {
  status: StatusType
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig = {
  success: {
    bg: 'bg-green-400/10',
    border: 'border-green-400/30',
    text: 'text-green-400',
    dot: 'bg-green-400',
  },
  pending: {
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400 animate-pulse',
  },
  failed: {
    bg: 'bg-red-400/10',
    border: 'border-red-400/30',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
  processing: {
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
    text: 'text-blue-400',
    dot: 'bg-blue-400 animate-spin',
  },
  idle: {
    bg: 'bg-white/5',
    border: 'border-white/10',
    text: 'text-white/50',
    dot: 'bg-white/30',
  },
}

const statusLabels = {
  success: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
  processing: 'Processing',
  idle: 'Idle',
}

const sizeMap = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status]
  const displayLabel = label || statusLabels[status]

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full border
        ${config.bg} ${config.border}
        ${sizeMap[size]}
      `}
    >
      <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
      <span className={`font-medium ${config.text}`}>{displayLabel}</span>
    </div>
  )
}
