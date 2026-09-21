'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/common/status-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'

interface ActivityItem {
  id: string
  title: string
  description: string
  status: 'success' | 'processing' | 'failed' | 'pending'
  time: string
  user?: string
  module?: string
}

const activities: ActivityItem[] = [
  { id: '1', title: 'Video generated', description: 'Kling 3.0 completed', status: 'success', time: '2m ago', user: 'AI', module: 'Video' },
  { id: '2', title: 'SEO scan started', description: 'Analyzing competitor pages', status: 'processing', time: '5m ago', user: 'AI', module: 'SEO' },
  { id: '3', title: 'Image batch done', description: '4 images created', status: 'success', time: '12m ago', user: 'AI', module: 'Images' },
  { id: '4', title: 'Ad copy failed', description: 'Runway Gen-4 error', status: 'failed', time: '18m ago', user: 'AI', module: 'Ads' },
  { id: '5', title: 'Report ready', description: 'Marketing research complete', status: 'success', time: '25m ago', user: 'AI', module: 'Research' },
]

export function ActivityFeed() {
  return (
    <div className="space-y-2">
      {activities.map((item) => (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-white/10 text-white/60 text-xs">
                    {item.user?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-medium truncate">{item.title}</p>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 truncate">{item.description}</p>
                </div>
                <span className="text-xs text-white/30 shrink-0">{item.time}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="space-y-1">
                <p className="text-xs text-white font-medium">{item.title}</p>
                <p className="text-xs text-white/60">{item.description}</p>
                <p className="text-xs text-white/40">Module: {item.module} · {item.time}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}
