'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts'
import {
  Search, Globe, Target, TrendingUp, Play, DollarSign,
  Clock, Award, Rocket, Zap, FileText, Hash,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════
// Types & Mock Data
// ═══════════════════════════════════════════════════════════════════════

interface AnalyticsData {
  totalResearches: number
  totalContentPieces: number
  totalAdStrategies: number
  avgSEOScore: number
  totalVideosGenerated: number
  totalPlatformSpend: number
  dailyActivity: { name: string; research: number; content: number; ads: number; seo: number; video: number }[]
  industries: { name: string; count: number; percentage: number }[]
  seoByIndustry: { name: string; score: number }[]
  modelUsage: { name: string; provider: string; videos: number; duration: string; cost: number; costPerVideo: number; color: string; accent: string }[]
  spendByModule: { name: string; spend: number; color: string }[]
  spendOverTime: { name: string; research: number; video: number }[]
  contentTypeData: { name: string; count: number }[]
  keywords: { text: string; frequency: number }[]
  recentRuns: { id: number; company: string; industry: string; modules: string[]; seoScore: number; status: 'completed' | 'processing' | 'failed'; date: string }[]
}

const mockAnalyticsData: AnalyticsData = {
  // TODO: replace with real query
  totalResearches: 12847,
  totalContentPieces: 8432,
  totalAdStrategies: 3291,
  avgSEOScore: 78,
  totalVideosGenerated: 5623,
  totalPlatformSpend: 248750,

  dailyActivity: [
    { name: 'Mon', research: 42, content: 28, ads: 15, seo: 33, video: 19 },
    { name: 'Tue', research: 58, content: 41, ads: 22, seo: 47, video: 28 },
    { name: 'Wed', research: 35, content: 52, ads: 18, seo: 29, video: 34 },
    { name: 'Thu', research: 67, content: 38, ads: 31, seo: 54, video: 22 },
    { name: 'Fri', research: 49, content: 45, ads: 27, seo: 41, video: 31 },
    { name: 'Sat', research: 23, content: 19, ads: 9, seo: 18, video: 14 },
    { name: 'Sun', research: 31, content: 24, ads: 12, seo: 22, video: 17 },
  ],

  industries: [
    { name: 'Healthcare', count: 423, percentage: 28 },
    { name: 'E-commerce', count: 356, percentage: 24 },
    { name: 'Real Estate', count: 245, percentage: 16 },
    { name: 'F&B', count: 198, percentage: 13 },
    { name: 'Education', count: 142, percentage: 9 },
    { name: 'Other', count: 106, percentage: 7 },
  ],

  seoByIndustry: [
    { name: 'Healthcare', score: 84 },
    { name: 'E-commerce', score: 79 },
    { name: 'Real Estate', score: 72 },
    { name: 'F&B', score: 68 },
    { name: 'Education', score: 81 },
    { name: 'Other', score: 63 },
  ],

  // TODO: replace with real query
  modelUsage: [
    { name: 'Kling 3.0', provider: 'fal.ai', videos: 1847, duration: '462m 15s', cost: 42580, costPerVideo: 23.05, color: '#EC4899', accent: 'from-pink-500/20 to-pink-600/5' },
    { name: 'Veo 3 Fast', provider: 'Gemini API', videos: 1423, duration: '358m 42s', cost: 31240, costPerVideo: 21.96, color: '#000000', accent: 'from-black/20 to-black/5' },
    { name: 'Runway Gen-4', provider: 'Runway', videos: 982, duration: '245m 30s', cost: 19640, costPerVideo: 20.00, color: '#8B5CF6', accent: 'from-violet-500/20 to-violet-600/5' },
    { name: 'Jogg AI Avatar', provider: 'Jogg AI', videos: 756, duration: '189m 10s', cost: 15120, costPerVideo: 20.00, color: '#F97316', accent: 'from-orange-500/20 to-orange-600/5' },
    { name: 'Luma Ray 3', provider: 'fal.ai', videos: 534, duration: '134m 05s', cost: 8010, costPerVideo: 15.00, color: '#10B981', accent: 'from-emerald-500/20 to-emerald-600/5' },
    { name: 'Hailuo 2.3', provider: 'fal.ai', videos: 412, duration: '103m 20s', cost: 6180, costPerVideo: 15.00, color: '#EF4444', accent: 'from-red-500/20 to-red-600/5' },
    { name: 'MiniMax H3', provider: 'fal.ai', videos: 389, duration: '97m 15s', cost: 5835, costPerVideo: 15.00, color: '#EAB308', accent: 'from-yellow-500/20 to-yellow-600/5' },
    { name: 'Seedance 2.0', provider: 'fal.ai', videos: 278, duration: '70m 00s', cost: 4170, costPerVideo: 15.00, color: '#6366F1', accent: 'from-indigo-500/20 to-indigo-600/5' },
    { name: 'Wan 2.7', provider: 'fal.ai', videos: 195, duration: '49m 10s', cost: 2925, costPerVideo: 15.00, color: '#14B8A6', accent: 'from-teal-500/20 to-teal-600/5' },
    { name: 'Pika 2.2', provider: 'fal.ai', videos: 163, duration: '41m 05s', cost: 3260, costPerVideo: 20.00, color: '#F43F5E', accent: 'from-rose-500/20 to-rose-600/5' },
  ],

  // TODO: replace with real query
  spendByModule: [
    { name: 'Marketing Research', spend: 62400, color: '#000000' },
    { name: 'Content Creation', spend: 48700, color: '#8B5CF6' },
    { name: 'Ads Strategy', spend: 35200, color: '#F97316' },
    { name: 'SEO Analysis', spend: 22100, color: '#06B6D4' },
    { name: 'Video Generation', spend: 80350, color: '#EC4899' },
  ],

  // TODO: replace with real query
  spendOverTime: [
    { name: 'Week 1', research: 4200, video: 5800 },
    { name: 'Week 2', research: 5100, video: 6400 },
    { name: 'Week 3', research: 4800, video: 7200 },
    { name: 'Week 4', research: 6200, video: 8100 },
    { name: 'Week 5', research: 5800, video: 7600 },
    { name: 'Week 6', research: 7100, video: 9200 },
    { name: 'Week 7', research: 6400, video: 8800 },
    { name: 'Week 8', research: 7800, video: 10400 },
  ],

  contentTypeData: [
    { name: 'Blog Posts', count: 2847 },
    { name: 'Instagram Captions', count: 1923 },
    { name: 'WhatsApp Scripts', count: 1456 },
    { name: 'Email Sequences', count: 1102 },
    { name: 'Google Ad Copy', count: 890 },
    { name: 'Meta Ad Copy', count: 745 },
  ],

  keywords: [
    { text: 'aesthetics clinic mumbai', frequency: 94 },
    { text: 'hair treatment', frequency: 87 },
    { text: 'CA services', frequency: 76 },
    { text: 'freight forwarding', frequency: 71 },
    { text: 'skin whitening', frequency: 68 },
    { text: 'botox', frequency: 62 },
    { text: 'MSME loans', frequency: 58 },
    { text: 'digital marketing', frequency: 54 },
    { text: 'plastic surgery', frequency: 49 },
    { text: 'home decor', frequency: 43 },
    { text: 'fitness center', frequency: 38 },
    { text: 'cloud kitchen', frequency: 34 },
  ],

  recentRuns: [
    { id: 10847, company: 'GlowSkin Clinic', industry: 'Healthcare', modules: ['Research', 'SEO'], seoScore: 84, status: 'completed', date: '2026-09-20' },
    { id: 10846, company: 'UrbanEats', industry: 'F&B', modules: ['Content', 'Ads'], seoScore: 72, status: 'processing', date: '2026-09-20' },
    { id: 10845, company: 'PropTech India', industry: 'Real Estate', modules: ['Research', 'SEO', 'Content'], seoScore: 79, status: 'completed', date: '2026-09-19' },
    { id: 10844, company: 'MerchZone', industry: 'E-commerce', modules: ['Ads', 'SEO'], seoScore: 68, status: 'failed', date: '2026-09-19' },
    { id: 10843, company: 'EduNova', industry: 'Education', modules: ['Research', 'Content', 'SEO'], seoScore: 81, status: 'completed', date: '2026-09-18' },
    { id: 10842, company: 'FitCore Gym', industry: 'Healthcare', modules: ['Content', 'SEO'], seoScore: 76, status: 'processing', date: '2026-09-18' },
    { id: 10841, company: 'ShipFast Logistics', industry: 'F&B', modules: ['Research', 'Ads'], seoScore: 65, status: 'completed', date: '2026-09-17' },
    { id: 10840, company: 'Artisan Bakes', industry: 'F&B', modules: ['Content', 'SEO'], seoScore: 70, status: 'completed', date: '2026-09-17' },
  ],
}

const INDUSTRY_COLORS = ['#000000', '#8B5CF6', '#F97316', '#06B6D4', '#10B981', '#64748B']
const MODULE_COLORS = { research: '#000000', content: '#8B5CF6', ads: '#F97316', seo: '#06B6D4', video: '#EC4899' }

// ═══════════════════════════════════════════════════════════════════════
// Sub-Components
// ═══════════════════════════════════════════════════════════════════════

// --- Count-up hook ---
function useCountUp(end: number, duration: number = 2000): number {
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    let startTime = 0
    let animId = 0
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) animId = requestAnimationFrame(step)
    }
    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [end, duration])
  return count
}

function useCountUpDecimal(end: number, decimals: number = 0, duration: number = 2000): string {
  const count = useCountUp(end, duration)
  return count.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

// --- Dark Tooltip ---
const DarkTooltip = ({ active, payload, label, formatter }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0A0A0B]/95 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-xl shadow-xl">
      <p className="text-xs text-white/60 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-medium" style={{ color: p.color }}>
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

// --- Custom Bar Tooltip ---
const BarDarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0A0A0B]/95 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-xl shadow-xl">
      <p className="text-xs text-white/60 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-medium" style={{ color: p.color }}>
          {p.name}: {p.value} runs
        </p>
      ))}
    </div>
  )
}

// --- Section Header ---
const SectionHeader = ({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
)

// ═══════════════════════════════════════════════════════════════════════
// 1. Page Header
// ═══════════════════════════════════════════════════════════════════════

const PageHeader = () => {
  const [range, setRange] = useState<'7D' | '30D' | 'All'>('7D')
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-end justify-between mb-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Platform Analytics</h1>
        <p className="text-white/50 mt-1">Everything your AI has done since day one</p>
      </div>
      <div className="flex items-center gap-1 bg-white/5 border border-white/[0.08] rounded-xl p-1">
        {(['7D', '30D', 'All'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              range === r
                ? 'bg-amber-400/20 text-amber-400'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 2. Top KPI Strip
// ═══════════════════════════════════════════════════════════════════════

const KPICard = ({ label, value, icon: Icon, accent }: { label: string; value: string; icon: React.ReactNode; accent: string }) => {
  const count = useCountUp(parseInt(value.replace(/,/g, '')) || 0)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-white/[0.028] border border-white/[0.07] p-5 hover:border-white/15 transition-all duration-300"
    >
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${accent}`} />
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/50">
          {Icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">{label}</p>
    </motion.div>
  )
}

const TopKPIs = () => {
  const kpis = [
    { label: 'Total Researches Run', value: mockAnalyticsData.totalResearches.toLocaleString('en-IN'), icon: <Search width={18} height={18} />, accent: 'from-black to-black/20' },
    { label: 'Content Pieces Generated', value: mockAnalyticsData.totalContentPieces.toLocaleString('en-IN'), icon: <FileText width={18} height={18} />, accent: 'from-violet-400 to-purple-600' },
    { label: 'Ad Strategies Created', value: mockAnalyticsData.totalAdStrategies.toLocaleString('en-IN'), icon: <Target width={18} height={18} />, accent: 'from-orange-400 to-red-500' },
    { label: 'Avg SEO Score', value: `${mockAnalyticsData.avgSEOScore}/100`, icon: <Award width={18} height={18} />, accent: 'from-amber-400 to-yellow-500' },
    { label: 'Videos Generated', value: mockAnalyticsData.totalVideosGenerated.toLocaleString('en-IN'), icon: <Play width={18} height={18} />, accent: 'from-pink-400 to-rose-500' },
    { label: 'Platform Spend', value: `₹${mockAnalyticsData.totalPlatformSpend.toLocaleString('en-IN')}`, icon: <DollarSign width={18} height={18} />, accent: 'from-emerald-400 to-green-500' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
    >
      {kpis.map((kpi, i) => (
        <KPICard key={kpi.label} {...kpi} />
      ))}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 3. Module Activity Chart
// ═══════════════════════════════════════════════════════════════════════

const ModuleActivityChart = () => {
  const data = mockAnalyticsData.dailyActivity
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl bg-white/[0.028] border border-white/[0.07] p-6"
    >
      <SectionHeader title="Module Activity" subtitle="Runs per day across all modules" />
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barCategoryGap="20%">
          <defs>
            <linearGradient id="researchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="contentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="adsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="seoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} tickMargin={8} axisLine={false} />
          <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickMargin={8} axisLine={false} />
          <Tooltip content={<BarDarkTooltip />} />
          <Bar dataKey="research" stackId="a" fill="url(#researchGrad)" radius={[0, 0, 0, 0]} name="Marketing Research" />
          <Bar dataKey="content" stackId="a" fill="url(#contentGrad)" name="Content Creation" />
          <Bar dataKey="ads" stackId="a" fill="url(#adsGrad)" name="Ads Strategy" />
          <Bar dataKey="seo" stackId="a" fill="url(#seoGrad)" name="SEO Dashboard" />
          <Bar dataKey="video" stackId="a" fill="#EC4899" radius={[4, 4, 0, 0]} name="Video Generation" />
        </BarChart>
      </ResponsiveContainer>
      {/* Legend pills */}
      <div className="flex flex-wrap gap-2 mt-4">
        {[
          { label: 'Research', color: '#000000' },
          { label: 'Content', color: '#8B5CF6' },
          { label: 'Ads', color: '#F97316' },
          { label: 'SEO', color: '#06B6D4' },
          { label: 'Video', color: '#EC4899' },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-white/50 bg-white/[0.03] px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 4. Two-column row (Industry Donut + SEO Horizontal Bar)
// ═══════════════════════════════════════════════════════════════════════

const IndustryBreakdown = () => {
  const data = mockAnalyticsData.industries
  const total = data.reduce((s, d) => s + d.count, 0)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-white/[0.028] border border-white/[0.07] p-6"
    >
      <SectionHeader title="Industries Analyzed" />
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="count"
            nameKey="name"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={INDUSTRY_COLORS[index % INDUSTRY_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(10,10,11,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: number) => [value.toLocaleString('en-IN'), 'Companies']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mb-3">
        <span className="text-xl font-bold text-white">{total.toLocaleString('en-IN')}</span>
        <span className="text-xs text-white/40 ml-1">total analyzed</span>
      </div>
      {/* Legend */}
      <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: INDUSTRY_COLORS[i] }} />
              <span className="text-white/60">{item.name}</span>
            </div>
            <span className="text-white/40">{item.count} ({item.percentage}%)</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const SEOScoreByIndustry = () => {
  const data = mockAnalyticsData.seoByIndustry
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-2xl bg-white/[0.028] border border-white/[0.07] p-6"
    >
      <SectionHeader title="Avg SEO Score by Industry" />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" stroke="#64748B" tick={{ fontSize: 11 }} tickMargin={8} axisLine={false} domain={[0, 100]} />
          <YAxis type="category" dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} tickMargin={8} axisLine={false} width={100} />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(10,10,11,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: number) => [`${value}/100`, 'SEO Score']}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => {
              const ratio = entry.score / 100
              const r = Math.round(244 * (1 - ratio) + 6 * ratio)
              const g = Math.round(200 * (1 - ratio) + 180 * ratio)
              const b = Math.round(200 * (1 - ratio) + 220 * ratio)
              return <Cell key={`cell-${index}`} fill={`rgb(${r},${g},${b})`} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 5. Video Model Leaderboard
// ═══════════════════════════════════════════════════════════════════════

const VideoModelLeaderboard = () => {
  const sorted = [...mockAnalyticsData.modelUsage].sort((a, b) => b.videos - a.videos)
  const topVideos = sorted[0]?.videos || 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl bg-white/[0.028] border border-white/[0.07] p-6"
    >
      <SectionHeader title="AI Model Usage — Ranked" subtitle="Most used to least used" />
      <div className="space-y-2">
        {sorted.map((model, idx) => (
          <div key={model.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] transition-all">
            {/* Rank */}
            <span className="text-xs font-bold text-white/25 w-8 text-center shrink-0">
              {idx < 3 ? (
                <span className="text-[10px]">{idx === 0 ? '01' : idx === 1 ? '02' : '03'}</span>
              ) : idx + 1}
            </span>
            {/* Model info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white truncate">{model.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/[0.06] shrink-0">
                  {model.provider}
                </span>
              </div>
              {/* Usage bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(model.videos / topVideos) * 100}%`, backgroundColor: model.color }}
                  />
                </div>
                <span className="text-[10px] text-white/30 w-8 text-right">{model.videos}</span>
              </div>
            </div>
            {/* Duration & Cost */}
            <div className="text-right shrink-0 hidden md:block">
              <p className="text-[11px] text-white/50 font-medium">{model.duration}</p>
              <p className="text-[10px] text-white/30">₹{model.cost.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const VideoStatCards = () => {
  const topModel = mockAnalyticsData.modelUsage[0]
  const mostMinutes = mockAnalyticsData.modelUsage.reduce((best, m) => {
    const mins = parseInt(m.duration) || 0
    return mins > (parseInt(best.duration) || 0) ? m : best
  }, mockAnalyticsData.modelUsage[0])
  const mostExpensive = mockAnalyticsData.modelUsage.reduce((best, m) => m.cost > m.cost ? m : best, mockAnalyticsData.modelUsage[0])

  const stats = [
    { label: 'Most Used Model', value: topModel.name, sub: `${topModel.videos.toLocaleString()} generations`, icon: <Rocket width={20} height={20} />, color: '#EC4899' },
    { label: 'Most Minutes Generated', value: mostMinutes.name, sub: mostMinutes.duration, icon: <Clock width={20} height={20} />, color: '#06B6D4' },
    { label: 'Most Expensive Model', value: mostExpensive.name, sub: `₹${mostExpensive.cost.toLocaleString('en-IN')}`, icon: <DollarSign width={20} height={20} />, color: '#F97316' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
      {stats.map((stat) => (
        <div key={stat.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</p>
          </div>
          <p className="text-sm font-semibold text-white truncate">{stat.value}</p>
          <p className="text-[10px] text-white/30 mt-0.5">{stat.sub}</p>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 6. Spend Breakdown
// ═══════════════════════════════════════════════════════════════════════

const SpendByModule = () => {
  const total = mockAnalyticsData.spendByModule.reduce((s, d) => s + d.spend, 0)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl bg-white/[0.028] border border-white/[0.07] p-6"
    >
      <SectionHeader title="Spend by Module" />
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={mockAnalyticsData.spendByModule}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="spend"
            nameKey="name"
          >
            {mockAnalyticsData.spendByModule.map((_, index) => (
              <Cell key={`cell-${index}`} fill={mockAnalyticsData.spendByModule[index].color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(10,10,11,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Spend']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <span className="text-xl font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
        <span className="text-xs text-white/40 ml-1">total spend</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {mockAnalyticsData.spendByModule.map((item, i) => (
          <span key={item.name} className="flex items-center gap-1.5 text-[10px] text-white/40 bg-white/[0.03] px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

const SpendOverTime = () => {
  const data = mockAnalyticsData.spendOverTime
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="rounded-2xl bg-white/[0.028] border border-white/[0.07] p-6"
    >
      <SectionHeader title="Cumulative API Spend" subtitle="Research vs Video spend over time" />
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="researchSpendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="videoSpendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} tickMargin={8} axisLine={false} />
          <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickMargin={8} axisLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(10,10,11,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]}
          />
          <Area type="monotone" dataKey="research" stroke="#000000" fill="url(#researchSpendGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="video" stroke="#EC4899" fill="url(#videoSpendGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 7. Content Intelligence
// ═══════════════════════════════════════════════════════════════════════

const ContentTypeChart = () => {
  const data = mockAnalyticsData.contentTypeData
  const maxCount = Math.max(...data.map(d => d.count))
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-2xl bg-white/[0.028] border border-white/[0.07] p-6"
    >
      <SectionHeader title="Content Type Breakdown" />
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <span className="text-xs text-white/50 w-28 shrink-0 truncate">{item.name}</span>
            <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-700"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/40 w-10 text-right">{item.count.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const TopKeywords = () => {
  const accentColors = ['#000000', '#8B5CF6', '#F97316', '#06B6D4', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6', '#84CC16', '#F43F5E']
  const maxFreq = Math.max(...mockAnalyticsData.keywords.map(k => k.frequency))
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.65 }}
      className="rounded-2xl bg-white/[0.028] border border-white/[0.07] p-6"
    >
      <SectionHeader title="Top Keywords Across All Researches" />
      <div className="flex flex-wrap gap-2">
        {mockAnalyticsData.keywords.map((kw, i) => {
          const size = 11 + (kw.frequency / maxFreq) * 7
          const opacity = 0.4 + (kw.frequency / maxFreq) * 0.6
          const color = accentColors[i % accentColors.length]
          return (
            <span
              key={kw.text}
              className="inline-block px-2.5 py-1 rounded-lg border transition-all hover:scale-105 cursor-default"
              style={{
                fontSize: `${size}px`,
                opacity,
                borderColor: `${color}30`,
                backgroundColor: `${color}10`,
                color: color,
              }}
            >
              {kw.text}
            </span>
          )
        })}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// 8. Recent Runs Table
// ═══════════════════════════════════════════════════════════════════════

const statusStyles = {
  completed: 'bg-green-400/10 text-green-400 border-green-400/20',
  processing: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  failed: 'bg-red-400/10 text-red-400 border-red-400/20',
}

const RecentRunsTable = () => {
  const [sortField, setSortField] = useState<string>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const sorted = [...mockAnalyticsData.recentRuns].sort((a, b) => {
    const aVal = (a as any)[sortField]
    const bVal = (b as any)[sortField]
    if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal
  })

  const SortIcon = ({ field }: { field: string }) => (
    <span className={`ml-1 inline-block transition-transform ${sortField === field ? 'text-amber-400' : 'text-white/20'}`}>
      {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="rounded-2xl bg-white/[0.028] border border-white/[0.07] p-6 overflow-hidden"
    >
      <SectionHeader title="All Analysis Runs" subtitle={`${mockAnalyticsData.recentRuns.length} recent runs`}>
        <span className="text-[10px] text-white/30">Click headers to sort</span>
      </SectionHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {[
                { field: 'id', label: '#' },
                { field: 'company', label: 'Company / URL' },
                { field: 'industry', label: 'Industry' },
                { field: 'modules', label: 'Modules' },
                { field: 'seoScore', label: 'SEO Score' },
                { field: 'status', label: 'Status' },
                { field: 'date', label: 'Date' },
              ].map((col) => (
                <th
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  className="text-left py-3 px-3 text-white/40 font-medium uppercase tracking-wider cursor-pointer hover:text-white/60 transition-colors"
                >
                  {col.label}<SortIcon field={col.field} />
                </th>
              ))}
              <th className="text-right py-3 px-3 text-white/40 font-medium uppercase tracking-wider">Report</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((run) => (
              <tr key={run.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3 text-white/30 font-mono">{run.id}</td>
                <td className="py-3 px-3 text-white font-medium">{run.company}</td>
                <td className="py-3 px-3 text-white/50">{run.industry}</td>
                <td className="py-3 px-3">
                  <div className="flex gap-1">
                    {run.modules.map((m) => (
                      <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/[0.06]">{m}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className={`font-bold ${run.seoScore >= 80 ? 'text-green-400' : run.seoScore >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                    {run.seoScore}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusStyles[run.status]}`}>
                    {run.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-white/40">{run.date}</td>
                <td className="py-3 px-3 text-right">
                  <span className="text-amber-400/60 hover:text-amber-400 cursor-pointer transition-colors">View Report</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-black relative">
      {/* Background Orbs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-black/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      {/* Dot grid */}
      <div className="fixed inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        <PageHeader />
        <TopKPIs />

          {/* Module Activity */}
          <ModuleActivityChart />

          {/* Two-column: Industry + SEO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
            <IndustryBreakdown />
            <SEOScoreByIndustry />
          </div>

          {/* Video Model Leaderboard */}
          <VideoModelLeaderboard />
          <VideoStatCards />

          {/* Spend Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
            <SpendByModule />
            <SpendOverTime />
          </div>

          {/* Content Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
            <ContentTypeChart />
            <TopKeywords />
          </div>

          {/* Recent Runs */}
          <RecentRunsTable />
      </div>
    </div>
  )
}
