import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Get logged in user
    const { data: { user } } = await supabase.auth.getUser()

    const errors: string[] = []
    if (!body.company_name?.trim()) errors.push('company_name is required')
    if (!body.website_url?.trim()) errors.push('website_url is required')
    if (!body.industry) errors.push('industry is required')

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 })
    }

    const fastapiRes = await fetch('http://127.0.0.1:8000/onboarding/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        active_platforms: body.platforms || [],
        competitor_urls: (body.competitor_urls || []).filter((url: string) => url.trim() !== ''),
        user_id: user?.id || null,
      }),
    })

    const result = await fastapiRes.json()

    const response = NextResponse.json({
      success: true,
      profile_id: result.profile_id,
      message: result.message
    })

    return response

  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: 'Failed to submit onboarding' }, { status: 500 })
  }
}