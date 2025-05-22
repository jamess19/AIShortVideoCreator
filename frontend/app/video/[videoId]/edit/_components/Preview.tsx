import React, { useEffect,useRef, useState } from 'react';
import {Player, PlayerRef} from '@remotion/player';
import { MyVideo } from './RemotionVideo';
import { Fullscreen, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { useVideoContext } from '@/hooks/use-video-context';
import { Button } from '@/components/ui/button';
import DownloadVideo from './DownloadVideo';
import Timeline from './Timeline';
import { formatTime } from '@/lib/time';

function Preview() {
  const [screenSize, setScreenSize] = useState({
    width:800,
    height:500
  })
  const {videoData, isLoading, attachments, playerRef} = useVideoContext()
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSeek = (time: number) => {
  const frame = Math.floor(time * 30);
  playerRef.current?.seekTo(frame);
};

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
        <div>
          <DownloadVideo/>
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

    <Timeline/>
    
  
  </div>
  )
}

export default Preview