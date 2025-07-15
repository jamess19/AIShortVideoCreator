"use client"
import React, {  useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {Player} from '@remotion/player';
import { MyVideo } from './RemotionVideo';
import { Fullscreen, Save, Loader2, Check, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { useVideoContext } from '@/hooks/use-video-context';
import { Button } from '@/components/ui/button';
import DownloadVideo from './DownloadVideo';
import Timeline from './Timeline';
import { EditVideoApi } from '@/services/video_api';
import { text } from 'stream/consumers';
import { toast } from "sonner";

function Preview() {
  const router = useRouter();
  const [screenSize, setScreenSize] = useState({
                                width:800,
                                height:500
                              })
  const {videoData, isLoading, attachments,
       playerRef} = useVideoContext()
  const [isPlaying, setIsPlaying] = useState(false)
  const[isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (videoData) {
      const durationInFrames = Math.floor(videoData.duration * 30);
      console.log('Video duration in frames:', durationInFrames);
    }
  }, [videoData]);

//   const handleSeek = (time: number) => {
//   const frame = Math.floor(time * 30);
//   playerRef.current?.seekTo(frame);
// };
  const HandleSaveVideo = async () => {
    if (!videoData) return;
    setIsSaving(true);
    try {
      const request = {
        public_id: videoData.videoId,
        userId: sessionStorage.getItem('username') || 'anonymous',
        text_attachments: attachments.texts.map((text_attachment) => ({
          text: text_attachment.content,
          start_time: text_attachment.startTime,
          end_time: text_attachment.endTime,
          position: {
            x: text_attachment.position.x / 100,
            y: text_attachment.position.y / 100,
          },
          font_size: text_attachment.style.fontSize,
          font_family: text_attachment.style.fontFamily,
          color_hex: text_attachment.style.color,
        })),
        emoji_attachments: attachments.emojis.map((emoji_attachment) => ({
          emoji: "",
          start_time: emoji_attachment.startTime,
          end_time: emoji_attachment.endTime,
          codepoint: emoji_attachment.codepoint,
          position: {
            x: emoji_attachment.position.x / 100,
            y: emoji_attachment.position.y /100,
          },
          size: emoji_attachment.size
        })),
      }
      console.log('Request to save video:', request);

      const response = await EditVideoApi(request);
      if(response.secure_url !== ""){
        toast.success("Video saved successfully!");
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
        }, 3000);
      }
      router.push(`/my-videos`);
    } catch (error) {
      console.error('Error saving video:', error);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !videoData) return <p>Loading video...</p>;
  

  return (
  <div className='w-full mx-2'>
    <div className='flex items-center justify-between mb-2 w-full'>
      <div className="flex items-center gap-2 ">
          <Fullscreen/>
          <Select onValueChange={(v) => setScreenSize(JSON.parse(v))}>
            <SelectTrigger className="w-[180px] z-10">
              <SelectValue placeholder="16:9" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem className='hover:bg-gray-200' value={JSON.stringify({width:500, height:500})}>1:1</SelectItem>
              <SelectItem className='hover:bg-gray-200' value={JSON.stringify({width:700, height:400})}>16:9</SelectItem>
              <SelectItem className='hover:bg-gray-200' value={JSON.stringify({width:400, height:600})}>9:16</SelectItem>
            </SelectContent>
          </Select> 
        </div>
        <div
          className="flex items-center gap-2">
          <Button
            onClick={HandleSaveVideo}
            variant="outline"
            disabled={isSaving || isSaved}
            className={`${
              isSaved ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"
            } text-white font-medium rounded-lg p-3 transition-colors`}
          >
          {isSaving ? (
            <Loader2 className="animate-spin" />
          ) : isSaved ? (
            <Check className="text-white" />
          ) : (
            <Save className="text-white" />
          )}
              Save
          </Button>
          {/* <DownloadVideo/> */}
        </div>

    </div>


    <div className="flex items-center justify-center relative">
        <Player
          ref={playerRef}
          className='rounded-sm'
          component={MyVideo} 
          durationInFrames={Math.floor(videoData.duration * 30)}
          compositionWidth={screenSize.width} 
          compositionHeight={screenSize.height} 
          fps={30}
          inputProps={{
            videoUrl: videoData.videoUrl,
            attachments: attachments,
          }}
          controls     
          />
    </div>

    <Timeline />
    
  
  </div>
  )
}

export default Preview