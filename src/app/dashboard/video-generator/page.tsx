'use client';

import { useState, useEffect, useRef } from 'react';
type VideoType = 'avatar' | 'text_to_video' | 'image_to_video';
type VideoModel = {
  id: string;
  providerModelId: string;
  name: string;
  company: string;
  description: string;
  types: VideoType[];
  tier: 'premium' | 'standard' | 'budget';
  badge?: string;
  pricePerVideo?: number;
  pricePerSecond?: number;
  resolution: string;
  maxDuration: number;
  nativeAudio?: boolean;
};

const VIDEO_MODELS: VideoModel[] = [
  { id: 'sora-2', providerModelId: 'sora-2', name: 'Sora 2', company: 'OpenAI', description: 'High-quality text-to-video generation', types: ['text_to_video', 'image_to_video'], tier: 'premium', badge: 'Premium', pricePerSecond: 0.3, resolution: '1080p', maxDuration: 15 },
  { id: 'veo-3', providerModelId: 'veo-3', name: 'Veo 3', company: 'Google', description: 'Cinematic video with native audio', types: ['text_to_video', 'image_to_video'], tier: 'premium', badge: 'Audio', pricePerSecond: 0.4, resolution: '1080p', maxDuration: 8, nativeAudio: true },
  { id: 'kling-1.6', providerModelId: 'kling-1.6', name: 'Kling 1.6', company: 'Kuaishou', description: 'Detailed motion and realistic physics', types: ['text_to_video', 'image_to_video'], tier: 'standard', pricePerSecond: 0.08, resolution: '1080p', maxDuration: 10 },
  { id: 'runway-gen-4', providerModelId: 'runway-gen-4', name: 'Gen-4', company: 'Runway', description: 'Consistent characters and scenes', types: ['text_to_video', 'image_to_video'], tier: 'premium', pricePerVideo: 1.2, resolution: '1080p', maxDuration: 10 },
  { id: 'pika-2', providerModelId: 'pika-2', name: 'Pika 2', company: 'Pika', description: 'Fast creative video generation', types: ['text_to_video', 'image_to_video'], tier: 'standard', pricePerVideo: 0.5, resolution: '1080p', maxDuration: 10 },
  { id: 'luma-dream-machine', providerModelId: 'luma-dream-machine', name: 'Dream Machine', company: 'Luma', description: 'Natural motion and camera work', types: ['text_to_video', 'image_to_video'], tier: 'standard', pricePerSecond: 0.08, resolution: '1080p', maxDuration: 10 },
  { id: 'haiper', providerModelId: 'haiper', name: 'Haiper', company: 'Haiper', description: 'Affordable AI video generation', types: ['text_to_video', 'image_to_video'], tier: 'budget', pricePerVideo: 0.3, resolution: '720p', maxDuration: 10 },
  { id: 'heygen', providerModelId: 'heygen', name: 'HeyGen', company: 'HeyGen', description: 'AI avatar presenter videos', types: ['avatar'], tier: 'premium', pricePerVideo: 1, resolution: '1080p', maxDuration: 5 },
  { id: 'synthesia', providerModelId: 'synthesia', name: 'Synthesia', company: 'Synthesia', description: 'Professional avatar videos', types: ['avatar'], tier: 'premium', pricePerVideo: 1, resolution: '1080p', maxDuration: 5 },
  { id: 'vidu', providerModelId: 'vidu', name: 'Vidu', company: 'ShengShu', description: 'Quick text-to-video generation', types: ['text_to_video', 'image_to_video'], tier: 'budget', pricePerSecond: 0.05, resolution: '1080p', maxDuration: 8 },
  { id: 'minimax', providerModelId: 'minimax', name: 'MiniMax', company: 'MiniMax', description: 'High-quality motion generation', types: ['text_to_video', 'image_to_video'], tier: 'standard', pricePerSecond: 0.1, resolution: '1080p', maxDuration: 10 },
];

const estimateCost = (model: VideoModel, duration: number) =>
  model.pricePerVideo ?? (model.pricePerSecond ?? 0) * duration;
const usdToInr = (usd: number) => Math.round(usd * 84 * 100) / 100;

const TYPE_FILTERS: { label: string; value: 'all' | VideoType }[] = [
  { label: 'All Models', value: 'all' },
  { label: 'Avatar', value: 'avatar' },
  { label: 'Text to Video', value: 'text_to_video' },
  { label: 'Image to Video', value: 'image_to_video' },
];

const TIER_COLORS: Record<string, string> = {
  premium: 'border-amber-400 text-amber-400',
  standard: 'border-blue-400 text-blue-400',
  budget: 'border-emerald-400 text-emerald-400',
};

const TIER_BORDER: Record<string, string> = {
  premium: 'border-l-amber-400',
  standard: 'border-l-blue-400',
  budget: 'border-l-emerald-400',
};

const DURATIONS = [5, 8, 10, 15];
const ASPECT_RATIOS = ['16:9', '9:16', '1:1'];

type GenerationStatus = 'idle' | 'generating' | 'polling' | 'completed' | 'failed';

export default function VideoGeneratorPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | VideoType>('all');
  const [selectedModel, setSelectedModel] = useState<VideoModel | null>(null);
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [conceptInput, setConceptInput] = useState('');
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [jobId, setJobId] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filteredModels = VIDEO_MODELS.filter((m) =>
    activeFilter === 'all' ? true : m.types.includes(activeFilter as VideoType)
  );

  const estimatedUSD = selectedModel ? estimateCost(selectedModel, duration) : 0;
  const estimatedINR = usdToInr(estimatedUSD);

  useEffect(() => {
    if (status === 'polling' && jobId && provider) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(
            `/api/video-status?jobId=${jobId}&provider=${provider}&modelId=${selectedModel?.providerModelId}`
          );
          const data = await res.json();

          if (data.status === 'completed') {
            clearInterval(pollRef.current!);
            setVideoUrl(data.videoUrl);
            setStatus('completed');
          } else if (data.status === 'failed') {
            clearInterval(pollRef.current!);
            setError(data.error || 'Generation failed');
            setStatus('failed');
          }
        } catch {
          clearInterval(pollRef.current!);
          setError('Failed to check status');
          setStatus('failed');
        }
      }, 4000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [status, jobId, provider]);

  async function handleGenerateConcept() {
    if (!conceptInput.trim()) return;
    setIsGeneratingPrompt(true);
    try {
      const res = await fetch('/api/generate-video-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: conceptInput }),
      });
      const data = await res.json();
      setPrompt(data.result?.prompt || data.result?.script || '');
    } finally {
      setIsGeneratingPrompt(false);
    }
  }

  async function handleGenerate() {
    if (!selectedModel || !prompt.trim()) return;
    setStatus('generating');
    setError(null);
    setVideoUrl(null);

    try {
      const res = await fetch('/api/video-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: selectedModel.id,
          prompt: prompt.trim(),
          imageUrl: imageUrl.trim() || undefined,
          duration,
          aspectRatio,
          userId: 'user_id_here',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setJobId(data.jobId);
      setProvider(data.provider);
      setStatus('polling');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
      setStatus('failed');
    }
  }

  function handleReset() {
    setStatus('idle');
    setJobId(null);
    setVideoUrl(null);
    setError(null);
    setProvider(null);
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      {/* Header */}
      <div className="border-b border-[#2A3447] px-8 py-5">
        <h1 className="text-xl font-semibold tracking-tight">Video Generator</h1>
        <p className="text-sm text-[#8A94A6] mt-0.5">Generate AI videos using 11 models</p>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* LEFT: Model Selector */}
        <div className="w-[380px] border-r border-[#2A3447] flex flex-col">
          <div className="flex gap-1 p-3 border-b border-[#2A3447]">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setActiveFilter(f.value);
                  const models = VIDEO_MODELS.filter((model) =>
                    f.value === 'all' ? true : model.types.includes(f.value as VideoType)
                  );
                  setSelectedModel(models[0] ?? null);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeFilter === f.value
                    ? 'bg-[#4F8EF7] text-white'
                    : 'text-[#8A94A6] hover:text-white hover:bg-[#1E2535]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`w-full text-left p-3 rounded-lg border-l-2 transition-all ${
                  selectedModel?.id === model.id
                    ? 'bg-[#1E2535] border border-[#4F8EF7] border-l-2'
                    : `bg-[#161B27] border border-[#2A3447] ${TIER_BORDER[model.tier]} hover:bg-[#1E2535]`
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-white">{model.name}</span>
                      {model.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${TIER_COLORS[model.tier]}`}>
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8A94A6] mt-0.5">{model.company}</p>
                    <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">{model.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold text-white">
                      {model.pricePerVideo
                        ? `$${model.pricePerVideo}/video`
                        : `$${model.pricePerSecond}/sec`}
                    </div>
                    <div className="text-[10px] text-[#8A94A6]">{model.resolution}</div>
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  {model.types.map((t) => (
                    <span key={t} className="text-[10px] bg-[#2A3447] text-[#8A94A6] px-1.5 py-0.5 rounded">
                      {t === 'avatar' ? 'Avatar' : t === 'text_to_video' ? 'T2V' : 'I2V'}
                    </span>
                  ))}
                  {model.nativeAudio && (
                    <span className="text-[10px] bg-purple-900/40 text-purple-300 px-1.5 py-0.5 rounded">
                      Audio
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Generation Form */}
        <div className="flex-1 overflow-y-auto p-8">
          {!selectedModel ? (
            <div className="flex items-center justify-center h-full text-[#8A94A6]">
              Select a model to get started
            </div>
          ) : (
            <div className="max-w-2xl space-y-6">
              {/* Selected model info */}
              <div className="flex items-center gap-3 pb-4 border-b border-[#2A3447]">
                <div>
                  <h2 className="font-semibold text-lg">{selectedModel.name}</h2>
                  <p className="text-sm text-[#8A94A6]">
                    {selectedModel.company} · {selectedModel.resolution} · Max {selectedModel.maxDuration}s
                  </p>
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-sm font-medium text-[#8A94A6] mb-2">
                  {selectedModel.types.includes('avatar') ? 'Script' : 'Prompt'}
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={conceptInput}
                    onChange={(e) => setConceptInput(e.target.value)}
                    placeholder="Describe your product or service..."
                    className="flex-1 bg-[#161B27] border border-[#2A3447] rounded-lg px-3 py-2 text-sm text-white placeholder-[#4A5568] focus:outline-none focus:border-[#4F8EF7]"
                  />
                  <button
                    onClick={handleGenerateConcept}
                    disabled={isGeneratingPrompt || !conceptInput.trim()}
                    className="px-4 py-2 bg-[#1E2535] border border-[#2A3447] text-sm text-[#8A94A6] hover:text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isGeneratingPrompt ? 'Generating...' : 'Auto-Generate Prompt'}
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder={
                    selectedModel.types.includes('avatar')
                      ? 'Write the script your avatar will speak...'
                      : 'Describe the video you want to generate...'
                  }
                  className="w-full bg-[#161B27] border border-[#2A3447] rounded-lg px-4 py-3 text-sm text-white placeholder-[#4A5568] focus:outline-none focus:border-[#4F8EF7] resize-none"
                />
              </div>

              {/* Image URL */}
              {(selectedModel.types.includes('image_to_video') || selectedModel.types.includes('text_to_video')) &&
                !selectedModel.types.includes('avatar') && (
                  <div>
                    <label className="block text-sm font-medium text-[#8A94A6] mb-2">
                      Image URL{' '}
                      <span className="text-[#4A5568] font-normal">(optional — for image-to-video)</span>
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://your-product-image.com/photo.jpg"
                      className="w-full bg-[#161B27] border border-[#2A3447] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4A5568] focus:outline-none focus:border-[#4F8EF7]"
                    />
                  </div>
                )}

              {/* Duration + Aspect Ratio */}
              {!selectedModel.types.includes('avatar') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#8A94A6] mb-2">Duration</label>
                    <div className="flex gap-2">
                      {DURATIONS.filter((d) => d <= selectedModel.maxDuration).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                            duration === d
                              ? 'bg-[#4F8EF7] text-white'
                              : 'bg-[#161B27] border border-[#2A3447] text-[#8A94A6] hover:text-white'
                          }`}
                        >
                          {d}s
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8A94A6] mb-2">Aspect Ratio</label>
                    <div className="flex gap-2">
                      {ASPECT_RATIOS.map((ar) => (
                        <button
                          key={ar}
                          onClick={() => setAspectRatio(ar)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                            aspectRatio === ar
                              ? 'bg-[#4F8EF7] text-white'
                              : 'bg-[#161B27] border border-[#2A3447] text-[#8A94A6] hover:text-white'
                          }`}
                        >
                          {ar}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Cost Preview */}
              <div className="bg-[#161B27] border border-[#2A3447] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#8A94A6]">Estimated cost for this generation</p>
                  <p className="text-2xl font-bold text-white mt-0.5">
                    ₹{estimatedINR}
                    <span className="text-sm font-normal text-[#8A94A6] ml-2">(${estimatedUSD})</span>
                  </p>
                </div>
                {selectedModel.nativeAudio && (
                  <span className="text-xs bg-purple-900/40 text-purple-300 px-3 py-1.5 rounded-full border border-purple-700">
                    Includes native audio
                  </span>
                )}
              </div>

              {/* Generate Button */}
              {status === 'idle' || status === 'failed' ? (
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="w-full py-3.5 bg-[#4F8EF7] hover:bg-[#3B7DE8] disabled:bg-[#2A3447] disabled:text-[#4A5568] disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  Generate Video
                </button>
              ) : status === 'generating' || status === 'polling' ? (
                <div className="w-full py-3.5 bg-[#1E2535] border border-[#2A3447] rounded-lg flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-[#4F8EF7] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-[#8A94A6]">
                    {status === 'generating' ? 'Submitting job...' : 'Generating your video...'}
                  </span>
                </div>
              ) : null}

              {/* Error */}
              {status === 'failed' && error && (
                <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-4">
                  <p className="text-sm text-red-400">{error}</p>
                  <button onClick={handleReset} className="text-xs text-red-300 underline mt-2">
                    Try again
                  </button>
                </div>
              )}

              {/* Result */}
              {status === 'completed' && videoUrl && (
                <div className="space-y-3">
                  <div className="bg-[#161B27] border border-[#2A3447] rounded-lg overflow-hidden">
                    <video src={videoUrl} controls autoPlay className="w-full" />
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={videoUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-[#4F8EF7] text-white text-sm font-medium rounded-lg text-center hover:bg-[#3B7DE8] transition-colors"
                    >
                      Download Video
                    </a>
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2.5 bg-[#1E2535] border border-[#2A3447] text-white text-sm font-medium rounded-lg hover:bg-[#2A3447] transition-colors"
                    >
                      Generate Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

