import { NextRequest, NextResponse } from 'next/server'
import { deductWalletForVideo, calculateTotalCost } from '@/lib/wallet/wallet-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, apiCost, videoGenId } = body

    if (!userId || apiCost === undefined || !videoGenId) {
      return NextResponse.json(
        { error: 'userId, apiCost, and videoGenId are required' },
        { status: 400 }
      )
    }

    if (apiCost < 0) {
      return NextResponse.json(
        { error: 'apiCost must be positive' },
        { status: 400 }
      )
    }

    const result = await deductWalletForVideo(userId, apiCost, videoGenId)

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          required: result.required,
          available: result.available,
        },
        { status: 402 } // 402 Payment Required
      )
    }

    return NextResponse.json({
      success: true,
      wallet: {
        balance: parseFloat(result.wallet.balance.toFixed(2)),
        totalSpent: parseFloat(result.wallet.totalSpent.toFixed(2)),
      },
      breakdown: {
        apiCost: parseFloat(result.breakdown.apiCost.toFixed(2)),
        commission: parseFloat(result.breakdown.commission.toFixed(2)),
        totalCost: parseFloat(result.breakdown.totalCost.toFixed(2)),
      },
    })
  } catch (error) {
    console.error('Wallet deduction error:', error)
    return NextResponse.json(
      { error: 'Failed to deduct from wallet' },
      { status: 500 }
    )
  }
}
