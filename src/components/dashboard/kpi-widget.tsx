'use client'

import React from 'react'
import { Sparkline } from './sparkline'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface KPIData {
  label: string
  value: string | number
  previousValue: string | number
  trend: number
  trendLabel: string
  icon: React.ReactNode
  sparklineData: number[]
  status?: 'good' | 'neutral' | 'warning' | 'danger'
}

interface KPIWidgetProps {
  data: KPIData
  className?: string
}

const statusColors = {
  good: 'text-green-400 bg-green-400/10 border-green-400/20',
  neutral: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  warning: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  danger: 'text-red-400 bg-red-400/10 border-red-400/20',
}

export function KPIWidget({ data, className }: KPIWidgetProps) {
  const isPositive = data.trend >= 0
  const isGood = data.status === 'good'
  const isDanger = data.status === 'danger'
  const isWarning = data.status === 'warning' || data.status === 'neutral'

  return (
    <Card className={cn(
      'bg-[#0A0A0B] border-white/[0.06] hover:border-white/20 transition-all duration-300 group h-full flex flex-col',
      isGood && 'border-green-400/20 hover:border-green-400/40',
      isDanger && 'border-red-400/20 hover:border-red-400/40',
      isWarning && 'border-amber-400/20 hover:border-amber-400/40',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            'w-10 h-10 rounded-xl bg-white/5 border flex items-center justify-center transition-colors shrink-0',
            isGood && 'border-green-400/20 bg-green-400/5 text-green-400 group-hover:bg-green-400/10',
            isDanger && 'border-red-400/20 bg-red-400/5 text-red-400 group-hover:bg-red-400/10',
            isWarning && 'border-amber-400/20 bg-amber-400/5 text-amber-400 group-hover:bg-amber-400/10'
          )}>
            {data.icon}
          </div>
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <CardTitle className="text-[11px] font-semibold text-white/70 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
              {data.label}
            </CardTitle>
            <CardDescription className="text-[11px] text-white/40 leading-tight mt-0.5 truncate max-w-full">
              {data.trendLabel}
            </CardDescription>
          </div>
        </div>
        <Badge variant="outline" className={cn(
          'text-[10px] px-2 py-0.5 border shrink-0 ml-auto',
          isGood && 'text-green-400 border-green-400/20 bg-green-400/5',
          isDanger && 'text-red-400 border-red-400/20 bg-red-400/5',
          isWarning && 'text-amber-400 border-amber-400/20 bg-amber-400/5'
        )}>
          {data.status || 'neutral'}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-visible px-1 pb-3">
        <div className="grid grid-cols-2 gap-2 items-end">
          <div className="min-w-0">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Value</p>
            <div className="text-2xl font-bold text-white tracking-tight truncate max-w-full">{data.value}</div>
            <p className="text-[10px] text-white/40 mt-0.5 truncate max-w-full">vs {data.previousValue} prev</p>
          </div>
          <div className="flex items-center gap-2 justify-end shrink-0">
            <div className={cn(
              'text-xs font-bold flex items-center gap-0.5 whitespace-nowrap',
              isGood && 'text-green-400',
              isDanger && 'text-red-400',
              isWarning && 'text-amber-400'
            )}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points={isPositive ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
              </svg>
              {Math.abs(data.trend)}%
            </div>
            <span className="text-[10px] text-white/30">vs prev</span>
          </div>
        </div>
        <div className="mt-auto pt-2 border-t border-white/[0.04]">
          <Sparkline data={data.sparklineData} color={isPositive ? '#4ade80' : '#f87171'} />
        </div>
      </CardContent>
    </Card>
  )
}
