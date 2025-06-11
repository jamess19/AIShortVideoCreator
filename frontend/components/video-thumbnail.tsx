"use client";

import { useState, useRef, useEffect } from "react";

interface VideoThumbnailProps {
  videoUrl: string;
  alt: string;
  className?: string;
  onDurationLoad?: (duration: number) => void;
}

export function VideoThumbnail({
  videoUrl,
  alt,
  className,
  onDurationLoad,
}: VideoThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const handleLoadedData = () => {
      // Đặt video về giây thứ 0
      video.currentTime = 0;

      // Gọi callback với thời lượng thực tế
      if (onDurationLoad) {
        onDurationLoad(video.duration);
      }
    };

    const handleSeeked = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Đặt kích thước canvas theo tỷ lệ video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Vẽ frame đầu tiên lên canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Chuyển canvas thành data URL để làm thumbnail
      const dataURL = canvas.toDataURL("image/jpeg", 0.8);
      setThumbnailUrl(dataURL);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [videoUrl, onDurationLoad]);

  return (
    <>
      {/* Video ẩn để tạo thumbnail */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="hidden"
        muted
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* Canvas ẩn để capture frame */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hiển thị thumbnail */}
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl || "/placeholder.svg"}
          alt={alt}
          className={className}
        />
      ) : (
        <div
          className={`${className} bg-gray-600 flex items-center justify-center`}
        >
          <div className="text-white text-sm">Đang tải...</div>
        </div>
      )}
    </>
  );
}
