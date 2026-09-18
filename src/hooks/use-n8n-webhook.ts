import { useState, useCallback } from 'react'

export interface N8nWebhookPayload {
  model_id: string
  model_name: string
  prompt: string
  duration: number
  resolution: string
  avatar_id?: number
  avatar_name?: string
  user_id: string
  [key: string]: any
}

export interface N8nWebhookResponse {
  success: boolean
  video_url?: string
  job_id?: string
  message?: string
  error?: string
  status?: string
}

export interface UseN8nWebhookReturn {
  loading: boolean
  error: string | null
  response: N8nWebhookResponse | null
  triggerWebhook: (payload: N8nWebhookPayload) => Promise<N8nWebhookResponse | null>
  reset: () => void
}

const N8N_WEBHOOK_URL = 'https://n8n.srv972212.hstgr.cloud/webhook/generate-video'

/**
 * React hook to trigger n8n webhooks for video generation
 * Handles loading state, errors, and response management
 */
export function useN8nWebhook(): UseN8nWebhookReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<N8nWebhookResponse | null>(null)

  const triggerWebhook = useCallback(async (payload: N8nWebhookPayload): Promise<N8nWebhookResponse | null> => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      console.log('Triggering n8n webhook with payload:', payload)

      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Webhook failed: ${res.status} ${res.statusText} - ${errorText}`)
      }

      const data = await res.json() as N8nWebhookResponse

      console.log('Webhook response:', data)
      setResponse(data)
      setLoading(false)

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Webhook error:', errorMessage)
      setError(errorMessage)
      setLoading(false)
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setResponse(null)
  }, [])

  return {
    loading,
    error,
    response,
    triggerWebhook,
    reset,
  }
}
