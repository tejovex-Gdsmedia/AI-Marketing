export type VideoType = 'avatar' | 'text_to_video' | 'image_to_video';
export type ApiProvider = 'fal' | 'gemini' | 'runway' | 'jogg' | 'segmind';
export type QualityTier = 'premium' | 'standard' | 'budget';

export interface VideoModel {
  id: string;
  name: string;
  company: string;
  types: VideoType[];
  provider: ApiProvider;
  providerModelId: string;
  tier: QualityTier;
  pricePerSecond?: number;
  pricePerVideo?: number;
  nativeAudio: boolean;
  maxDuration: number;
  resolution: string;
  description: string;
  badge?: string;
}

export const VIDEO_MODELS: VideoModel[] = [
  {
    id: 'jogg_avatar',
    name: 'Jogg AI Avatar',
    company: 'Jogg AI',
    types: ['avatar'],
    provider: 'jogg',
    providerModelId: 'jogg_avatar',
    tier: 'standard',
    pricePerVideo: 1.5,
    nativeAudio: false,
    maxDuration: 300,
    resolution: '1080p',
    description: 'AI spokesperson delivers your script with lip-synced voice.',
    badge: 'Avatar',
  },
  {
    id: 'kling_3',
    name: 'Kling 3.0',
    company: 'Kuaishou',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/kling-video/v2.1/standard/text-to-video',
    tier: 'premium',
    pricePerSecond: 0.10,
    nativeAudio: false,
    maxDuration: 10,
    resolution: '1080p',
    description: 'Best image-to-video quality. Realistic motion for product ads.',
    badge: 'Best for Products',
  },
  {
    id: 'veo3_fast',
    name: 'Veo 3 Fast',
    company: 'Google',
    types: ['text_to_video', 'image_to_video'],
    provider: 'gemini',
    providerModelId: 'veo-003',
    tier: 'premium',
    pricePerSecond: 0.15,
    nativeAudio: true,
    maxDuration: 15,
    resolution: '1080p',
    description: 'Cinematic scenes with native audio generated automatically.',
    badge: 'With Audio',
  },
  {
    id: 'runway_gen4',
    name: 'Runway Gen-4 Turbo',
    company: 'Runway',
    types: ['text_to_video', 'image_to_video'],
    provider: 'runway',
    providerModelId: 'gen4_turbo',
    tier: 'premium',
    pricePerSecond: 0.05,
    nativeAudio: false,
    maxDuration: 10,
    resolution: '1080p',
    description: 'Hollywood-grade cinematic video. Best text-to-video quality.',
    badge: 'Cinematic',
  },
  {
    id: 'higgsfield',
    name: 'Higgsfield',
    company: 'Higgsfield AI',
    types: ['text_to_video', 'image_to_video'],
    provider: 'segmind',
    providerModelId: 'higgsfield-t2v',
    tier: 'premium',
    pricePerVideo: 0.86,
    nativeAudio: false,
    maxDuration: 10,
    resolution: '1080p',
    description: 'Director-style camera controls. ARRI, RED lenses, dolly zooms.',
    badge: 'Camera Control',
  },
  {
    id: 'minimax_h3',
    name: 'MiniMax H3',
    company: 'MiniMax',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/minimax/video-01-live',
    tier: 'standard',
    pricePerSecond: 0.13,
    nativeAudio: true,
    maxDuration: 15,
    resolution: '1080p',
    description: 'Fast generation with native stereo audio. Great all-rounder.',
    badge: 'Stereo Audio',
  },
  {
    id: 'luma_ray3',
    name: 'Luma Ray 3',
    company: 'Luma AI',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/luma-dream-machine',
    tier: 'standard',
    pricePerVideo: 0.50,
    nativeAudio: false,
    maxDuration: 10,
    resolution: '720p',
    description: 'Quick clean generations. Good motion quality at flat rate pricing.',
  },
  {
    id: 'wan_2_7',
    name: 'Wan 2.7',
    company: 'Alibaba',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/wan-i2v',
    tier: 'standard',
    pricePerSecond: 0.10,
    nativeAudio: false,
    maxDuration: 10,
    resolution: '720p',
    description: 'Open source model. Reliable image-to-video with good motion.',
  },
  {
    id: 'seedance_2',
    name: 'Seedance 2.0',
    company: 'ByteDance',
    types: ['text_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/bytedance/seedance-v1-lite-t2v',
    tier: 'budget',
    pricePerSecond: 0.056,
    nativeAudio: false,
    maxDuration: 8,
    resolution: '720p',
    description: 'Cheapest per second. Great for bulk generation and testing.',
    badge: 'Most Affordable',
  },
  {
    id: 'pika_2_2',
    name: 'Pika 2.2',
    company: 'Pika Labs',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/pika/v2.2/text-to-video',
    tier: 'budget',
    pricePerSecond: 0.08,
    nativeAudio: false,
    maxDuration: 8,
    resolution: '720p',
    description: 'Fast social media style videos. Great for Instagram and TikTok.',
  },
  {
    id: 'hailuo_2_3',
    name: 'Hailuo 2.3',
    company: 'MiniMax',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/minimax/video-01',
    tier: 'budget',
    pricePerSecond: 0.08,
    nativeAudio: false,
    maxDuration: 8,
    resolution: '720p',
    description: 'Budget-friendly fast generation. Good for quick client previews.',
  },
];

// Helper: calculate cost estimate
export function estimateCost(model: VideoModel, durationSeconds: number): number {
  if (model.pricePerVideo) return model.pricePerVideo;
  if (model.pricePerSecond) return parseFloat((model.pricePerSecond * durationSeconds).toFixed(3));
  return 0;
}

// Helper: USD to INR (update rate as needed)
export function usdToInr(usd: number): number {
  const rate = 84;
  return parseFloat((usd * rate).toFixed(2));
}