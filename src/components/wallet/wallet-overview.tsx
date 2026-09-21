'use client'

import React, { useEffect, useState } from 'react'

interface WalletData {
  balance: number
  totalAdded: number
  totalSpent: number
}

interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  balanceBefore: number
  balanceAfter: number
  createdAt: string
}

interface WalletOverviewProps {
  userId: string
}

export function WalletOverview({ userId }: WalletOverviewProps) {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [topupAmount, setTopupAmount] = useState('')
  const [topupLoading, setTopupLoading] = useState(false)
  const [showTopupModal, setShowTopupModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchWallet()
  }, [userId])

  const fetchWallet = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/wallet?userId=${userId}`)
      const data = await res.json()

      if (res.ok) {
        setWallet(data.wallet)
        setTransactions(data.transactions)
      } else {
        setError(data.error || 'Failed to fetch wallet')
      }
    } catch (err) {
      setError('Failed to fetch wallet')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTopup = async () => {
    if (!topupAmount || parseFloat(topupAmount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setTopupLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: parseFloat(topupAmount),
          description: 'Wallet top-up via dashboard',
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(`Successfully added $${topupAmount} to wallet!`)
        setWallet(data.wallet)
        setTopupAmount('')
        setShowTopupModal(false)
        // Refresh transactions after a short delay
        setTimeout(fetchWallet, 500)
      } else {
        setError(data.error || 'Failed to add credit')
      }
    } catch (err) {
      setError('Failed to process top-up')
      console.error(err)
    } finally {
      setTopupLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Balance */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-500/5 border border-amber-400/20">
          <p className="text-xs text-amber-400/70 font-medium uppercase tracking-wider mb-2">
            Current Balance
          </p>
          <p className="text-3xl font-bold text-white mb-1">
            ${wallet?.balance.toFixed(2) || '0.00'}
          </p>
          <p className="text-xs text-white/40">Available for video generation</p>
        </div>

        {/* Total Added */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-400/10 to-emerald-500/5 border border-green-400/20">
          <p className="text-xs text-green-400/70 font-medium uppercase tracking-wider mb-2">
            Total Added
          </p>
          <p className="text-3xl font-bold text-green-400">
            ${wallet?.totalAdded.toFixed(2) || '0.00'}
          </p>
          <p className="text-xs text-white/40">Lifetime credit added</p>
        </div>

        {/* Total Spent */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-400/10 to-cyan-500/5 border border-blue-400/20">
          <p className="text-xs text-blue-400/70 font-medium uppercase tracking-wider mb-2">
            Total Spent
          </p>
          <p className="text-3xl font-bold text-blue-400">
            ${wallet?.totalSpent.toFixed(2) || '0.00'}
          </p>
          <p className="text-xs text-white/40">Spent on video generation</p>
        </div>
      </div>

      {/* Payment Options — Razorpay Section */}
      <div className="p-6 rounded-[2rem] bg-[#0A0A0B]/60 border border-white/[0.06] backdrop-blur-xl shadow-[0_0_40px_-12px_rgba(245,158,11,0.08)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-400/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Payment Options</h3>
            <p className="text-[11px] text-white/35">Instant top-up via UPI or cards</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* UPI / QR */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-400/30 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📱</span>
              <h4 className="text-sm font-semibold text-white">UPI / QR Pay</h4>
            </div>
            <div className="bg-white rounded-xl p-3 mb-3 flex items-center justify-center shadow-inner">
              {/* QR Placeholder */}
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="10" y="10" width="25" height="25" fill="#0A0A0B" stroke="#f59e0b" strokeWidth="3"/>
                  <rect x="65" y="10" width="25" height="25" fill="#0A0A0B" stroke="#f59e0b" strokeWidth="3"/>
                  <rect x="10" y="65" width="25" height="25" fill="#0A0A0B" stroke="#f59e0b" strokeWidth="3"/>
                  <rect x="42" y="42" width="16" height="16" fill="#f59e0b"/>
                  <rect x="20" y="20" width="6" height="6" fill="#0A0A0B"/>
                  <rect x="20" y="75" width="6" height="6" fill="#0A0A0B"/>
                  <rect x="75" y="75" width="6" height="6" fill="#0A0A0B"/>
                  <rect x="48" y="48" width="4" height="4" fill="#0A0A0B"/>
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-white/30 text-center">Scan with any UPI app — GPay, PhonePe, Paytm</p>
          </div>

          {/* Razorpay Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-400/5 to-orange-500/5 border border-amber-400/20 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💳</span>
              <h4 className="text-sm font-semibold text-amber-400">Razorpay</h4>
            </div>
            <p className="text-xs text-white/50 mb-3">Credit / Debit card · Net Banking · EMI</p>
            <button
              onClick={() => setShowTopupModal(true)}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-bold hover:opacity-90 transition-opacity shadow-lg shadow-amber-400/20"
            >
              Pay with Razorpay
            </button>
          </div>

          {/* Net Banking / Wallet */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏦</span>
              <h4 className="text-sm font-semibold text-white">Bank Transfer</h4>
            </div>
            <p className="text-xs text-white/50 mb-3">IMPS / NEFT to Launchpad wallet account</p>
            <div className="text-[10px] text-white/30 space-y-1 bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
              <p>Account: Launchpad Pay</p>
              <p>IFSC: LAUN0000123</p>
              <p>Bank: HDFC · Ref: {userId?.slice(0, 8)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top-up Button */}
      <button
        onClick={() => setShowTopupModal(true)}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        💳 Add Funds to Wallet
      </button>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg bg-red-400/10 border border-red-400/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-green-400/10 border border-green-400/20">
          <p className="text-sm text-green-400">{success}</p>
        </div>
      )}

      {/* Transaction History */}
      <div className="border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Transaction History</h3>
          <p className="text-xs text-white/40 mt-1">Last 50 transactions</p>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-white/40 text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'credit'
                        ? 'bg-green-400/10 text-green-400'
                        : 'bg-red-400/10 text-red-400'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '−'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{tx.description}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {new Date(tx.createdAt).toLocaleDateString()} at{' '}
                      {new Date(tx.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      tx.type === 'credit' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '−'}${tx.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Balance: ${tx.balanceAfter.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top-up Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Add Funds to Wallet</h2>

            <div className="space-y-4">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Amount (USD)
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60">
                    $
                  </span>
                  <input
                    type="number"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    placeholder="100.00"
                    min="1"
                    step="0.01"
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/30"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTopupAmount(amount.toString())}
                    className="py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Cost Breakdown */}
              {topupAmount && (
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                  <p className="text-xs text-white/40 mb-2">COST BREAKDOWN</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Amount to add:</span>
                      <span className="text-white font-medium">${parseFloat(topupAmount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTopupModal(false)}
                  disabled={topupLoading}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopup}
                  disabled={topupLoading || !topupAmount}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {topupLoading ? 'Processing...' : 'Add to Wallet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
