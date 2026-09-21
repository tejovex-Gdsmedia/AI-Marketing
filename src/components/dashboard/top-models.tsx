'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ModelData {
  name: string
  provider: string
  usage: number
  cost: number
  color: string
  icon: string
}

const models: ModelData[] = [
  { name: 'Kling 3.0', provider: 'Kling', usage: 78, cost: 4200, color: '#f59e0b', icon: '🎬' },
  { name: 'Veo 3 Fast', provider: 'Google', usage: 62, cost: 2800, color: '#6366f1', icon: '🤖' },
  { name: 'Runway Gen-4', provider: 'Runway', usage: 45, cost: 1560, color: '#10b981', icon: '🎥' },
  { name: 'MiniMax H3', provider: 'MiniMax', usage: 91, cost: 3420, color: '#ec4899', icon: '⚡' },
  { name: 'Wan 2.1', provider: 'Alibaba', usage: 34, cost: 980, color: '#8b5cf6', icon: '🌊' },
]

interface TopModelsProps {
  compact?: boolean
  className?: string
}

export function TopModels({ compact = false, className }: TopModelsProps) {
  if (compact) {
    return (
      <div className="space-y-3">
        {models.slice(0, 4).map((model, idx) => (
          <TooltipProvider key={model.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <span className="text-xs font-bold text-white/30 w-5">{idx + 1}</span>
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-white/10 text-white/60 text-[10px]">
                      {model.icon}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white font-medium truncate">{model.name}</span>
                      <span className="text-xs text-white/40">{model.usage}%</span>
                    </div>
                    <Progress value={model.usage} className="h-1 mt-1" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs text-white">{model.name} · {model.provider}</p>
                <p className="text-xs text-white/60">Usage: {model.usage}% · Cost: ${model.cost.toLocaleString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {models.map((model, idx) => (
        <TooltipProvider key={model.name}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group">
                <span className="text-sm font-bold text-white/30 w-5">{idx + 1}</span>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-white/10 text-white/60">
                    {model.icon}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">{model.name}</span>
                    <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-white/50">
                      {model.provider}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={model.usage} className="h-1 flex-1" />
                    <span className="text-xs text-white/40">{model.usage}%</span>
                  </div>
                </div>
                <span className="text-xs text-white/50">${model.cost.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs text-white">{model.name} · {model.provider}</p>
              <p className="text-xs text-white/60">Usage: {model.usage}% · Cost: ${model.cost.toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}
