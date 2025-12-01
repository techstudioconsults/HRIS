"use client";

import { Logo } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
import { Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type TourSegment = {
  id: string;
  title: string;
  time: number; // seconds from start
  description?: string;
};

interface TourVideoProperties {
  src: string;
  poster?: string;
  segments: TourSegment[];
  className?: string;
  transcript?: string[]; // optional transcript lines
}

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};

export const TourVideo = ({ src, poster, segments, className }: TourVideoProperties) => {
  const videoReference = useRef<HTMLVideoElement | null>(null);
  const progressReference = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  //   const [showTranscript, setShowTranscript] = useState(false);

  // Derive active segment
  const activeSegmentIndex = useMemo(() => {
    if (segments.length === 0) return -1;
    const indexOfActive = segments.findIndex((segment, segmentIndex) => {
      const nextTime = segments[segmentIndex + 1]?.time ?? duration + 1;
      return currentTime >= segment.time && currentTime < nextTime;
    });
    return indexOfActive;
  }, [segments, currentTime, duration]);

  const togglePlay = useCallback(() => {
    const v = videoReference.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoReference.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }, []);

  const handleRateChange = useCallback((rate: number) => {
    const v = videoReference.current;
    if (!v) return;
    v.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const seekTo = useCallback((time: number) => {
    const v = videoReference.current;
    if (!v) return;
    v.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (event_: KeyboardEvent) => {
      if (!videoReference.current) return;
      switch (event_.key) {
        case " ": {
          event_.preventDefault();
          togglePlay();
          break;
        }
        case "m": {
          toggleMute();
          break;
        }
        case "ArrowRight": {
          seekTo(Math.min(videoReference.current.currentTime + 5, duration));
          break;
        }
        case "ArrowLeft": {
          seekTo(Math.max(videoReference.current.currentTime - 5, 0));
          break;
        }
        case "]": {
          handleRateChange(Math.min(playbackRate + 0.25, 2));
          break;
        }
        case "[": {
          handleRateChange(Math.max(playbackRate - 0.25, 0.5));
          break;
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePlay, toggleMute, seekTo, duration, playbackRate, handleRateChange]);

  // Attach time listeners
  useEffect(() => {
    const v = videoReference.current;
    if (!v) return;
    const onLoaded = () => setDuration(v.duration);
    const onTime = () => setCurrentTime(v.currentTime);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
    };
  }, []);

  // Progress interaction
  const handleProgressClick = (event_: React.MouseEvent<HTMLDivElement>) => {
    if (!progressReference.current || !videoReference.current) return;
    const rect = progressReference.current.getBoundingClientRect();
    const ratio = (event_.clientX - rect.left) / rect.width;
    seekTo(ratio * duration);
  };

  // Format helper
  // NOTE: formatting moved to top-level helper `formatTime`.

  return (
    <div className={cn("flex flex-col gap-4", className)} aria-label="Product tour video">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Video + controls */}
        <div className="flex-1 space-y-4">
          <article className="max-w-full">
            <Logo />
            <p className="text-muted-foreground mt-2 text-sm">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus provident hic repudiandae maxime
              perferendis facilis, ducimus deserunt animi officiis nobis dolorem quod nostrum nemo quidem distinctio
              vel! Dicta, delectus saepe.
            </p>
          </article>
          <div className="relative min-h-[372px] overflow-hidden rounded-xl bg-black shadow">
            <video ref={videoReference} className="h-auto w-full" poster={poster} autoPlay playsInline muted={isMuted}>
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Overlay play button when paused */}
            {!isPlaying && (
              <MainButton
                icon={<Play />}
                variant="primary"
                isIconOnly
                size="icon"
                onClick={togglePlay}
                aria-label="Play video"
                className="absolute inset-0 bg-black/20 hover:bg-transparent"
              />
            )}
          </div>
          {/* Controls */}
          <div className="space-y-2">
            <div
              ref={progressReference}
              onClick={handleProgressClick}
              aria-label="Video progress"
              className="bg-muted relative h-3 w-full cursor-pointer overflow-hidden rounded-full"
            >
              <div
                className="bg-primary absolute top-0 left-0 h-full rounded-full transition-all"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : 0 }}
              />
              {/* Segment markers */}
              {segments.map((segment) => (
                <div
                  key={segment.id}
                  title={segment.title}
                  aria-label={`Segment ${segment.title}`}
                  className={cn(
                    "bg-primary/60 hover:bg-primary absolute top-0 h-full w-[2px]",
                    currentTime >= segment.time && "bg-primary",
                  )}
                  style={{ left: duration ? `${(segment.time / duration) * 100}%` : 0 }}
                  onClick={(event_) => {
                    event_.stopPropagation();
                    seekTo(segment.time);
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-3">
                <MainButton
                  onClick={togglePlay}
                  variant="primary"
                  size="sm"
                  className="px-5"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? "Pause" : "Play"}
                </MainButton>
                <MainButton
                  onClick={toggleMute}
                  variant="subtle"
                  size="sm"
                  className="px-5"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </MainButton>
                {/* <select
                  aria-label="Playback speed"
                  value={playbackRate}
                  onChange={(event_) => handleRateChange(Number(event_.target.value))}
                  className="bg-background rounded-md border px-2 py-1"
                >
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
                    <option key={r} value={r}>
                      {r}x
                    </option>
                  ))}
                </select> */}
              </div>
              <span className="text-muted-foreground tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              {/* <button
                onClick={() => setShowTranscript((p) => !p)}
                aria-expanded={showTranscript}
                className="bg-secondary rounded-md px-3 py-1"
              >
              {showTranscript ? "Hide Transcript" : "Show Transcript"}
              </button> */}
            </div>
          </div>
        </div>
        {/* Segments sidebar */}
        <aside className="flex w-full flex-col lg:w-72" aria-label="Tour segments">
          <h2 className="text-lg font-semibold">Tour Overview</h2>
          <ol className="!max-h-[547px] flex-1 space-y-2 overflow-y-auto p-1">
            {segments.map((segment, segmentIndex) => {
              const active = segmentIndex === activeSegmentIndex;
              return (
                <li key={segment.id}>
                  <button
                    onClick={() => seekTo(segment.time)}
                    className={cn(
                      "bg-primary-50 w-full rounded-md border border-transparent px-3 py-2 text-left shadow transition",
                      active ? "bg-primary-200 !text-white" : "hover:bg-primary/20 hover:shadow-none",
                    )}
                    aria-current={active ? "step" : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {segmentIndex + 1}. {segment.title}
                      </span>
                      <span className={cn(active && `text-background`, "text-[10px] tabular-nums")}>
                        {formatTime(segment.time)}
                      </span>
                    </div>
                    {segment.description && (
                      <p className={cn(active && `text-background`, "mt-1 line-clamp-2 text-[11px]")}>
                        {segment.description}
                      </p>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <i className="text-primary mt-2 text-[10px] italic">Shortcuts: Space (play/pause), M (mute), ←/→ (seek).</i>
        </aside>
      </div>
      {/* Transcript */}
      {/* {showTranscript && transcript && transcript.length > 0 && (
        <div
          className="bg-muted/30 max-h-[300px] space-y-2 overflow-y-auto rounded-lg border p-4"
          aria-label="Video transcript"
        >
          {transcript.map((line, index) => (
            <p key={index} className="text-sm leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default TourVideo;
