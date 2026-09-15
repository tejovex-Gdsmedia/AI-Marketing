import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  const provider = searchParams.get('provider');
  const modelId = searchParams.get('modelId');

  if (!jobId || !provider) {
    return NextResponse.json({ error: 'jobId and provider are required' }, { status: 400 });
  }

  try {
    // ─── FAL.AI STATUS ───────────────────────────────────────────
    if (provider === 'fal') {
      const falKey = process.env.FAL_KEY!;

      // Get status
      const statusRes = await fetch(
        `https://queue.fal.run/${modelId}/requests/${jobId}/status`,
        { headers: { Authorization: `Key ${falKey}` } }
      );
      const statusData = await statusRes.json();

      if (statusData.status === 'COMPLETED') {
        // Get result
        const resultRes = await fetch(
          `https://queue.fal.run/${modelId}/requests/${jobId}`,
          { headers: { Authorization: `Key ${falKey}` } }
        );
        const resultData = await resultRes.json();
        const videoUrl = resultData?.video?.url || resultData?.videos?.[0]?.url || null;

        return NextResponse.json({ status: 'completed', videoUrl });
      }

      if (statusData.status === 'FAILED') {
        return NextResponse.json({ status: 'failed', error: statusData.error || 'Generation failed' });
      }

      return NextResponse.json({ status: 'pending', progress: statusData.logs?.length || 0 });
    }

    // ─── RUNWAY STATUS ───────────────────────────────────────────
    if (provider === 'runway') {
      const runwayKey = process.env.RUNWAY_API_KEY!;
      const res = await fetch(`https://api.dev.runwayml.com/v1/tasks/${jobId}`, {
        headers: {
          Authorization: `Bearer ${runwayKey}`,
          'X-Runway-Version': '2024-11-06',
        },
      });
      const data = await res.json();

      if (data.status === 'SUCCEEDED') {
        return NextResponse.json({ status: 'completed', videoUrl: data.output?.[0] });
      }
      if (data.status === 'FAILED') {
        return NextResponse.json({ status: 'failed', error: data.failure });
      }
      return NextResponse.json({ status: 'pending', progress: data.progressRatio || 0 });
    }

    // ─── GEMINI VEO STATUS ───────────────────────────────────────
    if (provider === 'gemini') {
      const geminiKey = process.env.GEMINI_API_KEY!;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${jobId}?key=${geminiKey}`
      );
      const data = await res.json();

      if (data.done) {
        const videoUri = data.response?.videos?.[0]?.video?.uri;
        return NextResponse.json({ status: 'completed', videoUrl: videoUri });
      }
      return NextResponse.json({ status: 'pending' });
    }

    return NextResponse.json({ error: 'Unknown provider' }, { status: 400 });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 });
  }
}