import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      company_name,
      brief,
      video_type,
      research_context,
      content_context,
    } = body

    // ── Build video concept prompt ────────────────────────────────────────
    const videoTypeDetails: Record<string, { duration: string; format: string; style: string }> = {
      instagram_reel: { duration: '15-30 seconds', format: 'Vertical 9:16', style: 'Fast-paced, trendy, hooky' },
      youtube_short: { duration: '30-60 seconds', format: 'Vertical 9:16', style: 'Engaging, informative, retain viewer' },
      linkedin_video: { duration: '30-90 seconds', format: 'Landscape 16:9', style: 'Professional, thought-leadership, value-driven' },
      brand_ad: { duration: '15-60 seconds', format: 'Any format', style: 'Emotional storytelling, brand awareness' },
    }

    const typeInfo = videoTypeDetails[video_type] || videoTypeDetails['instagram_reel']

    const prompt = `
You are an expert video scriptwriter and creative director for marketing videos.

Create a detailed video concept for the following:

Company: ${company_name}
Video Brief: ${brief}
Video Type: ${video_type.replace(/_/g, ' ')}
Duration: ${typeInfo.duration}
Format: ${typeInfo.format}
Style: ${typeInfo.style}

Target Audience: ${research_context?.audience || 'general audience'}
Key Pain Points: ${research_context?.pain_points?.join(', ') || ''}
Value Proposition: ${research_context?.value_proposition || ''}
Brand Voice: ${content_context?.brand_voice || 'professional'}
Content Pillars: ${content_context?.content_pillars?.join(', ') || ''}

Return a JSON object with exactly these keys:
{
  "hook": "The opening line or visual that grabs attention in the first 3 seconds",
  "script": "The full narration/voiceover script for the video",
  "visual_directions": [
    "Scene 1: specific visual description",
    "Scene 2: specific visual description",
    "Scene 3: specific visual description",
    "Scene 4: specific visual description"
  ],
  "duration": "${typeInfo.duration}",
  "audio_suggestion": "Specific music style and mood recommendation",
  "cta": "The exact call-to-action at the end of the video"
}

Make everything specific to ${company_name} and their audience. No generic templates.
Return only valid JSON. No explanation, no markdown.
`

    // ── Call Groq API ─────────────────────────────────────────────────────
    const GROQ_API_KEY = process.env.GROQ_API_KEY

    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured in .env.local' },
        { status: 400 }
      )
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!groqRes.ok) {
      const errorText = await groqRes.text()
      return NextResponse.json(
        { error: `Groq API error: ${groqRes.status} — ${errorText}` },
        { status: 500 }
      )
    }

    const groqData = await groqRes.json()
    const raw = groqData.choices?.[0]?.message?.content?.trim() || ''

    // ── Parse JSON response ───────────────────────────────────────────────
    let result
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim()
      result = JSON.parse(cleaned)
    } catch {
      result = { raw_output: raw }
    }

    return NextResponse.json({ success: true, result })

  } catch (error) {
    console.error('Video concept generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate video concept. Please try again.' },
      { status: 500 }
    )
  }
}