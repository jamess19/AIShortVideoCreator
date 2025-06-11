"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Clock,
  Play,
  Edit,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/video-player";
import { VideoThumbnail } from "@/components/video-thumbnail";

interface Video {
  id: number;
  title: string;
  status: "published" | "draft";
  views: number;
  timeAgo: string;
  videoUrl: string;
  duration?: number;
}

export default function MyVideosPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{
    id: number;
    title: string;
    videoUrl: string;
  } | null>(null);

  // Dữ liệu mẫu cho các video
  const [videos, setVideos] = useState<Video[]>([
    {
      id: 1,
      title: "Thử thách 30 ngày",
      status: "published",
      views: 1240,
      timeAgo: "2 ngày trước",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    },
    {
      id: 2,
      title: "Mẹo học tiếng Anh hiệu quả",
      status: "published",
      views: 850,
      timeAgo: "1 tuần trước",
      videoUrl:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    },
    {
      id: 3,
      title: "Review công nghệ mới",
      status: "draft",
      views: 0,
      timeAgo: "3 giờ trước",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      id: 4,
      title: "Hướng dẫn nấu ăn nhanh",
      status: "published",
      views: 320,
      timeAgo: "3 ngày trước",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    },
    {
      id: 5,
      title: "Bí quyết sống khỏe",
      status: "draft",
      views: 0,
      timeAgo: "1 ngày trước",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    },
    {
      id: 6,
      title: "Khám phá địa điểm du lịch",
      status: "published",
      views: 720,
      timeAgo: "5 ngày trước",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    },
  ]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDurationLoad = (videoId: number, duration: number) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === videoId ? { ...video, duration } : video
      )
    );
  };

  const filteredVideos = videos.filter((video) => {
    if (activeTab === "all") return true;
    if (activeTab === "published") return video.status === "published";
    if (activeTab === "draft") return video.status === "draft";
    return true;
  });

  const publishedCount = videos.filter(
    (video) => video.status === "published"
  ).length;
  const draftCount = videos.filter((video) => video.status === "draft").length;
  const totalCount = videos.length;

  // Xử lý khi click vào video
  const handleVideoClick = (video: Video) => {
    setSelectedVideo({
      id: video.id,
      title: video.title,
      videoUrl: video.videoUrl,
    });
  };

  return (
    <div className="p-8 ml-64">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl text-black font-bold mb-2">Video của tôi</h1>
          <p className="text-gray-600">
            Quản lý và theo dõi tất cả video đã tạo
          </p>
        </div>
        <Link
          href="/script"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Tạo video mới</span>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm video..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-800"
          />
        </div>
        <button className="border border-gray-200 p-2 rounded-md hover:bg-gray-50">
          <Filter size={20} className="text-gray-600" />
          <span className="sr-only">Lọc</span>
        </button>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "all"
              ? "border-b-2 border-purple-600 text-purple-600 font-medium"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả ({totalCount})
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "published"
              ? "border-b-2 border-purple-600 text-purple-600 font-medium"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("published")}
        >
          Đã đăng ({publishedCount})
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "draft"
              ? "border-b-2 border-purple-600 text-purple-600 font-medium"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("draft")}
        >
          Bản nháp ({draftCount})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-gray-100 rounded-md overflow-hidden cursor-pointer"
            onMouseEnter={() => setHoveredVideo(video.id)}
            onMouseLeave={() => setHoveredVideo(null)}
            onClick={() => handleVideoClick(video)}
          >
            <div className="relative aspect-[2/3] bg-gray-700 flex items-center justify-center">
              {/* Video Thumbnail từ frame đầu tiên */}
              <VideoThumbnail
                videoUrl={video.videoUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                onDurationLoad={(duration) =>
                  handleDurationLoad(video.id, duration)
                }
              />

              {/* Status badge */}
              <div className="absolute top-2 left-2">
                <span
                  className={`text-xs px-2 py-1 rounded-md ${
                    video.status === "published"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {video.status === "published" ? "Đã đăng" : "Bản nháp"}
                </span>
              </div>

              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                {video.duration ? formatDuration(video.duration) : "00:00"}
              </div>

              {hoveredVideo === video.id && (
                <div className="absolute inset-0 bg-gray-400 bg-opacity-40 flex flex-col items-center justify-center gap-2">
                  <button className="bg-white text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1 text-sm w-28 justify-center">
                    <Edit size={14} />
                    <span>Sửa</span>
                  </button>
                  <button className="bg-white text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1 text-sm w-28 justify-center">
                    <Share2 size={14} />
                    <span>Chia sẻ</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
                  {video.title}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700 ml-1 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn không cho mở popup khi click vào nút này
                  }}
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              {video.status === "published" && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    <span>{video.views} lượt xem</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{video.timeAgo}</span>
                  </div>
                </div>
              )}

              {video.status === "draft" && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>{video.timeAgo}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Dialog */}
      <Dialog
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
      >
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black">
          <DialogTitle className="p-4 text-white">
            {selectedVideo?.title}
          </DialogTitle>
          {selectedVideo && (
            <VideoPlayer
              videoUrl={selectedVideo.videoUrl}
              title={selectedVideo.title}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
