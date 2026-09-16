'use client'

import React from 'react'

interface CostPreviewProps {
  apiCost: number
  commissionRate?: number
  walletBalance?: number
  showDetailedBreakdown?: boolean
}

export function CostPreview({
  apiCost,
  commissionRate = 0.20,
  walletBalance,
  showDetailedBreakdown = true,
}: CostPreviewProps) {
  const commission = apiCost * commissionRate
  const totalCost = apiCost + commission
  const hasEnoughBalance = walletBalance !== undefined ? walletBalance >= totalCost : true
  const remainingBalance =
    walletBalance !== undefined ? walletBalance - totalCost : 0

  return (
    <div className="space-y-3">
      <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
            Cost Breakdown
          </p>
          {walletBalance !== undefined && (
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                hasEnoughBalance
                  ? 'bg-green-400/10 text-green-400'
                  : 'bg-red-400/10 text-red-400'
              }`}
            >
              {hasEnoughBalance ? '✓ Sufficient Balance' : '✗ Insufficient Balance'}
            </span>
          )}
        </div>

        {showDetailedBreakdown && (
          <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">API Cost (Provider)</span>
              <span className="text-sm font-medium text-white">
                ${apiCost.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">
                Commission ({(commissionRate * 100).toFixed(0)}%)
              </span>
              <span className="text-sm font-medium text-amber-400">
                +${commission.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">Total Cost</span>
          <span className="text-lg font-bold text-amber-400">
            ${totalCost.toFixed(2)}
          </span>
        </div>
      </div>

      {walletBalance !== undefined && (
        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Current Wallet Balance</span>
              <span className="text-sm font-medium text-white">
                ${walletBalance.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">After Generation</span>
              <span
                className={`text-sm font-medium ${
                  hasEnoughBalance ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {hasEnoughBalance
                  ? `$${remainingBalance.toFixed(2)}`
                  : `Insufficient ($${Math.abs(remainingBalance).toFixed(2)} short)`}
              </span>
            </div>
          </div>

          {!hasEnoughBalance && (
            <div className="mt-3 p-3 rounded-lg bg-red-400/10 border border-red-400/20">
              <p className="text-xs text-red-400">
                You need to add ${Math.abs(remainingBalance).toFixed(2)} to your wallet
                before generating this video.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-white/40 px-1">
        💡 Cost is deducted from your wallet. Add funds from the Wallet section to get
        started.
      </p>
    </div>
  )
}
