"use client";

import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import { VIDEO_MODELS } from "../../lib/video/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VideoStatus = "idle" | "generating" | "polling" | "completed" | "failed";

export default function VideoGenerator() {
  const [modelId, setModelId] = useState<string>("kling-3.0");
  const [prompt, setPrompt] = useState<string>("");
  const [duration, setDuration] = useState<number>(5);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [status, setStatus] = useState<VideoStatus>("idle");
  const [jobId, setJobId] = useState<string>("");
  const [falModelId, setFalModelId] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const selectedModel = VIDEO_MODELS.find((m) => m.id === modelId);
  const isFal = selectedModel?.provider === "fal";

  const generateVideo = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (!prompt.trim()) return;
      setStatus("generating");
      setError("");
      setVideoUrl("");
      setProgress(0);
      try {
        const res = await fetch("/api/video-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            modelId,
            prompt,
            duration,
            imageUrl: imageUrl || undefined,
            aspectRatio: "16:9",
          }),
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          setStatus("failed");
          return;
        }
        setJobId(data.jobId);
        setFalModelId(data.falModelId || "");
        setStatus("polling");
      } catch (err) {
        setError("Failed to start generation");
        setStatus("failed");
      }
    },
    [modelId, prompt, duration, imageUrl]
  );

  // Polling loop
  useEffect(() => {
    if (status !== "polling" || !jobId || !falModelId) return;
    let interval: ReturnType<typeof setInterval>;
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(
          `/api/video-status?jobId=${jobId}&falModelId=${falModelId}&provider=fal`
        );
        const data = await res.json();
        if (data.status === "completed") {
          if (data.videoUrl) setVideoUrl(data.videoUrl);
          setStatus("completed");
          setProgress(100);
          return;
        }
        if (data.status === "failed") {
          setError(data.error || "Generation failed");
          setStatus("failed");
          return;
        }
        // in_progress or queued — continue polling
        setProgress((p) => Math.min(p + 5, 95));
      } catch {
        if (!cancelled) setProgress((p) => Math.min(p + 2, 95));
      }
    }

    poll();
    interval = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [status, jobId, falModelId]);

  const handleSelectChange = (value: string) => {
    setModelId(value);
    setStatus("idle");
    setJobId("");
    setVideoUrl("");
    setError("");
    setProgress(0);
    setFalModelId("");
  };

  return (
    <Card className="bg-[#0A0A0B] border-white/10 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white">AI Video Generator</CardTitle>
        <CardDescription className="text-white/40">
          Select a model, enter a prompt, and generate a video
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={generateVideo} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/70">Model</Label>
            <Select value={modelId} onValueChange={handleSelectChange}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VIDEO_MODELS.filter((m) => m.provider === "fal").map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Prompt</Label>
            <Input
              value={prompt}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to generate..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Duration (seconds)</Label>
            <Input
              type="number"
              min={1}
              max={60}
              value={duration}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDuration(Number(e.target.value))}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Image URL (optional, for image-to-video)</Label>
            <Input
              value={imageUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          <Button
            type="submit"
            disabled={status === "generating" || status === "polling"}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:opacity-90"
          >
            {status === "generating"
              ? "Submitting..."
              : status === "polling"
              ? "Generating..."
              : "Generate Video"}
          </Button>

          {error && (
            <div className="text-red-400 text-sm p-3 rounded-lg bg-red-400/10 border border-red-400/20">
              {error}
            </div>
          )}

          {/* Progress bar */}
          {(status === "polling" || status === "generating") && (
            <div className="space-y-1">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-white/40 text-xs">Processing... {progress}%</p>
            </div>
          )}

          {/* Video player */}
          {status === "completed" && videoUrl && (
            <div className="space-y-2">
              <h3 className="text-white font-semibold">Video Ready!</h3>
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full rounded-lg bg-black border border-white/10"
              />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
