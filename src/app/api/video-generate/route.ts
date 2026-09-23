import { NextRequest, NextResponse } from 'next/server';
import { VIDEO_MODELS } from '../../../lib/video/models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { modelId, prompt, imageUrl, duration, aspectRatio, userId } = body;

    if (!modelId || !prompt) {
      return NextResponse.json({ error: 'modelId and prompt are required' }, { status: 400 });
    }

    const model = VIDEO_MODELS.find((m) => m.id === modelId);
    if (!model) {
      return NextResponse.json({ error: 'Invalid model selected' }, { status: 400 });
    }

    let jobId: string;
    let provider: string = model.provider;

    // ─── FAL.AI MODELS ───────────────────────────────────────────
    
    if (model.provider === 'fal') {
      // Use KLING_API_KEY for Kling models, otherwise FAL_KEY
      const apiKey = process.env.FAL_KEY;
      if (!apiKey) return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 });

      // Choose correct model ID based on input type
      let falModelId = model.providerModelId;
      if (imageUrl && modelId === 'kling_3') {
        falModelId = 'fal-ai/kling-video/v2.1/standard/image-to-video';
      }
      if (imageUrl && modelId === 'pika_2_2') {
        falModelId = 'fal-ai/pika/v2.2/image-to-video';
      }

      const falPayload: Record<string, unknown> = {
        prompt,
        duration: String(duration || 5),
        aspect_ratio: aspectRatio || '16:9',
      };
      if (imageUrl) falPayload.image_url = imageUrl;

      const falRes = await fetch(`https://queue.fal.run/${falModelId}`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: falPayload }),
      });

      if (!falRes.ok) {
        const err = await falRes.text();
        return NextResponse.json({ error: `fal.ai error: ${err}` }, { status: 500 });
      }

      const falData = await falRes.json();
      jobId = falData.request_id;
    }

    // ─── GOOGLE VEO 3 ────────────────────────────────────────────
    else if (model.provider === 'gemini') {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/veo-003:predictLongRunning?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt }],
            parameters: {
              aspectRatio: aspectRatio || '16:9',
              durationSeconds: duration || 8,
            },
          }),
        }
      );

      if (!geminiRes.ok) {
        const err = await geminiRes.text();
        return NextResponse.json({ error: `Gemini error: ${err}` }, { status: 500 });
      }

      const geminiData = await geminiRes.json();
      jobId = geminiData.name; // operation name acts as job ID
    }

    // ─── RUNWAY GEN-4 ────────────────────────────────────────────
    else if (model.provider === 'runway') {
      const runwayKey = process.env.RUNWAY_API_KEY;
      if (!runwayKey) return NextResponse.json({ error: 'RUNWAY_API_KEY not configured' }, { status: 500 });

      const runwayPayload: Record<string, unknown> = {
        model: 'gen4_turbo',
        promptText: prompt,
        ratio: aspectRatio === '9:16' ? '720:1280' : aspectRatio === '1:1' ? '1280:1280' : '1280:720',
        duration: duration || 5,
      };
      if (imageUrl) runwayPayload.promptImage = imageUrl;

      const runwayRes = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${runwayKey}`,
          'Content-Type': 'application/json',
          'X-Runway-Version': '2024-11-06',
        },
        body: JSON.stringify(runwayPayload),
      });

      if (!runwayRes.ok) {
        const err = await runwayRes.text();
        return NextResponse.json({ error: `Runway error: ${err}` }, { status: 500 });
      }

      const runwayData = await runwayRes.json();
      jobId = runwayData.id;
    }

    // ─── JOGG AI ─────────────────────────────────────────────────
    else if (model.provider === 'jogg') {
      const joggKey = process.env.JOGG_AI_API_KEY;
      if (!joggKey) return NextResponse.json({ error: 'JOGG_AI_API_KEY not configured' }, { status: 500 });

      const { avatar_id, voice_id } = body;

      if (!avatar_id) {
        return NextResponse.json({ error: 'avatar_id is required for Jogg AI' }, { status: 400 });
      }

      const aspectRatioMap: Record<string, number> = {
        '16:9': 1,
        '9:16': 2,
        '1:1': 3,
      };

      const joggPayload = {
        avatar_id: parseInt(String(avatar_id), 10),
        script: prompt,
        aspect_ratio: aspectRatioMap[aspectRatio || '16:9'] || 1,
      };

      if (voice_id) {
        (joggPayload as Record<string, unknown>).voice_id = voice_id;
      }

      const joggRes = await fetch('https://api.jogg.ai/v1/create', {
        method: 'POST',
        headers: {
          'x-api-key': joggKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(joggPayload),
      });

      if (!joggRes.ok) {
        const errText = await joggRes.text();
        console.error(`Jogg AI error: ${joggRes.status} - ${errText}`);
        return NextResponse.json({
          error: `Jogg AI error: ${joggRes.status} - ${errText}`
        }, { status: 500 });
      }

      const joggData = await joggRes.json();
      jobId = joggData.data?.video_id;

      if (!jobId) {
        return NextResponse.json({
          error: 'No video_id returned from Jogg AI'
        }, { status: 500 });
      }
    }

    else {
      return NextResponse.json({ error: 'Provider not yet implemented' }, { status: 501 });
    }

    // ─── LOG TO SUPABASE ─────────────────────────────────────────
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && userId) {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/video_generations`, {
        method: 'POST',
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY || '',
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          model_id: modelId,
          provider,
          prompt,
          duration_seconds: duration,
          status: 'pending',
          job_id: jobId!,
        }),
      });
    }

    return NextResponse.json({ success: true, jobId: jobId!, provider });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json({ error: 'Video generation failed. Please try again.' }, { status: 500 });
  }
}