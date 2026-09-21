'use client'

import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MetricChartProps {
  title: string
  data: Array<{ name: string; value: number; [key: string]: any }>
  type?: 'line' | 'bar'
  color?: string
  height?: number
  showGrid?: boolean
}

export function MetricChart({
  title,
  data,
  type = 'line',
  color = '#ffffff',
  height = 300,
  showGrid = true,
}: MetricChartProps) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>

      <ResponsiveContainer width="100%" height={height}>
        {type === 'line' ? (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} tickMargin={6} interval="preserveStartEnd" />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} tickMargin={6} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 11, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} tickMargin={6} interval="preserveStartEnd" />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} tickMargin={6} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 11, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
