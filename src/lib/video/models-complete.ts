// Complete video model specifications with all duration, resolution, and aspect ratio options
// Updated: 2026-09-17

export type VideoType = 'avatar' | 'text_to_video' | 'image_to_video'
export type ApiProvider = 'fal' | 'gemini' | 'runway' | 'luma' | 'alibaba' | 'bytedance' | 'pika' | 'stability' | 'jogg'

export interface VideoModel {
  id: string
  name: string
  company: string
  provider: ApiProvider
  providerModelId: string
  tier: 'premium' | 'standard' | 'budget'

  // Type support
  types: VideoType[]
  supportsT2V: boolean
  supportsI2V: boolean

  // Pricing
  pricePerSecond?: number
  pricePerVideo?: number

  // Duration
  minDuration?: number
  defaultDuration: number
  durationOptions: number[] // Fixed options only
  maxDuration: number
  durationByResolution?: Record<string, number[]> // For models like Hailuo where duration depends on resolution
  durationByMode?: Record<string, number[]> // For models like Wan where T2V vs I2V have different max
  isFrameBased?: boolean // For SVD - frame count not seconds

  // Resolution & Aspect
  resolutions: string[]
  defaultResolution?: string
  aspectRatios: string[]

  // Features
  nativeAudio: boolean
  extendable: boolean
  specialFeatures?: string[] // e.g., "multi-shot", "loop-mode", "hdr", "keyframes"

  // UI/UX hints
  durationInputType?: 'dropdown' | 'slider' | 'fixed' // dropdown = required select, fixed = cannot change
  requiresImage?: boolean // For I2V-only models like SVD

  description: string
  badge?: string
}

export const VIDEO_MODELS: VideoModel[] = [
  // ─── KLING 3.0 ───
  {
    id: 'kling-3.0',
    name: 'Kling 3.0',
    company: 'Kuaishou',
    provider: 'fal',
    providerModelId: 'fal-ai/kling-video/v2.1/standard/text-to-video',
    tier: 'premium',
    types: ['text_to_video', 'image_to_video'],
    supportsT2V: true,
    supportsI2V: true,
    pricePerSecond: 0.10,
    minDuration: 5,
    defaultDuration: 5,
    durationOptions: [5, 10, 15],
    maxDuration: 15,
    resolutions: ['720p', '1080p', '4K'],
    defaultResolution: '1080p',
    aspectRatios: ['16:9', '9:16', '1:1'],
    nativeAudio: true,
    extendable: true,
    specialFeatures: ['multi-shot (up to 6 shots)', 'total duration cannot exceed 15s'],
    description: 'Advanced motion and realistic physics',
    badge: 'Latest',
  },

  // ─── VEO 3 FAST ───
  {
    id: 'veo-3-fast',
    name: 'Veo 3 Fast',
    company: 'Google',
    provider: 'gemini',
    providerModelId: 'veo-003',
    tier: 'premium',
    types: ['text_to_video', 'image_to_video'],
    supportsT2V: true,
    supportsI2V: true,
    pricePerSecond: 0.15,
    defaultDuration: 8,
    durationOptions: [4, 6, 8],
    maxDuration: 8,
    resolutions: ['720p', '1080p'],
    defaultResolution: '1080p',
    aspectRatios: ['16:9', '9:16'],
    nativeAudio: true,
    extendable: true,
    specialFeatures: ['Veo 3.1 Extend up to 148s'],
    durationInputType: 'dropdown',
    description: 'Fast cinematic video generation',
    badge: 'Fast',
  },

  // ─── RUNWAY GEN-4 TURBO ───
  {
    id: 'runway-gen-4-turbo',
    name: 'Runway Gen-4 Turbo',
    company: 'Runway',
    provider: 'runway',
    providerModelId: 'gen4_turbo',
    tier: 'premium',
    types: ['text_to_video', 'image_to_video'],
    supportsT2V: true,
    supportsI2V: true,
    pricePerSecond: 0.05,
    minDuration: 2,
    defaultDuration: 5,
    durationOptions: [5, 10],
    maxDuration: 10,
    resolutions: ['720p'],
    defaultResolution: '720p',
    aspectRatios: ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9'],
    nativeAudio: false,
    extendable: true,
    specialFeatures: ['start/end frame control', '21:9 aspect ratio unique to this model'],
    description: 'Turbo mode for faster generation',
    badge: 'Turbo',
  },

  // ─── LUMA RAY 2 ───
  {
    id: 'luma-ray-2',
    name: 'Luma Ray 2',
    company: 'Luma AI',
    provider: 'luma',
    providerModelId: 'luma-ray-2',
    tier: 'standard',
    types: ['text_to_video', 'image_to_video'],
    supportsT2V: true,
    supportsI2V: true,
    defaultDuration: 5,
    durationOptions: [5, 9],
    maxDuration: 9,
    resolutions: ['540p', '720p', '1080p', '4K'],
    defaultResolution: '1080p',
    aspectRatios: ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9', '9:21'],
    nativeAudio: false,
    extendable: true,
    specialFeatures: ['loop mode', 'keyframe control (start & end frame)', 'extendable up to 30s'],
    description: 'High-quality video with loop and keyframe support',
  },

  // ─── LUMA RAY 3 (Ray 3.2) ───
  {
    id: 'luma-ray-3',
    name: 'Luma Ray 3',
    company: 'Luma AI',
    provider: 'luma',
    providerModelId: 'luma-ray-3.2',
    tier: 'premium',
    types: ['text_to_video', 'image_to_video'],
    supportsT2V: true,
    supportsI2V: true,
    pricePerVideo: 0.35,
    defaultDuration: 5,
    durationOptions: [5, 10],
    maxDuration: 10,
    resolutions: ['360p', '540p', '720p', '1080p'],
    defaultResolution: '1080p',
    aspectRatios: ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9'],
    nativeAudio: false,
    extendable: true,
    specialFeatures: ['loop mode', 'HDR output', 'up to 16 keyframes per clip', 'professional production workflows'],
    description: 'Latest Luma model for professional production',
    badge: 'Pro',
  },

  // ─── HAILUO 2.3 ───
  {
    id: 'hailuo-2.3',
    name: 'Hailuo 2.3',
    company: 'MiniMax',
    provider: 'fal',
    providerModelId: 'fal-ai/minimax/video-01',
    tier: 'standard',
    types: ['image_to_video'],
    supportsT2V: false,
    supportsI2V: true,
    requiresImage: true,
    pricePerSecond: 0.08,
    defaultDuration: 6,
    durationOptions: [6],
    maxDuration: 10,
    durationByResolution: {
      '768p': [6],
      '1080p': [6, 10],
    },
    resolutions: ['768p', '1080p'],
    defaultResolution: '768p',
    aspectRatios: ['16:9', '9:16'],
    nativeAudio: false,
    extendable: false,
    specialFeatures: [
      'IMAGE-TO-VIDEO ONLY - No T2V support',
      'duration options change by resolution',
      'camera commands: Pan left, Push in, Static shot, etc.',
    ],
    description: 'Image-to-video only. Duration options depend on resolution.',
  },

  // ─── SEEDANCE 1.0 ───
  {
    id: 'seedance-1.0',
    name: 'Seedance 1.0',
    company: 'ByteDance',
    provider: 'bytedance',
    providerModelId: 'fal-ai/bytedance/seedance-v1',
    tier: 'standard',
    types: ['text_to_video', 'image_to_video'],
    supportsT2V: true,
    supportsI2V: true,
    defaultDuration: 5,
    durationOptions: [5, 10],
    maxDuration: 10,
    resolutions: ['1080p'],
    defaultResolution: '1080p',
    aspectRatios: ['16:9', '9:16', '1:1'],
    nativeAudio: false,
    extendable: true,
    description: 'Standard Seedance model with 1080p output',
  },

  // ─── SEEDANCE 2.0 ───
  {
    id: 'seedance-2.0',
    name: 'Seedance 2.0',
    company: 'ByteDance',
    provider: 'bytedance',
    providerModelId: 'fal-ai/bytedance/seedance-v2',
    tier: 'premium',
    types: ['text_to_video', 'image_to_video'],
    supportsT2V: true,
    supportsI2V: true,
    pricePerSecond: 0.056,
    defaultDuration: 10,
    durationOptions: [5, 10, 15],
    maxDuration: 15,
    resolutions: ['2K'],
    defaultResolution: '2K',
    aspectRatios: ['16:9', '9:16', '1:1'],
    nativeAudio: true,
    extendable: true,
    specialFeatures: ['multi-shot support', '2K resolution', 'native audio'],
    description: 'Pro version with 2K output and native audio',
    badge: 'Pro',
  },

  // ─── WAN 2.7 ───
  {
    id: 'wan-2.7',
    name: 'Wan 2.7',
    company: 'Alibaba',
    provider: 'alibaba',
    providerModelId: 'fal-ai/wan-2.7',
    tier: 'standard',
    types: ['text_to_video', 'image_to_video'],
    supportsT2V: true,
    supportsI2V: true,
    pricePerSecond: 0.10,
    defaultDuration: 5,
    durationOptions: [5, 10],
    durationByMode: {
      't2v': [5],
      'i2v': [5, 10],
    },
    maxDuration: 10,
    resolutions: ['720p'],
    defaultResolution: '720p',
    aspectRatios: ['16:9', '9:16', '1:1'],
    nativeAudio: false,
    extendable: true,
    specialFeatures: [
      'T2V max: 5s only',
      'I2V max: 10s',
      'infinite chaining available',
      'most cost-efficient model',
      'also supports r2v (reference-to-video)',
    ],
    description: 'Most cost-efficient. Duration changes by T2V/I2V mode.',
  },

  // ─── PIKA 2.2 ───
  {
    id: 'pika-2.2',
    name: 'Pika 2.2',
    company: 'Pika Labs',
    provider: 'pika',
    providerModelId: 'pika-2.2',
    tier: 'standard',
    types: ['text_to_video', 'image_to_video'],
    supportsT2V: true,
    supportsI2V: true,
    pricePerSecond: 0.08,
    defaultDuration: 5,
    durationOptions: [3, 5, 8, 10],
    maxDuration: 10,
    resolutions: ['720p', '1080p'],
    defaultResolution: '1080p',
    aspectRatios: ['16:9', '9:16', '1:1'],
    nativeAudio: false,
    extendable: true,
    specialFeatures: [
      'keyframe mode: up to 5 keyframes',
      'Pikaffects: melt, inflate, explode, deflate, crush, etc.',
      'Pikadditions: add elements',
      'Pikaswaps: swap elements',
      'extend max 15s total (3+4+4+4)',
      'keyframe transitions max 25s total',
    ],
    description: 'Flexible with keyframes and effects',
  },

  // ─── STABLE DIFFUSION VIDEO (SVD) ───
  {
    id: 'svd-stable-video',
    name: 'Stable Diffusion Video',
    company: 'Stability AI',
    provider: 'stability',
    providerModelId: 'stable-video-diffusion',
    tier: 'budget',
    types: ['image_to_video'],
    supportsT2V: false,
    supportsI2V: true,
    requiresImage: true,
    defaultDuration: 2,
    durationOptions: [2, 4],
    maxDuration: 4,
    isFrameBased: true,
    resolutions: ['1024x576'],
    defaultResolution: '1024x576',
    aspectRatios: ['16:9'],
    nativeAudio: false,
    extendable: false,
    specialFeatures: [
      'SHORTEST MODEL',
      'FRAME-BASED not second-based',
      'SVD: 14 frames',
      'SVD-XT: 25 frames',
      'open source & self-hostable',
      'IMAGE-REQUIRED',
    ],
    durationInputType: 'fixed',
    description: 'Shortest duration. Frame-based, image-to-video only.',
  },

  // ─── JOGG AI (Avatar) ───
  {
    id: 'jogg-ai',
    name: 'Jogg AI',
    company: 'Jogg',
    provider: 'jogg',
    providerModelId: 'jogg-ai',
    tier: 'premium',
    types: ['avatar'],
    supportsT2V: false,
    supportsI2V: false,
    pricePerSecond: 0.15,
    defaultDuration: 5,
    durationOptions: [5, 10, 15],
    maxDuration: 10,
    resolutions: ['1080p'],
    defaultResolution: '1080p',
    aspectRatios: ['16:9'],
    nativeAudio: true,
    extendable: false,
    specialFeatures: ['avatar selection required', 'professional avatar generation'],
    description: 'Professional avatar video generation',
    badge: 'Avatar',
  },
]

// Helper to get duration options for a specific resolution
export function getDurationOptionsForResolution(
  model: VideoModel,
  resolution: string
): number[] {
  if (model.durationByResolution && model.durationByResolution[resolution]) {
    return model.durationByResolution[resolution]
  }
  return model.durationOptions
}

// Helper to get duration options for a specific mode (T2V vs I2V)
export function getDurationOptionsForMode(model: VideoModel, mode: 'text_to_video' | 'image_to_video'): number[] {
  if (model.durationByMode) {
    const modeKey = mode === 'text_to_video' ? 't2v' : 'i2v'
    if (model.durationByMode[modeKey]) {
      return model.durationByMode[modeKey]
    }
  }
  return model.durationOptions
}

// Helper to check if a model supports a mode
export function supportsMode(model: VideoModel, mode: 'text_to_video' | 'image_to_video'): boolean {
  if (mode === 'text_to_video') return model.supportsT2V
  if (mode === 'image_to_video') return model.supportsI2V
  return false
}

// Helper to validate duration for model
export function isValidDuration(model: VideoModel, duration: number, resolution?: string, mode?: 'text_to_video' | 'image_to_video'): boolean {
  let validOptions = model.durationOptions

  if (resolution && model.durationByResolution && model.durationByResolution[resolution]) {
    validOptions = model.durationByResolution[resolution]
  } else if (mode && model.durationByMode) {
    validOptions = getDurationOptionsForMode(model, mode)
  }

  return validOptions.includes(duration)
}
