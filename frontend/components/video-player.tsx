"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Format thời gian thành MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Xử lý khi video được load
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Xử lý cập nhật thời gian
  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Xử lý phát/dừng video
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Xử lý bật/tắt âm thanh
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Xử lý click vào thanh tiến trình
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
      setCurrentTime(pos * duration);
    }
  };

  // Xử lý kéo thanh tiến trình
  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);

    const handleMouseMove = (e: MouseEvent) => {
      if (videoRef.current && progressRef.current) {
        const rect = progressRef.current.getBoundingClientRect();
        const pos = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width)
        );
        videoRef.current.currentTime = pos * duration;
        setCurrentTime(pos * duration);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Xử lý khi video kết thúc
  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  // Cleanup event listeners khi component unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        className="w-full rounded-t-lg"
        src={videoUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        onClick={togglePlay}
        muted={isMuted}
      />

      {/* Overlay khi video đang dừng */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <button className="bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70">
            <Play size={24} />
          </button>
        </div>
      )}

      {/* Thanh điều khiển video */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2 flex items-center gap-2">
        {/* Nút phát/dừng */}
        <button onClick={togglePlay} className="flex-shrink-0">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* Thời gian hiện tại / tổng thời gian */}
        <div className="text-sm whitespace-nowrap">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Thanh tiến trình */}
        <div
          ref={progressRef}
          className="flex-grow h-1 bg-gray-600 rounded cursor-pointer mx-2"
          onClick={handleProgressClick}
          onMouseDown={handleProgressMouseDown}
        >
          <div
            className="h-full bg-white rounded"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Nút bật/tắt âm thanh */}
        <button onClick={toggleMute} className="flex-shrink-0">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
}
