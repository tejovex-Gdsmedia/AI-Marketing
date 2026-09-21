'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

const chartData = [
  { name: 'Mon', revenue: 4200, costs: 2800, users: 120 },
  { name: 'Tue', revenue: 5100, costs: 3200, users: 145 },
  { name: 'Wed', revenue: 4800, costs: 3100, users: 138 },
  { name: 'Thu', revenue: 6200, costs: 3800, users: 162 },
  { name: 'Fri', revenue: 5800, costs: 3500, users: 155 },
  { name: 'Sat', revenue: 3900, costs: 2600, users: 110 },
  { name: 'Sun', revenue: 4500, costs: 3000, users: 130 },
]

export function RevenueChart() {
  return (
    <Card className="bg-[#0A0A0B] border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-white">Revenue Overview</CardTitle>
          <CardDescription className="text-white/40">Income vs costs over the week</CardDescription>
        </div>
        <Tabs defaultValue="revenue" className="w-fit">
          <TabsList className="bg-white/5 border-white/10 text-white/60">
            <TabsTrigger value="revenue" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs">
              Revenue
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs">
              Users
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenue">
          <TabsContent value="revenue" className="mt-0">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="revenueClip"><rect x="0" y="0" width="300" height="200" /></clipPath>
                  <linearGradient id="costsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="costsClip"><rect x="0" y="0" width="300" height="200" /></clipPath>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} tickMargin={6} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} tickMargin={6} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(10,10,11,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#revenueGrad)" strokeWidth={2} clipPath="url(#revenueClip)" />
                <Area type="monotone" dataKey="costs" stroke="#6366f1" fill="url(#costsGrad)" strokeWidth={2} clipPath="url(#costsClip)" />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="users" className="mt-0">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} tickMargin={6} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} tickMargin={6} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(10,10,11,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="users" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
