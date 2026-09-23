import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

fal.config({ credentials: process.env.FAL_KEY! });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  const provider = searchParams.get('provider');
  const falModelId = searchParams.get('falModelId');

  if (!jobId || !provider) {
    return NextResponse.json({ error: 'jobId and provider are required' }, { status: 400 });
  }

  try {
    // ─── FAL.AI STATUS ─────────────────────────────────────
    if (provider === 'fal' && falModelId) {
      const result = await fal.queue.status(falModelId, { request_id: jobId });

      if (result.status === 'COMPLETED') {
        const data = await fal.queue.result(falModelId, { request_id: jobId });
        const videoUrl = data?.data?.video?.url || data?.video?.url || null;
        return NextResponse.json({ status: 'completed', videoUrl });
      }

      if (result.status === 'FAILED') {
        return NextResponse.json({ status: 'failed', error: result.error || 'Generation failed' });
      }

      // pending, in_progress
      return NextResponse.json({ status: result.status === 'IN_PROGRESS' ? 'in_progress' : 'queued' });
    }

    // ─── RUNWAY STATUS ───────────────────────────────────────
    if (provider === 'runway') {
      const runwayKey = process.env.RUNWAY_API_KEY!;
      const res = await fetch(`https://api.dev.runwayml.com/v1/tasks/${jobId}`, {
        headers: { Authorization: `Bearer ${runwayKey}`, 'X-Runway-Version': '2024-11-06' },
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

    // ─── GEMINI VEO STATUS ─────────────────────────────────
    if (provider === 'gemini') {
      const geminiKey = process.env.GEMINI_API_KEY!;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${jobId}?key=${geminiKey}`);
      const data = await res.json();
      if (data.done) {
        const videoUri = data.response?.videos?.[0]?.video?.uri;
        return NextResponse.json({ status: 'completed', videoUrl: videoUri });
      }
      return NextResponse.json({ status: 'pending' });
    }

    // ─── JOGG AI STATUS ────────────────────────────────────
    if (provider === 'jogg') {
      const joggKey = process.env.JOGG_AI_API_KEY;
      if (!joggKey) {
        return NextResponse.json({ error: 'JOGG_AI_API_KEY not configured' }, { status: 500 });
      }
      const statusRes = await fetch(`https://api.jogg.ai/v1/video?video_id=${jobId}`, {
        headers: { 'x-api-key': joggKey, 'Content-Type': 'application/json' },
      });
      if (!statusRes.ok) {
        const errText = await statusRes.text();
        return NextResponse.json({ error: `Jogg AI status check failed: ${errText}` }, { status: 500 });
      }
      const statusData = await statusRes.json();
      const videoStatus = statusData.data?.status;
      const videoUrl = statusData.data?.video_url;
      if (videoStatus === 'completed') {
        return NextResponse.json({ status: 'completed', videoUrl });
      }
      if (videoStatus === 'failed' || videoStatus === 'error') {
        return NextResponse.json({ status: 'failed', error: statusData.data?.error || 'Video generation failed' });
      }
      return NextResponse.json({ status: 'pending', progress: statusData.data?.progress || 0 });
    }

    return NextResponse.json({ error: 'Unknown provider' }, { status: 400 });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 });
  }
}
