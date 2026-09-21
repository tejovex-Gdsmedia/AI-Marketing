'use client'

import React from 'react'
import { StatCard } from './stat-card'
import { ActionCard } from './action-card'
import { MetricChart } from './metric-chart'
import { StatusBadge } from '../common/status-badge'
import { KPIWidget } from './kpi-widget'
import { RevenueChart } from './revenue-chart'
import { ActivityFeed } from './activity-feed'
import { TopModels } from './top-models'
import { Sparkline } from './sparkline'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Activity,
  Target,
  DollarSign,
  Play,
  Image,
  BarChart3,
  Clock,
  ArrowRight,
  Sparkles,
  Brain,
  Rocket,
  Gauge,
  Layers,
} from 'lucide-react'

interface DashboardOverviewProps {
  companyName: string
  stats?: {
    videosGenerated: number
    imagesGenerated: number
    totalSpend: number
    avgGenTime: number
  }
  chartData?: any[]
  costData?: any[]
  activity?: { title: string; time: string; status: 'success' | 'processing' | 'failed' }[]
  onGenerateVideo: () => void
  onGenerateImage: () => void
  onViewAnalytics: () => void
}

export function DashboardOverview({
  companyName,
  stats,
  chartData,
  costData,
  activity,
  onGenerateVideo,
  onGenerateImage,
  onViewAnalytics,
}: DashboardOverviewProps) {
  const data = {
    chartData: chartData || [
      { name: 'Mon', value: 12 },
      { name: 'Tue', value: 19 },
      { name: 'Wed', value: 15 },
      { name: 'Thu', value: 25 },
      { name: 'Fri', value: 22 },
      { name: 'Sat', value: 18 },
      { name: 'Sun', value: 28 },
    ],
    costData: costData || [
      { name: 'Kling 3.0', value: 45 },
      { name: 'Veo 3 Fast', value: 32 },
      { name: 'Runway Gen-4', value: 28 },
      { name: 'MiniMax H3', value: 18 },
      { name: 'Others', value: 12 },
    ],
    stats: stats || {
      videosGenerated: 47,
      imagesGenerated: 124,
      totalSpend: 847,
      avgGenTime: 2.5,
    },
    activity: activity || []
  }

  // KPI data for the new widget system
  const kpiData = [
    {
      label: 'Revenue',
      value: '$12.4K',
      previousValue: '$9.8K',
      trend: 26.5,
      trendLabel: 'vs last month',
      icon: <DollarSign width={18} height={18} />,
      sparklineData: [20, 24, 22, 28, 30, 27, 35, 32, 38, 42],
      status: 'good' as const,
    },
    {
      label: 'Active Users',
      value: '1,284',
      previousValue: '1,042',
      trend: 23.2,
      trendLabel: 'vs last month',
      icon: <Activity width={18} height={18} />,
      sparklineData: [30, 35, 32, 40, 38, 45, 50, 48, 55, 62],
      status: 'good' as const,
    },
    {
      label: 'Conversion Rate',
      value: '4.8%',
      previousValue: '5.2%',
      trend: -7.7,
      trendLabel: 'vs last month',
      icon: <Target width={18} height={18} />,
      sparklineData: [50, 48, 45, 47, 44, 46, 43, 45, 44, 48],
      status: 'warning' as const,
    },
    {
      label: 'Avg Session',
      value: '3m 42s',
      previousValue: '3m 15s',
      trend: 12.4,
      trendLabel: 'vs last month',
      icon: <Clock width={18} height={18} />,
      sparklineData: [10, 12, 14, 13, 16, 15, 18, 17, 19, 21],
      status: 'good' as const,
    },
    {
      label: 'Bounce Rate',
      value: '32.1%',
      previousValue: '35.4%',
      trend: -9.3,
      trendLabel: 'vs last month',
      icon: <TrendingDown width={18} height={18} />,
      sparklineData: [40, 38, 35, 36, 33, 34, 32, 33, 31, 32],
      status: 'good' as const,
    },
    {
      label: 'Churn Rate',
      value: '2.3%',
      previousValue: '1.8%',
      trend: 27.8,
      trendLabel: 'vs last month',
      icon: <TrendingUp width={18} height={18} />,
      sparklineData: [15, 16, 18, 17, 19, 20, 21, 22, 23, 24],
      status: 'danger' as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {companyName}!</h1>
          <p className="text-white/60">Here's your AI marketing platform overview</p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Insights
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs text-white">AI-powered recommendations ready</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="default" size="sm" className="bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:opacity-90">
            <Rocket className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>
      </div>

      {/* KPI Widget Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-white/40" />
          <h2 className="text-lg font-semibold text-white">Key Metrics</h2>
          <Badge variant="outline" className="ml-2 text-[10px] bg-amber-400/10 text-amber-400 border-amber-400/20">Live</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiData.map((kpi) => (
            <KPIWidget key={kpi.label} data={kpi} />
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Charts (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <RevenueChart />

          {/* Video Generation Chart */}
          <Card className="bg-[#0A0A0B] border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-white">Video Generation Activity</CardTitle>
                  <CardDescription className="text-white/40">Weekly video output across models</CardDescription>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[10px] text-white/40">Live</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <MetricChart
                title=""
                data={data.chartData}
                type="line"
                color="#f59e0b"
                height={220}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionCard
                title="Generate Video"
                description="Create AI-powered marketing videos with avatars or text-to-video"
                icon={<Play className="w-5 h-5 text-amber-400" />}
                actionLabel="Create Video"
                onClick={onGenerateVideo}
                variant="primary"
                badge="New"
              />
              <ActionCard
                title="Generate Image"
                description="Design stunning marketing images powered by AI"
                icon={<Image className="w-5 h-5 text-white/60" />}
                actionLabel="Create Image"
                onClick={onGenerateImage}
                variant="secondary"
              />
              <ActionCard
                title="View Analytics"
                description="Deep dive into your marketing performance metrics"
                icon={<BarChart3 className="w-5 h-5 text-white/60" />}
                actionLabel="View Details"
                onClick={onViewAnalytics}
                variant="secondary"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar (1/3 width) */}
        <div className="space-y-6 lg:self-start">
          {/* Top Models */}
          <Card className="bg-[#0A0A0B] border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-white/40" />
                <CardTitle className="text-sm font-semibold text-white">Top Models</CardTitle>
                <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-white/50">Usage</Badge>
              </div>
              <CardDescription className="text-white/40">Model utilization this week</CardDescription>
            </CardHeader>
            <CardContent>
              <TopModels compact />
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="bg-[#0A0A0B] border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white/40" />
                <CardTitle className="text-sm font-semibold text-white">Activity Feed</CardTitle>
                <Badge variant="outline" className="text-[10px] bg-green-400/10 text-green-400 border-green-400/20">Live</Badge>
              </div>
              <CardDescription className="text-white/40">Recent platform events</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>

          {/* Cost by Model */}
          <Card className="bg-[#0A0A0B] border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-white/40" />
                <CardTitle className="text-sm font-semibold text-white">Cost Breakdown</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <MetricChart
                title=""
                data={data.costData}
                type="bar"
                color="#f59e0b"
                height={200}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row: Enhanced Stats + Full Activity — aligned cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Enhanced Stats Cards */}
        <Card className="bg-[#0A0A0B] border-white/10 h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-white">Platform Statistics</CardTitle>
                <CardDescription className="text-white/40">Performance overview this period</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs text-white">View detailed breakdown</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                    <Play className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{data.stats.videosGenerated}</p>
                    <p className="text-[10px] text-white/40">Videos</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-[10px] text-green-400">+23%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                    <Image className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{data.stats.imagesGenerated}</p>
                    <p className="text-[10px] text-white/40">Images</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-[10px] text-green-400">+18%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">${data.stats.totalSpend}</p>
                    <p className="text-[10px] text-white/40">Total Spend</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] text-red-400">+12%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{data.stats.avgGenTime}m</p>
                    <p className="text-[10px] text-white/40">Avg Time</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-400" />
                  <span className="text-[10px] text-green-400">-8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Activity Table */}
        <Card className="bg-[#0A0A0B] border-white/10 h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-white">All Activity</CardTitle>
                <CardDescription className="text-white/40">Detailed transaction history</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-white/50">
                {activity?.length || 0} events
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { title: 'Kling 3.0 video rendered', desc: 'Marketing campaign A', status: 'success' as const, time: '2m ago', icon: '🎬' },
                { title: 'SEO scan in progress', desc: 'Analyzing 42 competitor pages', status: 'processing' as const, time: '5m ago', icon: '🔍' },
                { title: 'Image batch complete', desc: '4 images for ad set B', status: 'success' as const, time: '12m ago', icon: '🖼️' },
                { title: 'Ad copy generation failed', desc: 'Runway Gen-4 timeout', status: 'failed' as const, time: '18m ago', icon: '⚠️' },
                { title: 'Research report ready', desc: 'Market analysis complete', status: 'success' as const, time: '25m ago', icon: '📊' },
                { title: 'Veo 3 Fast rendering', desc: 'Product demo video', status: 'processing' as const, time: '31m ago', icon: '🎥' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group">
                  <span className="text-base">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white font-medium truncate">{item.title}</p>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-xs text-white/30 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
