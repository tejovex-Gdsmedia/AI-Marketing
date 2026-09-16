'use client'

import React, { useState, useEffect } from 'react'
import { CostPreview } from '@/components/wallet/cost-preview'

interface VideoGenerationWithWalletProps {
  userId: string
  modelId: string
  modelName: string
  apiCost: number
  onGenerationStart?: () => void
  onGenerationComplete?: (videoUrl: string) => void
  onError?: (error: string) => void
}

export function VideoGenerationWithWallet({
  userId,
  modelId,
  modelName,
  apiCost,
  onGenerationStart,
  onGenerationComplete,
  onError,
}: VideoGenerationWithWalletProps) {
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWalletBalance()
  }, [userId])

  const fetchWalletBalance = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/wallet?userId=${userId}`)
      const data = await res.json()

      if (res.ok) {
        setWalletBalance(data.wallet.balance)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch wallet')
      }
    } catch (err) {
      setError('Failed to fetch wallet balance')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const commissionRate = 0.20
  const commission = apiCost * commissionRate
  const totalCost = apiCost + commission
  const hasEnoughBalance =
    walletBalance !== null && walletBalance >= totalCost

  return (
    <div className="space-y-4">
      {/* Wallet Status */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-red-400/10 border border-red-400/20">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchWalletBalance}
            className="text-xs text-red-300 underline mt-2"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {/* Cost Preview */}
          <CostPreview
            apiCost={apiCost}
            commissionRate={commissionRate}
            walletBalance={walletBalance || 0}
            showDetailedBreakdown={true}
          />

          {/* Wallet Status Alert */}
          {!hasEnoughBalance && (
            <div className="p-4 rounded-lg bg-amber-400/10 border border-amber-400/20">
              <p className="text-sm text-amber-400">
                ⚠️ Insufficient wallet balance. You need to add funds before generating
                this video.
              </p>
              <a
                href="#wallet-section"
                className="text-xs text-amber-300 underline mt-2 inline-block"
              >
                Go to Wallet to add funds
              </a>
            </div>
          )}

          {/* Info Box */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10">
            <p className="text-xs text-white/60">
              <strong>💳 Payment Method:</strong> Wallet balance (deducted upon generation)
            </p>
          </div>
        </>
      )}
    </div>
  )
}
