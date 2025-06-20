"use client";

import { useEffect, useState } from "react";
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
  Youtube,
  Facebook,
  UploadCloud,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/video-player";
import { VideoThumbnail } from "@/components/video-thumbnail";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getFacebookAccessToken, getFacebookthUrlApi, getYoutubeAccessToken,
  GetVideosApi,
   getYoutubeAuthUrlApi, uploadVideoApi } from "@/services/video_api";
import { Video } from "@/lib/models";

const mockVideos : Video[] = [
  {
    _id:  "1",
    title: "Thử thách 30 ngày",
    status: "done",
    video_url:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    userId: "user123",
    duration: 120,
    can_edit: true,
    public_id: "video_1",
  },
  {
    _id: "2",
    public_id: "video_2",
    title: "Mẹo học tiếng Anh hiệu quả",
    status: "done",
    video_url:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    userId: "user123",
    duration: 180,
    can_edit: true,
  },
  {
    _id: "3",
    public_id: "video_3",
    title: "Review công nghệ mới",
    status: "processing",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    userId: "user123",
    duration: 240,
    can_edit: true,      
  },
  {
    _id: "4",
    public_id: "video_4",
    title: "Hướng dẫn nấu ăn nhanh",
    status: "done",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    userId: "user123",
    duration: 300,
    can_edit: true,
  },
  {
    _id: "5",
    public_id: "video_5",
    title: "Bí quyết sống khỏe",
    status: "processing",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    userId: "user123",
    duration: 150,
    can_edit: true,     
  },
  {
    _id: "6",
    public_id: "video_6",
    title: "Khám phá địa điểm du lịch",
    status: "done",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    userId: "user123",
    duration: 360,
    can_edit: true,    
  },  
]
interface UploadVideoField {
  title: string;
  description: string;
  keyword: string;
  category: string;
  privateStatus: string;
}

export default function MyVideosPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  const [uploadVideoField, setUploadVideoField] = useState<UploadVideoField>({
    title: "",
    description: "",
    keyword: "",
    category: "",
    privateStatus: ""
  });
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
  
  const [shareDialog, setDialog] = useState<"choosePlatform" | "videoInfor" |"uploading" | "success" | "fail" | null>(null)
  const [platform, setPlatform] = useState<"youtube" | "facebook" | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [openDialog, setOpenDialog] = useState<"Video" | "Share" | null>(null)
  const redirect_uri = "http://localhost:3000/my-videos"

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const platform = sessionStorage.getItem("platform");

    if (code && platform != null) {
      if(platform === "youtube") {
      getYoutubeAccessToken(code, redirect_uri)
        .then((token) => {
          if (token) {
            sessionStorage.setItem("youtubeToken", token);
            console.log(token);
            window.location.replace("/my-videos");
          }
        })
        .catch((error) => {
          window.location.replace("/my-videos");
          console.log(error)
        });
      }
      if(platform === "facebook"){
        getFacebookAccessToken(code, redirect_uri)
        .then((token) => {
          if (token) {
            sessionStorage.setItem("facebookToken", token);
            console.log(token);
            window.location.replace("/my-videos");
          }
        })
        .catch((error) => {
          window.location.replace("/my-videos");
          console.log(error)
        });
      }
    }
  }, []);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await GetVideosApi();
        if (response) {
          setVideos(response.videos_data);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos(mockVideos); 
      }
    };

    fetchVideos();
  }, []);
  useEffect(() => {
    if(selectedVideo) {
      setUploadVideoField({
        title: selectedVideo.title,
        description: "",
        keyword: "",
        category: "",
        privateStatus: "public"
      });
    }
  }, [selectedVideo]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDurationLoad = (videoId: string, duration: number) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.public_id === videoId ? { ...video, duration } : video
      )
    );
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setOpenDialog("Video")
  };

  const handlePlatfromChoiceClick = async (platform: "youtube" | "facebook") => {
    setPlatform(platform)
    sessionStorage.setItem("platform", platform);
    if(platform === "youtube" && sessionStorage.getItem("youtubeToken") === null) {
      const response = await getYoutubeAuthUrlApi(redirect_uri)
      if(response) {
      window.location.href = response;
    }
    }
    else if (platform === "facebook" && sessionStorage.getItem("facebookToken") === null ) {
      const response = await getFacebookthUrlApi(redirect_uri)
      if(response) {
      window.location.href = response;
    }

    }
    setDialog("videoInfor")
  }

  const handleSubmitVideoInfor = async () => {
    setDialog("uploading");
    setUploadProgress(0);

    try{
      const youtubeToken = sessionStorage.getItem("youtubeToken");

      const request = {
        id: 1,
        title: uploadVideoField.title,
        description: uploadVideoField.description,
        keyword: uploadVideoField.keyword,
        category: uploadVideoField.category,
        privateStatus: uploadVideoField.privateStatus,
        videoUrl: selectedVideo?.video_url || "",
      }

      if(youtubeToken) {
        const response = await uploadVideoApi(request, youtubeToken)
        // Giả lập tiến trình upload
        for (let i = 1; i <= 100; i++) {
          await new Promise((r) => setTimeout(r, 15));
          setUploadProgress(i);
        }
      }
      setDialog("success");

      // Tự động đóng dialog sau 1.5s
      setTimeout(() => {
        setDialog(null);
        setUploadProgress(0);
        setPlatform(null);
        setSelectedVideo(null);
      }, 1500);
    } catch (err) {
      setDialog("fail");
      console.error("Error uploading video:", err);
    }
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
            key={video.public_id}
            className="bg-gray-100 rounded-md overflow-hidden cursor-pointer"
            onMouseEnter={() => setHoveredVideo(video.public_id)}
            onMouseLeave={() => setHoveredVideo(null)}
            onClick={() => handleVideoClick(video)}
          >
            <div className="relative aspect-[2/3] bg-gray-700 flex items-center justify-center">
              {/* Video Thumbnail từ frame đầu tiên */}
              <VideoThumbnail
                videoUrl={video.video_url}
                alt={video.title}
                className="w-full h-full object-cover"
                onDurationLoad={(duration) =>
                  handleDurationLoad(video.public_id, duration)
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

              {hoveredVideo === video.public_id && (
                <div className="absolute inset-0 bg-gray-400 bg-opacity-40 flex flex-col items-center justify-center gap-2">
                  <button className="bg-white text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1 text-sm w-28 justify-center">
                    <Edit size={14} />
                    <span>Sửa</span>
                  </button>
                  <button className="bg-white text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1 text-sm w-28 justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVideo(video);
                    setDialog("choosePlatform")
                    setOpenDialog("Share")
                  }}>
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
        open={(!!selectedVideo && openDialog === "Video")}
        onOpenChange={(open) => !open && setSelectedVideo(null) && setOpenDialog(null)}
      >
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black">
          <DialogTitle className="p-4 text-white">
            {selectedVideo?.title}
          </DialogTitle>
          {selectedVideo && (
            <VideoPlayer
              videoUrl={selectedVideo.video_url}
              title={selectedVideo.title}
            />
          )}
        </DialogContent>
      </Dialog>

      
      {/* upload dialog */}
       <Dialog
       open={(!!shareDialog && openDialog === "Share")}
       onOpenChange={(open) => !open && setDialog(null) && setOpenDialog(null) }
       >
       <DialogContent className="sm:max-w-[400px] flex flex-col items-center gap-6 py-8">
         {shareDialog === "choosePlatform" && (
         <div className="flex flex-col items-center gap-2">
           <DialogTitle>Chia sẻ video lên nền tảng</DialogTitle>
           <div className="flex gap-8 mt-2 items-center">
             <button
               onClick={() => handlePlatfromChoiceClick("youtube")}
               className="flex flex-col items-center hover:scale-110 transition">
               <Youtube size={36} className="text-red-600" />
               <span className="mt-2">YouTube</span>
             </button>

             <button
               onClick={() => handlePlatfromChoiceClick("facebook")}
               className="flex flex-col items-center hover:scale-110 transition"
             >
               <Facebook size={36} className="text-blue-600" />
               <span className="mt-2">Facebook</span>
             </button>
           </div>
         </div>
         
       )}

        {shareDialog === "videoInfor" && (
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={e => {
                
                e.preventDefault();
                handleSubmitVideoInfor()
              }}
            >
              <div className="mb-2 text-center text-2xl font-bold">
                Video Information
              </div>

              {/* Tiêu đề Video */}
              <div>
                <label className="block font-light mb-1">Tiêu đề </label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="ex: 30 days coding"
                  value={uploadVideoField.title}
                  onChange={e =>
                    setUploadVideoField(prev => ({
                      ...prev,
                      title: e.target.value
                    }))
                  }
                  required
                />
              </div>
              
              {/* Mô tả video */}
              <div>
                <label className="block font-light mb-1">Mô tả</label>
                <Textarea placeholder="ex: this is video for my 30 days coding challenge" 
                value={uploadVideoField.description || ""}
                onChange={e =>
                  setUploadVideoField(prev => ({
                    ...prev,
                    description: e.target.value
                  }))
                }/>
                
              </div>

              {/* Keyword */}
              <div>
                <label className="block font-light mb-1">Keyword để tìm thấy video</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="ex: 30 days, coding, challenge..."
                  value={uploadVideoField?.keyword}
                  onChange={e =>
                    setUploadVideoField(prev => ({
                      ...prev,
                      keyword: e.target.value
                    }))
                  }
                  required
                />
              </div>
              {/* Lấy danh sách category từ youtube (dùng api) */}
              {/* <div>
                <label className="block font-light mb-1">Thể loại</label>
               <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="thể loại" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="public">Công khai</SelectItem>
                  <SelectItem value="private">Riêng tư</SelectItem>
                  <SelectItem value="unlisted">Không công khai</SelectItem>
                </SelectContent>
              </Select>
              </div> */}

              <div>
                <label className="block font-light mb-1">Chế độ hiển thị</label>
               <Select value={uploadVideoField.privateStatus}
                onValueChange={v =>
                  setUploadVideoField(prev => ({
                    ...prev,
                    privateStatus: v
                  }))
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chế độ"/>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="public">Công khai</SelectItem>
                  <SelectItem value="private">Riêng tư</SelectItem>
                  <SelectItem value="unlisted">Không công khai</SelectItem>
                </SelectContent>
              </Select>
              </div>

               <Button
                type="submit"
                className="bg-purple-600 text-white rounded px-4 py-2 mt-2 hover:bg-purple-700"
              >
                Bắt đầu upload
              </Button>
            </form>
          )}

       {shareDialog === "uploading" && (
         <div className="flex flex-col items-center">
           <DialogTitle className='mb-2'>
             <div className="flex">
               <UploadCloud className="mr-2"/>
               Đang tải lên {platform === "youtube" ? "YouTube" : "Facebook"}
             </div>
           </DialogTitle>
           <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
             <div
               className="h-full bg-purple-600 transition-all"
               style={{ width: `${uploadProgress}%` }}
             />
           </div>
           <div className="text-sm text-gray-700">{uploadProgress}%</div>
         </div>
       )}


       {shareDialog === "success" && (
         <div className="flex flex-col items-center">
           <DialogTitle className='mb-2 text-green-600 flex items-center gap-2'>
             <CheckCircle className="mr-2" /> Đã upload thành công!
           </DialogTitle>
         </div>
       )}


       {shareDialog === "fail" && (
         <div className="flex flex-col items-center">
           <DialogTitle className='mb-2 text-red-600'>Upload thất bại!</DialogTitle>
           <button
             className="mt-4"
             onClick={() => setDialog("choosePlatform")}
           >
             Thử lại
           </button>
         </div>
       )}
       </DialogContent>
     </Dialog>
    </div>
  );
}
