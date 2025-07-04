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
import {uploadVideoToYoutubeApi } from "@/services/video_api";
import { getYoutubeAuthUrlApi, getYoutubeAccessToken } from "@/services/user_api";
import { Video } from "@/lib/models";
import { useFetchList } from "@/hooks/use-fetch-list";
import { useQuery } from "@/hooks/use-query";
import { useRouter } from "next/navigation";

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
const initialQuery = {
  current_page_number: 1,
  page_size: 10,
}
export default function MyVideosPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [titleKeyword, setTitleKeyword] = useState("");
  const [query, updateQuery, resetQuery] = useQuery(initialQuery);
  const { data: videos, totalPages} = useFetchList("video", query);

  const [uploadVideoField, setUploadVideoField] = useState<UploadVideoField>({
    title: "",
    description: "",
    keyword: "",
    category: "",
    privateStatus: ""
  });
  const [shareDialog, setDialog] = useState<"choosePlatform" | "videoInfor" |"uploading" | "success" | "fail" | null>(null)
  const [platform, setPlatform] = useState<"youtube" | "facebook" | null>(null)
  const [openDialog, setOpenDialog] = useState<"Video" | "Share" | null>(null)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string>("");

  const redirect_uri = "http://localhost:3000/my-videos"

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const platform = sessionStorage.getItem("platform");

    if (code && platform != null) {
      if(platform === "youtube") {
      getYoutubeAccessToken(code, redirect_uri)
        .then((response) => {
          if (response.status_code === 200) {
            sessionStorage.setItem("youtubeToken", response.access_token);
            window.location.replace("/my-videos");
          }
        })
        .catch((error) => {
          window.location.replace("/my-videos");
          console.log(error)
        });
      }
      // if(platform === "facebook"){
      //   getFacebookAccessToken(code, redirect_uri)
      //   .then((token) => {
      //     if (token) {
      //       sessionStorage.setItem("facebookToken", token);
      //       console.log(token);
      //       window.location.replace("/my-videos");
      //     }
      //   })
      //   .catch((error) => {
      //     window.location.replace("/my-videos");
      //     console.log(error)
      //   });
      // }
    }
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

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setOpenDialog("Video")
  };

  const handlePlatfromChoiceClick = async (platform: "youtube" | "facebook") => {
    setPlatform(platform)
    sessionStorage.setItem("platform", platform);
    if(platform === "youtube" && sessionStorage.getItem("youtubeToken") === null) {
      const response = await getYoutubeAuthUrlApi(redirect_uri)
      console.log(response);
      if(response.status_code === 200) {
        window.location.href = response.auth_url;
      }
    }
    // else if (platform === "facebook" && sessionStorage.getItem("facebookToken") === null ) {
    //   const response = await getFacebookthUrlApi(redirect_uri)
    //   if(response) {
    //   window.location.href = response;
    //   }
    // }
    setDialog("videoInfor")
  }

  const handleSubmitVideoInfor = async () => {
    setIsUploading(true);

    try{
      const youtubeToken = sessionStorage.getItem("youtubeToken");
      const request = {
        video_public_id: selectedVideo?.public_id || "",
        title: uploadVideoField.title,
        description: uploadVideoField.description,
        keyword: uploadVideoField.keyword,
        category: uploadVideoField.category,
        privateStatus: uploadVideoField.privateStatus,
        videoUrl: selectedVideo?.video_url || "",
        accessToken: youtubeToken || "",
      }

      const response = await uploadVideoToYoutubeApi(request)
      console.log("Upload response:", response);
      if(!response || response.status_code !== 200) {
        throw new Error(`Upload failed with status code: ${response.status_code}`);
      }
      setUploadResult("success");

      // Tự động đóng dialog sau 1.5s
      setTimeout(() => {
        setDialog(null);
        setUploadResult("");
      }, 3000);
    } catch (err) {
      console.error("Error uploading video:", err);
      setUploadResult("fail");

      setTimeout(() => {
        setDialog(null);
        setUploadResult("");
      }, 3000);
    }
    finally{
      setIsUploading(false);
      // Đợi 1.5s cho user đọc thông báo rồi mới reset toàn bộ
      setTimeout(() => {
        setDialog(null);
        setOpenDialog(null);
        setUploadResult("");
        setSelectedVideo(null);
        setPlatform(null);
        setUploadVideoField({
          title: "",
          description: "",
          keyword: "",
          category: "",
          privateStatus: ""
        });
      }, 3000);
    }
  };
  const HandleLoadMoreVideos = () => {
    if (query.current_page_number < totalPages) {
      updateQuery({ current_page_number: query.current_page_number + 1 });
    }
  }
  const handleChangeStatusTab = (status: string) => {
    setActiveTab(status);

    if (status === "all") {
      resetQuery();
    } else {
      updateQuery({ current_page_number: 1, page_size: 10, status: status });
    }

    setSelectedVideo(null);
  }
  const NavigateToEditVideoPage = (videoId: string) => {
    router.push(`/video/${videoId}/edit`);
  };
  const handleSearchVideoWithKeyword = () => {
    if (titleKeyword.trim() !== "") {
      updateQuery({ title: titleKeyword, current_page_number: 1 });
      setActiveTab("all");
    } else {
      resetQuery();
      setActiveTab("all");
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
            value={titleKeyword}
            onChange={(e) => setTitleKeyword(e.target.value)}
            placeholder="Tìm kiếm video theo tiêu đề..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-800"
          />
        </div>
        <button 
          onClick={handleSearchVideoWithKeyword}
          className="border border-gray-200 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
          <Search className="text-gray-600"/>
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
          onClick={() => handleChangeStatusTab("all")}
        >
          Tất cả
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "done"
              ? "border-b-2 border-purple-600 text-purple-600 font-medium"
              : "text-gray-600"
          }`}
          onClick={() => handleChangeStatusTab("done")}
        >
          Đã edit
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "processing"
              ? "border-b-2 border-purple-600 text-purple-600 font-medium"
              : "text-gray-600"
          }`}
          onClick={() => handleChangeStatusTab("processing")}
        >
          Chưa edit
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {videos.map((video) => (
          <div
            key={video.public_id}
            className="bg-gray-100 rounded-md overflow-hidden cursor-pointer"
            onMouseEnter={() => setHoveredVideo(video.public_id)}
            onMouseLeave={() => setHoveredVideo(null)}
            onClick={() => handleVideoClick(video)}
          >
            <div className="relative aspect-[16/9] bg-gray-700 flex items-center justify-center">
              {/* Video Thumbnail từ frame đầu tiên */}
              <VideoThumbnail
                videoUrl={video.video_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />

              {/* Status badge */}
              <div className="absolute top-2 left-2">
                <span
                  className={`text-xs px-2 py-1 rounded-md ${
                    video.status === "done"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {video.status === "done" ? "Đã edit" : "Chưa edit"}
                </span>
              </div>

              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                {video.duration ? formatDuration(video.duration) : "00:00"}
              </div>

              {hoveredVideo === video.public_id && (
                <div className="absolute inset-0 bg-gray-400 bg-opacity-40 flex flex-col items-center justify-center gap-2">
                  {video.status !== "done" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      NavigateToEditVideoPage(video.public_id);
                    }}
                    className="bg-white cursor-pointer text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1 text-sm w-28 justify-center">
                    <Edit size={14} />
                    <span>Sửa</span>
                  </button>
                  )}
                  <button className="bg-white cursor-pointer text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1 text-sm w-28 justify-center"
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
        <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center text-gray-500">
          {videos.length === 0 && (
            <p className="text-sm">Không có video nào để hiển thị.</p>
          )}
        </div>
      </div>
      
      {query.current_page_number < totalPages && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={HandleLoadMoreVideos}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <span>Tải thêm video</span>
          </Button>
        </div>
      )}


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
                disabled
                onClick={() => handlePlatfromChoiceClick("facebook")}
                className="flex flex-col items-center hover:scale-110 transition">
                <Facebook size={36} className="text-blue-600" />
                <span className="mt-2">Facebook (sắp ra mắt) </span>
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

              { /* Chọn chế độ hiển thị video */}
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
              {/* Nút bắt đầu upload video */}
              { isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2 text-gray-600">Đang upload...</span>
                </div>
                ) : (
                <Button
                  type="submit"
                  className="bg-purple-600 text-white rounded px-4 py-2 mt-2 hover:bg-purple-700">
                  Bắt đầu upload
                </Button>)}
              { uploadResult === "success" && (
                <div className="flex items-center justify-center text-green-600">
                  <CheckCircle size={20} className="mr-2" />
                  <span>Upload thành công!</span>
                </div>
                )}
              { uploadResult === "fail" && 
                (
                <div className="flex items-center justify-center text-red-600">
                  <UploadCloud size={20} className="mr-2" />
                  <span>Upload thất bại, vui lòng thử lại.</span>
                </div>
                )
              }

            </form>
          )}
          
       </DialogContent>
     </Dialog>
    </div>
  );
}
