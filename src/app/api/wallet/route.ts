import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateWallet, addWalletCredit, getWalletWithHistory } from '@/lib/wallet/wallet-service'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const { wallet, transactions } = await getWalletWithHistory(userId, 50)

    return NextResponse.json({
      wallet: {
        balance: parseFloat(wallet.balance.toFixed(2)),
        totalAdded: parseFloat(wallet.totalAdded.toFixed(2)),
        totalSpent: parseFloat(wallet.totalSpent.toFixed(2)),
      },
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: parseFloat(t.amount.toFixed(2)),
        description: t.description,
        balanceBefore: parseFloat(t.balanceBefore.toFixed(2)),
        balanceAfter: parseFloat(t.balanceAfter.toFixed(2)),
        createdAt: t.createdAt,
      })),
    })
  } catch (error) {
    console.error('Wallet fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wallet' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount, description } = body

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'userId and positive amount are required' },
        { status: 400 }
      )
    }

    const wallet = await addWalletCredit(
      userId,
      amount,
      description || 'Wallet top-up'
    )

    return NextResponse.json({
      success: true,
      wallet: {
        balance: parseFloat(wallet.balance.toFixed(2)),
        totalAdded: parseFloat(wallet.totalAdded.toFixed(2)),
        totalSpent: parseFloat(wallet.totalSpent.toFixed(2)),
      },
    })
  } catch (error) {
    console.error('Wallet credit error:', error)
    return NextResponse.json(
      { error: 'Failed to add credit to wallet' },
      { status: 500 }
    )
  }
}
