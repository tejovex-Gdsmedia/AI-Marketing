import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { deductWalletForVideo, calculateTotalCost, COMMISSION_RATE } from '@/lib/wallet/wallet-service'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      modelId,
      modelName,
      prompt,
      duration,
      apiCost,
      imageUrl,
      aspectRatio,
      avatar_id,
    } = body

    if (!userId || !modelId || !prompt || apiCost === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate costs
    const costBreakdown = calculateTotalCost(apiCost)
    const { totalCost } = costBreakdown

    // Create video generation record first
    const videoGen = await prisma.videoGeneration.create({
      data: {
        userId,
        modelId,
        modelName,
        prompt,
        duration: duration || 5,
        apiCost,
        commission: costBreakdown.commission,
        totalCost,
        status: 'pending',
      },
    })

    // Check and deduct from wallet
    const walletResult = await deductWalletForVideo(userId, apiCost, videoGen.id)

    if (!walletResult.success) {
      // Update video generation status to failed
      await prisma.videoGeneration.update({
        where: { id: videoGen.id },
        data: { status: 'failed' },
      })

      return NextResponse.json(
        {
          error: walletResult.error,
          required: walletResult.required,
          available: walletResult.available,
        },
        { status: 402 } // Payment Required
      )
    }

    // Continue with actual video generation (placeholder - implement with your API)
    // This is where you would call Fal, Runway, or other video generation API

    return NextResponse.json({
      success: true,
      videoGenId: videoGen.id,
      message: 'Video generation started',
      costs: {
        apiCost: parseFloat(apiCost.toFixed(2)),
        commission: parseFloat(costBreakdown.commission.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
      },
      wallet: {
        balance: parseFloat(walletResult.wallet.balance.toFixed(2)),
        totalSpent: parseFloat(walletResult.wallet.totalSpent.toFixed(2)),
      },
    })
  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json(
      { error: 'Failed to start video generation' },
      { status: 500 }
    )
  }
}
