import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key on server side for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Commission configuration (20% commission on top of API cost)
export const COMMISSION_RATE = 0.20

/**
 * Get or create wallet for user
 */
export async function getOrCreateWallet(userId: string) {
  // Check if wallet exists
  const { data: existingWallet, error: fetchError } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (existingWallet) {
    return existingWallet
  }

  // Create new wallet
  const { data: newWallet, error: createError } = await supabase
    .from('wallets')
    .insert([
      {
        user_id: userId,
        balance: 0,
        total_added: 0,
        total_spent: 0,
      },
    ])
    .select()
    .single()

  if (createError) throw createError
  return newWallet
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
  const { error: txError } = await supabase.from('transactions').insert([
    {
      user_id: userId,
      type: 'credit',
      amount,
      description,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
    },
  ])

  if (txError) throw txError

  // Update wallet
  const { data: updatedWallet, error: updateError } = await supabase
    .from('wallets')
    .update({
      balance: balanceAfter,
      total_added: wallet.total_added + amount,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (updateError) throw updateError
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
  const { error: txError } = await supabase.from('transactions').insert([
    {
      user_id: userId,
      type: 'debit',
      amount: totalCost,
      description: `Video generation - API: $${apiCost.toFixed(2)}, Commission: $${commission.toFixed(2)}`,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      video_gen_id: videoGenId,
    },
  ])

  if (txError) throw txError

  // Update wallet
  const { data: updatedWallet, error: updateError } = await supabase
    .from('wallets')
    .update({
      balance: balanceAfter,
      total_spent: wallet.total_spent + totalCost,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (updateError) throw updateError

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
export async function getWalletWithHistory(userId: string, limit: number = 50) {
  const wallet = await getOrCreateWallet(userId)

  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (txError) throw txError

  return {
    wallet,
    transactions: transactions || [],
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

  const { error: txError } = await supabase.from('transactions').insert([
    {
      user_id: userId,
      type: 'credit',
      amount,
      description: `Refund - ${reason}`,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
    },
  ])

  if (txError) throw txError

  const { data: updatedWallet, error: updateError } = await supabase
    .from('wallets')
    .update({
      balance: balanceAfter,
      total_added: wallet.total_added + amount,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (updateError) throw updateError
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
