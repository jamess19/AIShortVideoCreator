// components/MusicTrack.tsx
"use client"

import { useVideoContext } from "@/hooks/use-video-context"
import { Play, Pause, PlusCircle} from "lucide-react"
import { useRef, useState } from "react"
import MouseEvent from "react"
interface MusicTrackProps {
  name: string
  artist: string
  musicUrl: string
  publicId: string
}

export default function MusicTrack({ name, artist, musicUrl, publicId}: MusicTrackProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChosen, setIsChosen] = useState(false);
  const {addMusicAttachment, videoData} = useVideoContext()
  const togglePlay: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation(); 
    if (audioRef.current!.paused) {
      audioRef.current!.play();
      setIsPlaying(true);
    } else {
      audioRef.current!.pause();
      setIsPlaying(false);
    }
  };

  const addMusicHandle= () => {
    if (!videoData) return

    addMusicAttachment({
      id: 'something',
      title: name,
      artist: artist,
      url: musicUrl,  
      publicId: publicId,
      startTime: videoData.currentTime,
      endTime: videoData.currentTime + 20,
    })

  }
  return (
    <div onClick={() => {setIsChosen(!isChosen)}}         
    className={`p-3 border shadow-gray-400 shadow-sm rounded-md cursor-pointer hover:bg-gray-50 ${
       isChosen ? "border-purple-500 bg-purple-50" : "border-gray-200"
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-muted-foreground">{artist}</div>
        </div>
        <div className="flex items-center">
          <audio ref={audioRef} className="gap-2 h-8">
            <source src={musicUrl} type="audio/mp3" />
          </audio>
          <button onClick={togglePlay} className="hover:bg-gray-200">
            {isPlaying ? (<Pause className="size-5 m-2"/>) : (<Play className="size-5 m-2"/>)}
          </button>

          <button onClick={addMusicHandle} className="hover:bg-gray-200">
            <PlusCircle/>
          </button>
          
        </div>
      </div>
    </div>
  )
}
