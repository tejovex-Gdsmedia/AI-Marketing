import { NextResponse } from 'next/server'

// ── Model categories for prompt style ─────────────────────────────────────
const MODEL_STYLES: Record<string, { category: string; instructions: string }> = {
  'kling-3.0': {
    category: 'visual',
    instructions: 'Cinematic visual description only. Include: shot type (aerial/tracking/close-up), camera movement (slow zoom/pan/dolly), lighting (golden hour/neon/studio), color grade, and key action. NO dialogue or narration.',
  },
  'runway-gen4': {
    category: 'visual',
    instructions: 'Film-quality visual prompt. Include: lens type (anamorphic/35mm), shot composition, depth of field, color palette, mood, and motion. Professional cinematography style.',
  },
  'wan-2.7': {
    category: 'visual',
    instructions: 'Motion-focused artistic description. Emphasize fluid motion, particle effects, smooth transitions, and dynamic energy. Abstract or realistic both work.',
  },
  'hailuo-2.3': {
    category: 'visual',
    instructions: 'High-energy dynamic prompt. Focus on fast action, impact moments, speed, and realism. Short punchy description.',
  },
  'pika-2.2': {
    category: 'visual',
    instructions: 'Ultra-concise stylized prompt. Max 2 sentences. Visual style + key action + mood. No extra details.',
  },
  'seedance-2.0': {
    category: 'visual',
    instructions: 'Director-level cinematic brief. Specify: camera angle, movement speed, depth of field, time of day, and professional lighting setup.',
  },
  'minimax-h3': {
    category: 'visual',
    instructions: 'Ultra-detailed 2K visual specification. Describe textures, spatial composition, photorealistic details, and precise lighting.',
  },
  'luma-ray3': {
    category: 'visual',
    instructions: 'HDR cinematic loop-ready prompt. Focus on seamless motion, atmospheric lighting, depth, and keyframe moments.',
  },
  'veo3': {
    category: 'audio_visual',
    instructions: 'Dialogue + audio scene. Include: character dialogue in quotes, [SOUND: description] tags for sound effects, ambient environment audio, and visual scene. Veo 3 generates native audio.',
  },
  'veo3-fast': {
    category: 'audio_visual',
    instructions: 'Dialogue + audio scene. Include: character dialogue in quotes, [SOUND: description] tags, ambient sounds. Keep it concise.',
  },
  'jogg-ai': {
    category: 'script',
    instructions: 'Natural conversational speaking script only. Write exactly what the avatar will say. Warm, engaging tone. No stage directions or visual descriptions.',
  },
}

const DEFAULT_STYLE = {
  category: 'visual',
  instructions: 'Detailed visual description with camera movement, lighting, mood, and key action. Professional video prompt style.',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      company_name,
      brief,
      video_type,
      model_id,
      research_context,
      content_context,
    } = body

    const GROQ_API_KEY = process.env.GROQ_API_KEY
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured' },
        { status: 400 }
      )
    }

    const modelStyle = MODEL_STYLES[model_id] || DEFAULT_STYLE
    const isScript = modelStyle.category === 'script'
    const isAudioVisual = modelStyle.category === 'audio_visual'

    // ── Build enhanced prompt ─────────────────────────────────────────────
    const systemPrompt = `You are an expert AI video prompt engineer and creative director.
Your job is to generate optimized prompts for AI video generation models.
You understand exactly what each model needs to produce the best output.
Always return valid JSON only. No markdown, no explanation.`

    const userPrompt = `
Generate video content for:

Company: ${company_name}
Brief: ${brief}
Video Type: ${video_type?.replace(/_/g, ' ') || 'brand ad'}
Target Audience: ${research_context?.audience || 'general audience'}
Pain Points: ${research_context?.pain_points?.join(', ') || ''}
Value Proposition: ${research_context?.value_proposition || ''}
Brand Voice: ${content_context?.brand_voice || 'professional and engaging'}

SELECTED MODEL: ${model_id || 'general'}
PROMPT STYLE REQUIRED: ${modelStyle.instructions}

Return this JSON:
{
  "video_prompts": [
    "VARIATION 1: ${modelStyle.instructions} — specific to ${company_name}",
    "VARIATION 2: Different angle/approach — same model style",
    "VARIATION 3: Most creative version — same model style"
  ],
  "hook": "Attention-grabbing opening (first 3 seconds)",
  "script": "Full voiceover/narration script (for reference only)",
  "visual_directions": [
    "Scene 1: visual description",
    "Scene 2: visual description",
    "Scene 3: visual description"
  ],
  "audio_suggestion": "Music style and mood",
  "cta": "Call to action text",
  "duration": "Recommended duration"
}

CRITICAL: 
- video_prompts must follow the PROMPT STYLE REQUIRED above exactly
- ${isScript ? 'All 3 variations should be natural speaking scripts' : ''}
- ${isAudioVisual ? 'All 3 variations must include dialogue and [SOUND:] tags' : ''}
- ${!isScript && !isAudioVisual ? 'NO dialogue or narration in video_prompts — visual descriptions only' : ''}
- Make everything specific to ${company_name}, NOT generic
- Return only valid JSON
`

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        max_tokens: 2000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
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
      { error: 'Failed to generate video concept.' },
      { status: 500 }
    )
  }
}