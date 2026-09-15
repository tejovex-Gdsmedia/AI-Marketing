import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      company_name,
      brief,
      style,
      format,
      research_context,
      content_context,
    } = body

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    const GROQ_API_KEY = process.env.GROQ_API_KEY

    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        error: 'OpenAI API key not configured.',
      }, { status: 400 })
    }

    const styleDescriptions: Record<string, string> = {
      professional: 'clean corporate polished trustworthy modern business',
      bold: 'bold vibrant high contrast energetic eye-catching dynamic',
      minimal: 'minimalist whitespace simple elegant refined subtle',
      creative: 'artistic creative expressive unique visually interesting',
    }

    const formatContext: Record<string, string> = {
      social_post: 'square 1:1 social media post',
      linkedin_banner: 'wide landscape LinkedIn banner',
      instagram_story: 'vertical 9:16 Instagram story',
      blog_header: 'wide landscape blog header',
    }

    // ── Step 1: Use Groq to generate a detailed image prompt ─────────
    let detailedPrompt = brief

    if (GROQ_API_KEY) {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `You are an expert AI image prompt writer for marketing materials.

A user wants to generate a marketing image. Based on the information below, write a detailed, specific image generation prompt that will create a professional high-quality marketing image.

Company: ${company_name}
User's brief: ${brief}
Visual style: ${styleDescriptions[style] || style}
Image format: ${formatContext[format] || format}
Target audience: ${research_context?.audience || ''}
Value proposition: ${research_context?.value_proposition || ''}
Pain points they solve: ${research_context?.pain_points?.join(', ') || ''}
Brand voice: ${content_context?.brand_voice?.split('.')[0] || 'professional'}
Content pillars: ${content_context?.content_pillars?.join(', ') || ''}

Write a detailed image generation prompt that:
- Describes the exact visual composition, layout and design
- Specifies colors, typography style and visual elements
- Mentions specific people, objects or scenes relevant to this business
- Includes the mood, lighting and atmosphere
- Specifies any text or headlines that should appear in the image
- Makes it specific to this company and their industry
- Is optimized for ${formatContext[format] || 'social media'}

Return only the image prompt text. No explanation, no preamble, no quotes. Just the prompt.`
          }]
        })
      })

      if (groqRes.ok) {
        const groqData = await groqRes.json()
        const generatedPrompt = groqData.choices?.[0]?.message?.content?.trim()
        if (generatedPrompt) {
          detailedPrompt = generatedPrompt
          console.log('AI-enhanced prompt:', detailedPrompt)
        }
      }
    }

    // ── Step 2: Generate image with OpenAI using the enhanced prompt ──
    const sizeMap: Record<string, string> = {
      social_post: '1024x1024',
      linkedin_banner: '1536x1024',
      instagram_story: '1024x1536',
      blog_header: '1536x1024',
    }

    const size = sizeMap[format] || '1024x1024'

    console.log('Generating image with size:', size)

    const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: detailedPrompt,
        n: 1,
        size: size,
      }),
    })

    const openaiData = await openaiRes.json()
    console.log('OpenAI response status:', openaiRes.status)

    if (!openaiRes.ok) {
      console.error('OpenAI error:', openaiData)
      return NextResponse.json({
        error: `OpenAI error: ${openaiData.error?.message || 'Unknown error'}`,
        prompt: detailedPrompt,
      }, { status: 500 })
    }

    const imageData = openaiData.data?.[0]
    const imageUrl = imageData?.url ||
      (imageData?.b64_json ? `data:image/png;base64,${imageData.b64_json}` : null)

    if (!imageUrl) {
      return NextResponse.json({
        error: 'No image URL returned from OpenAI',
        prompt: detailedPrompt,
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      prompt: detailedPrompt,
      image_url: imageUrl,
    })

  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    )
  }
}