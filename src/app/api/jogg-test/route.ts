import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const joggKey = process.env.JOGG_AI_API_KEY;

    const response = {
      apiKeySet: !!joggKey,
      apiKeyLength: joggKey ? joggKey.length : 0,
      apiKeyPrefix: joggKey ? joggKey.substring(0, 8) : 'NOT SET',
      timestamp: new Date().toISOString(),
    };

    if (!joggKey) {
      return NextResponse.json({
        ...response,
        error: 'JOGG_AI_API_KEY is not set in environment variables',
      }, { status: 500 });
    }

    // Try to fetch avatars
    console.log('Testing Jogg API connection...');
    const res = await fetch('https://api.jogg.ai/v1/avatars', {
      method: 'GET',
      headers: {
        'x-api-key': joggKey,
        'Content-Type': 'application/json',
      },
    });

    const responseText = await res.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return NextResponse.json({
      ...response,
      joggApiStatus: res.status,
      joggApiStatusText: res.statusText,
      joggApiResponse: responseData,
      success: res.ok,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
