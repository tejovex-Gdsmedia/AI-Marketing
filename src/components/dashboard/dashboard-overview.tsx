'use client'

import React from 'react'
import { StatCard } from './stat-card'
import { ActionCard } from './action-card'
import { MetricChart } from './metric-chart'
import { StatusBadge } from '../common/status-badge'

interface DashboardOverviewProps {
  companyName: string
  onGenerateVideo: () => void
  onGenerateImage: () => void
  onViewAnalytics: () => void
}

export function DashboardOverview({
  companyName,
  onGenerateVideo,
  onGenerateImage,
  onViewAnalytics,
}: DashboardOverviewProps) {
  // Mock data - replace with real data from your backend
  const mockChartData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 25 },
    { name: 'Fri', value: 22 },
    { name: 'Sat', value: 18 },
    { name: 'Sun', value: 28 },
  ]

  const mockCostData = [
    { name: 'Kling 3.0', value: 45 },
    { name: 'Veo 3 Fast', value: 32 },
    { name: 'Runway Gen-4', value: 28 },
    { name: 'MiniMax H3', value: 18 },
    { name: 'Others', value: 12 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {companyName}!</h1>
        <p className="text-white/60">Here's your AI marketing platform overview</p>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Videos Generated"
            value="47"
            unit="this month"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            }
            trend={{ value: 23, isPositive: true }}
            color="amber"
          />

          <StatCard
            title="Images Generated"
            value="124"
            unit="total"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            }
            trend={{ value: 18, isPositive: true }}
            color="blue"
          />

          <StatCard
            title="Total Spend"
            value="$847"
            unit="USD"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            }
            trend={{ value: 12, isPositive: false }}
            color="green"
          />

          <StatCard
            title="Avg Gen Time"
            value="2.5"
            unit="minutes"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            }
            trend={{ value: 8, isPositive: true }}
            color="purple"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricChart
          title="Videos Generated (Last 7 Days)"
          data={mockChartData}
          type="line"
          color="#FBBF24"
          height={280}
        />

        <MetricChart
          title="Cost by Model"
          data={mockCostData}
          type="bar"
          color="#FBBF24"
          height={280}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            title="Generate Video"
            description="Create AI-powered marketing videos with avatars or text-to-video"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            }
            actionLabel="Create Video"
            onClick={onGenerateVideo}
            variant="primary"
            badge="New"
          />

          <ActionCard
            title="Generate Image"
            description="Design stunning marketing images powered by AI"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            }
            actionLabel="Create Image"
            onClick={onGenerateImage}
            variant="secondary"
          />

          <ActionCard
            title="View Analytics"
            description="Deep dive into your marketing performance metrics"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            }
            actionLabel="View Details"
            onClick={onViewAnalytics}
            variant="secondary"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { title: 'Video generated with Kling 3.0', time: '2 hours ago', status: 'success' },
            { title: 'Image generation in progress', time: '15 minutes ago', status: 'processing' },
            { title: 'Video export completed', time: '1 day ago', status: 'success' },
          ].map((activity, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">{activity.title}</p>
                <p className="text-xs text-white/40 mt-1">{activity.time}</p>
              </div>
              <StatusBadge status={activity.status as any} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
