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
        console.error("Video data not found");
        return;
      }
      const videoData: VideoData = {
        videoId: videoDataResponse.public_id,
        videoUrl: videoDataResponse.video_url,
        title: videoDataResponse.title,
        duration: videoDataResponse.duration,
        currentTime: 0
      };
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
