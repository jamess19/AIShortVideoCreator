import React, { useEffect,useRef, useState } from 'react';
import {Player, PlayerRef} from '@remotion/player';
import { MyVideo } from './RemotionVideo';
import { Fullscreen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { useVideoContext } from '@/hooks/use-video-context';

function Preview() {
  const [screenSize, setScreenSize] = useState({
    width:700,
    height:400
  })
  const {videoData, isLoading, attachments, updateCurrentTime} = useVideoContext()

  if (isLoading || !videoData) return <p>Loading video...</p>;


  return (
  <div>
    <div className="flex items-center justify-center relative">
        <Player
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

    <div className="flex items-center mt-2 gap-2 ">
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
  </div>
  )
}

export default Preview