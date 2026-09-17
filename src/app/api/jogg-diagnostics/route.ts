import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const joggKey = process.env.JOGG_AI_API_KEY

    // Check 1: API Key existence
    const apiKeyCheck = {
      isSet: !!joggKey,
      length: joggKey ? joggKey.length : 0,
      prefix: joggKey ? joggKey.substring(0, 8) : 'NOT SET',
    }

    if (!joggKey) {
      return NextResponse.json({
        status: 'error',
        message: 'JOGG_AI_API_KEY is not configured in environment variables',
        apiKeyCheck,
      }, { status: 500 })
    }

    // Check 2: Try to fetch avatars
    console.log('Testing Jogg API with endpoint: https://api.jogg.ai/v1/avatars')

    const avatarRes = await fetch('https://api.jogg.ai/v1/avatars', {
      method: 'GET',
      headers: {
        'x-api-key': joggKey,
        'Content-Type': 'application/json',
      },
    })

    const avatarText = await avatarRes.text()
    let avatarData
    try {
      avatarData = JSON.parse(avatarText)
    } catch {
      avatarData = avatarText
    }

    return NextResponse.json({
      status: avatarRes.ok ? 'success' : 'error',
      apiKeyCheck,
      avatarFetch: {
        status: avatarRes.status,
        statusText: avatarRes.statusText,
        headers: {
          'content-type': avatarRes.headers.get('content-type'),
        },
        response: avatarData,
      },
      timestamp: new Date().toISOString(),
      suggestions: !avatarRes.ok ? [
        'Check if JOGG_AI_API_KEY is valid',
        'Verify the API key has not expired',
        'Ensure the endpoint https://api.jogg.ai/v1/avatars is correct',
        'Check if Jogg AI service is operational',
        'Verify network connectivity to api.jogg.ai',
      ] : [],
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error instanceof Error ? error.toString() : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
