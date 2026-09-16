import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const joggKey = process.env.JOGG_AI_API_KEY;

    if (!joggKey) {
      console.error('JOGG_AI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'JOGG_AI_API_KEY not configured in environment' },
        { status: 500 }
      );
    }

    console.log('Fetching avatars from Jogg AI...');

    const res = await fetch('https://api.jogg.ai/v1/avatars', {
      method: 'GET',
      headers: {
        'x-api-key': joggKey,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Jogg API Response Status: ${res.status}`);

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Jogg API error: ${res.status} - ${errText}`);
      return NextResponse.json(
        { error: `Failed to fetch avatars: ${res.status} - ${errText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log('Avatars fetched successfully:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Avatar fetch error:', error);
    return NextResponse.json(
      { error: `Failed to fetch avatars: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
