import { useState, useCallback } from 'react'

export interface VideoGenerationState {
  videoId: string | null
  status: 'idle' | 'generating' | 'processing' | 'completed' | 'failed'
  videoUrl: string | null
  error: string | null
  progress: number // 0-100
  elapsedSeconds: number
}

export interface UseJoggVideoGenerationReturn extends VideoGenerationState {
  generateVideo: (params: GenerateVideoParams) => Promise<void>
  reset: () => void
}

export interface GenerateVideoParams {
  avatarId: number // Must be integer
  script: string
  voiceId?: string
}

const N8N_WEBHOOK_URL = 'https://n8n.srv972212.hstgr.cloud/webhook/generate-video'
const MAX_POLL_ATTEMPTS = 72 // 6 minutes at 5 second intervals
const POLL_INTERVAL = 5000 // 5 seconds

/**
 * React hook for Jogg AI video generation via n8n webhook
 * Handles: generate -> poll status -> show video
 */
export function useJoggVideoGeneration(): UseJoggVideoGenerationReturn {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [status, setStatus] = useState<VideoGenerationState['status']>('idle')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const generateVideo = useCallback(async (params: GenerateVideoParams) => {
    setStatus('generating')
    setError(null)
    setVideoUrl(null)
    setProgress(0)
    setElapsedSeconds(0)

    try {
      if (!params.avatarId || typeof params.avatarId !== 'number') {
        throw new Error('Avatar ID must be a number')
      }

      if (!params.script.trim()) {
        throw new Error('Script cannot be empty')
      }

      // Step 1: Generate Video
      console.log('Step 1: Sending generation request to n8n...')

      const generatePayload = {
        action: 'generate',
        avatar_id: params.avatarId, // Must be integer
        voice_id: params.voiceId || 'MFZUKuGQUsGJPQjTS4wC',
        script: params.script.trim(),
        video_name: 'Tejovex_' + Date.now(),
      }

      console.log('Generate payload:', generatePayload)

      const generateRes = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatePayload),
      })

      if (!generateRes.ok) {
        const errText = await generateRes.text()
        throw new Error(`Generation failed: ${generateRes.status} - ${errText}`)
      }

      const generateData = await generateRes.json()
      console.log('Generation response:', generateData)

      if (!generateData.video_id) {
        throw new Error('No video_id in response')
      }

      setVideoId(generateData.video_id)
      setStatus('processing')
      setProgress(10)

      // Step 2: Poll Status Every 5 Seconds
      console.log('Step 2: Starting status polling...')
      let attempts = 0
      let startTime = Date.now()

      const pollStatus = async (): Promise<boolean> => {
        attempts++
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setElapsedSeconds(elapsed)
        setProgress(Math.min(10 + (attempts / MAX_POLL_ATTEMPTS) * 80, 90))

        console.log(`Poll attempt ${attempts}/${MAX_POLL_ATTEMPTS}`)

        try {
          const statusPayload = {
            action: 'check_status',
            video_id: generateData.video_id,
          }

          const statusRes = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(statusPayload),
          })

          if (!statusRes.ok) {
            throw new Error(`Status check failed: ${statusRes.status}`)
          }

          const statusData = await statusRes.json()
          console.log(`Status: ${statusData.status}`, statusData)

          if (statusData.status === 'completed') {
            if (statusData.video_url) {
              setVideoUrl(statusData.video_url)
              setStatus('completed')
              setProgress(100)
              console.log('Video generation completed!')
              return true
            } else {
              throw new Error('Video completed but no URL provided')
            }
          } else if (statusData.status === 'failed') {
            throw new Error(statusData.error || 'Video generation failed')
          }

          // Still processing
          if (attempts >= MAX_POLL_ATTEMPTS) {
            throw new Error('Video generation timeout (6 minutes)')
          }

          return false
        } catch (err) {
          console.error('Poll error:', err)
          throw err
        }
      }

      // Poll until complete or failed
      let isComplete = false
      while (!isComplete && attempts < MAX_POLL_ATTEMPTS) {
        isComplete = await pollStatus()
        if (!isComplete) {
          await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL))
        }
      }

      if (!isComplete) {
        throw new Error('Video generation timeout')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('Video generation error:', message)
      setError(message)
      setStatus('failed')
    }
  }, [])

  const reset = useCallback(() => {
    setVideoId(null)
    setStatus('idle')
    setVideoUrl(null)
    setError(null)
    setProgress(0)
    setElapsedSeconds(0)
  }, [])

  return {
    videoId,
    status,
    videoUrl,
    error,
    progress,
    elapsedSeconds,
    generateVideo,
    reset,
  }
}
