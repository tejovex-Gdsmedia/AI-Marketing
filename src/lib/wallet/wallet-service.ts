import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Commission configuration (20% commission on top of API cost)
export const COMMISSION_RATE = 0.20

/**
 * Get or create wallet for user
 */
export async function getOrCreateWallet(userId: string) {
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
  })

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        userId,
        balance: 0,
        totalAdded: 0,
        totalSpent: 0,
      },
    })
  }

  return wallet
}

/**
 * Add credit to wallet
 */
export async function addWalletCredit(
  userId: string,
  amount: number,
  description: string = 'Wallet top-up'
) {
  const wallet = await getOrCreateWallet(userId)

  const balanceBefore = wallet.balance
  const balanceAfter = balanceBefore + amount

  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId,
      type: 'credit',
      amount,
      description,
      balanceBefore,
      balanceAfter,
    },
  })

  // Update wallet
  const updatedWallet = await prisma.wallet.update({
    where: { userId },
    data: {
      balance: balanceAfter,
      totalAdded: wallet.totalAdded + amount,
    },
  })

  return updatedWallet
}

/**
 * Deduct from wallet for video generation
 */
export async function deductWalletForVideo(
  userId: string,
  apiCost: number,
  videoGenId: string
) {
  const wallet = await getOrCreateWallet(userId)
  const commission = apiCost * COMMISSION_RATE
  const totalCost = apiCost + commission

  // Check if user has sufficient balance
  if (wallet.balance < totalCost) {
    return {
      success: false,
      error: `Insufficient wallet balance. Required: $${totalCost.toFixed(2)}, Available: $${wallet.balance.toFixed(2)}`,
      required: totalCost,
      available: wallet.balance,
    }
  }

  const balanceBefore = wallet.balance
  const balanceAfter = balanceBefore - totalCost

  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId,
      type: 'debit',
      amount: totalCost,
      description: `Video generation - API: $${apiCost.toFixed(2)}, Commission: $${commission.toFixed(2)}`,
      balanceBefore,
      balanceAfter,
      videoGenId,
    },
  })

  // Update wallet
  const updatedWallet = await prisma.wallet.update({
    where: { userId },
    data: {
      balance: balanceAfter,
      totalSpent: wallet.totalSpent + totalCost,
    },
  })

  return {
    success: true,
    wallet: updatedWallet,
    breakdown: {
      apiCost,
      commission,
      totalCost,
    },
  }
}

/**
 * Get wallet with transaction history
 */
export async function getWalletWithHistory(userId: string, limit: number = 20) {
  const wallet = await getOrCreateWallet(userId)
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return {
    wallet,
    transactions,
  }
}

/**
 * Refund wallet (in case of failed generation)
 */
export async function refundWallet(
  userId: string,
  amount: number,
  reason: string = 'Refund'
) {
  const wallet = await getOrCreateWallet(userId)
  const balanceBefore = wallet.balance
  const balanceAfter = balanceBefore + amount

  await prisma.transaction.create({
    data: {
      userId,
      type: 'credit',
      amount,
      description: `Refund - ${reason}`,
      balanceBefore,
      balanceAfter,
    },
  })

  const updatedWallet = await prisma.wallet.update({
    where: { userId },
    data: {
      balance: balanceAfter,
      totalAdded: wallet.totalAdded + amount,
    },
  })

  return updatedWallet
}

/**
 * Calculate total cost with commission
 */
export function calculateTotalCost(apiCost: number): {
  apiCost: number
  commission: number
  totalCost: number
  commissionRate: string
} {
  const commission = apiCost * COMMISSION_RATE
  const totalCost = apiCost + commission

  return {
    apiCost,
    commission,
    totalCost,
    commissionRate: `${(COMMISSION_RATE * 100).toFixed(0)}%`,
  }
}
