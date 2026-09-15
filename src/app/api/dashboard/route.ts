import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const profileId = searchParams.get('profile_id')

  if (!profileId) {
    return NextResponse.json({ error: 'profile_id is required' }, { status: 400 })
  }

  try {
    const res = await fetch(`http://127.0.0.1:8000/results/${profileId}`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Dashboard fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}