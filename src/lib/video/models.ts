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
    id: 'kling-3.0',
    name: 'Kling 3.0',
    company: 'Kuaishou',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/kling-video/v2.1/standard/text-to-video',
    tier: 'premium',
    pricePerSecond: 0.12,
    nativeAudio: false,
    maxDuration: 30,
    resolution: '1080p',
    description: 'Advanced motion and realistic physics',
    badge: 'Latest',
  },
  {
    id: 'veo-3-fast',
    name: 'Veo 3 Fast',
    company: 'Google',
    types: ['text_to_video', 'image_to_video'],
    provider: 'gemini',
    providerModelId: 'veo-003',
    tier: 'premium',
    pricePerSecond: 0.35,
    nativeAudio: true,
    maxDuration: 10,
    resolution: '1080p',
    description: 'Fast cinematic video generation',
    badge: 'Fast',
  },
  {
    id: 'runway-gen-4-turbo',
    name: 'Runway Gen-4 Turbo',
    company: 'Runway',
    types: ['text_to_video', 'image_to_video'],
    provider: 'runway',
    providerModelId: 'gen4_turbo',
    tier: 'premium',
    pricePerVideo: 1.5,
    nativeAudio: false,
    maxDuration: 15,
    resolution: '1080p',
    description: 'Turbo mode for faster generation',
    badge: 'Turbo',
  },
  {
    id: 'minimax-h3',
    name: 'MiniMax H3',
    company: 'MiniMax',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/minimax/video-01-live',
    tier: 'standard',
    pricePerSecond: 0.1,
    nativeAudio: true,
    maxDuration: 20,
    resolution: '1080p',
    description: 'High-quality motion with H3 engine',
  },
  {
    id: 'seedance-2.0',
    name: 'Seedance 2.0',
    company: 'ByteDance',
    types: ['text_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/bytedance/seedance-v1-lite-t2v',
    tier: 'standard',
    pricePerSecond: 0.09,
    nativeAudio: false,
    maxDuration: 25,
    resolution: '1080p',
    description: 'Smooth dance and motion generation',
  },
  {
    id: 'luma-ray-3',
    name: 'Luma Ray 3',
    company: 'Luma AI',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/luma-dream-machine',
    tier: 'premium',
    pricePerSecond: 0.15,
    nativeAudio: false,
    maxDuration: 20,
    resolution: '1080p',
    description: 'Ray-traced realistic video generation',
  },
  {
    id: 'wan-2.7',
    name: 'Wan 2.7',
    company: 'Alibaba',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/wan-i2v',
    tier: 'standard',
    pricePerSecond: 0.08,
    nativeAudio: false,
    maxDuration: 18,
    resolution: '1080p',
    description: 'Wide-angle video synthesis',
  },
  {
    id: 'pika-2.2',
    name: 'Pika 2.2',
    company: 'Pika Labs',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/pika/v2.2/text-to-video',
    tier: 'standard',
    pricePerVideo: 0.6,
    nativeAudio: false,
    maxDuration: 15,
    resolution: '1080p',
    description: 'Fast creative video with enhanced quality',
  },
  {
    id: 'hailuo-2.3',
    name: 'Hailuo 2.3',
    company: 'MiniMax',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/minimax/video-01',
    tier: 'standard',
    pricePerSecond: 0.11,
    nativeAudio: false,
    maxDuration: 22,
    resolution: '1080p',
    description: 'High-fidelity video generation',
  },
  {
    id: 'stable-video-diffusion',
    name: 'Stable Video Diffusion',
    company: 'Stability AI',
    types: ['text_to_video', 'image_to_video'],
    provider: 'fal',
    providerModelId: 'fal-ai/stable-video',
    tier: 'budget',
    pricePerVideo: 0.25,
    nativeAudio: false,
    maxDuration: 25,
    resolution: '1080p',
    description: 'Stable and consistent video diffusion',
  },
  {
    id: 'jogg-ai',
    name: 'Jogg AI',
    company: 'Jogg',
    types: ['avatar'],
    provider: 'jogg',
    providerModelId: 'jogg-ai',
    tier: 'premium',
    pricePerVideo: 2.5,
    nativeAudio: false,
    maxDuration: 10,
    resolution: '1080p',
    description: 'Professional avatar video generation',
    badge: 'Avatar',
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
  const rate = 95.94;
  return parseFloat((usd * rate).toFixed(2));
}