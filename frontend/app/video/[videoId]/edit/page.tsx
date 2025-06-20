"use client"

import { useVideoContext, VideoData } from "@/hooks/use-video-context"
import Preview from "./_components/Preview"
import EditTabBar from "./_components/EditTabBar"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { GetVideoByIdApi } from "@/services/video_api"

export default function EditVideoPage() {
  const [isOpen, setIsOpen] = useState(true);
  const {videoId} = useParams<{videoId: string}>();
  const {setVideoData} = useVideoContext();

  useEffect(() => {
    // Kiểm tra nếu videoId không tồn tại, chuyển hướng về trang chủ
    if (!videoId) {
      window.location.href = '/';
    }
    const fetchVideoData = async () => {
      const videoDataResponse = await GetVideoByIdApi(videoId);
      console.log("Video data response:", videoDataResponse);
      if(!videoDataResponse) {
        console.error("Không thể lấy dữ liệu video");
        return;
      }
      if(videoDataResponse.status_code !== 200) {
        alert("Không thể lấy dữ liệu video: " + videoDataResponse.message);
        window.location.href = '/';
        return;
      }
      if(videoDataResponse.video_data.can_edit === false) {
        alert("Video này không thể chỉnh sửa");
        window.location.href = '/';
        return;
      }
      const videoData: VideoData = {
        videoId: videoDataResponse.video_data.public_id,
        videoUrl: videoDataResponse.video_data.video_url,
        title: videoDataResponse.video_data.title,
        duration: videoDataResponse.video_data.duration,
        currentTime: 0
      };
      console.log("Video data:", videoData);
      setVideoData(videoData);
    }

    fetchVideoData();
  }, [videoId, setVideoData]);
  return (
        <div className="p-5 md:px-24 lg:px-32">
          <div className="grid grid-cols-6 gap-2 justify-center">
            <div className={isOpen ? 'col-span-2' : 'col-span-1'}>
              <EditTabBar isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          <div className={isOpen ? 'col-span-4 flex flex-col p-2' : 'col-span-5 flex flex-col p-2'}>
              <Preview/>
            </div>
          </div>
        </div>
      )
}
