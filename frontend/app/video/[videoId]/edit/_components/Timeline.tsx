"use client"

import { useVideoContext } from "@/hooks/use-video-context"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import TimeSlider from "./TimeSlider"
import { formatTime } from "@/lib/time"

export default function Timeline() {
  const {videoData, attachments, playerRef, updateCurrentTime} = useVideoContext() 
  const videoDuration = videoData?.duration || 1
  const currentTime = videoData?.currentTime || 0
  const cursorPosition = currentTime/videoDuration * 100
  const [isDragging, setDragging] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)


  const handleCursorMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent timeline click
    setDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if(!isDragging || !timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x/rect.width * 100
    const clampedPercentage = Math.min(100, Math.max(0, percentage))

    const newTime = (clampedPercentage / 100) * videoDuration
    updateCurrentTime(newTime)
  playerRef.current?.seekTo(newTime*30);
  }

    const handleMouseUp = () => {
    setDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])


  return (
  <div className="relative w-full h-64px" ref={timelineRef} >
    <div className='flex justify-between mt-4'>
      <span className=''>{formatTime(0)}</span>
      <span className=''>{formatTime(Math.floor(videoDuration! / 4))}</span>
      <span className=''>{formatTime(Math.floor(videoDuration! / 2))}</span>
      <span className=''>{formatTime(Math.floor((3 * videoDuration!) / 4))}</span>
      <span className=''>{formatTime(Math.floor(videoDuration!))}</span>
      </div>
      {/* timeline ruler */}
        <div className='m-2'>
          <div className='w-full flex justify-between items-center h-2 bg-gray-200 border-r border-l'>
            {[...Array(20)].map((_, i) => (
                  <div key={i} className="h-2 w-px bg-gray-400 m-auto"></div>
            ))}
          </div>
      </div>
      {/* attachmens  */}
    <div className="overflow-y-auto overflow-x-hidden max-h-64 space-y-2">
      <div>
      {attachments.emojis.map((emoji) => (
        <TimeSlider startTime={emoji.startTime} endTime={emoji.endTime} type="emoji" objectId={emoji.id} content={emoji.codepoint}/>
      ))}
      </div>

      <div>
        {attachments.texts.map((text) => (
          <TimeSlider startTime={text.startTime} endTime={text.endTime} type="text" objectId={text.id} content={text.content}/>
        ))}
      </div>

      <div>
        {attachments.musics.map((music) => (
          <TimeSlider startTime={music.startTime} endTime={music.endTime} type="music" objectId={music.id} content={music.title}/>
        ))}
      </div>
    </div>

    {/* indicator */}
    <div className="absolute top-8 w-4 z-20"
          style={{
            left: `${cursorPosition}%`,
            height: "90%",
            transform: "translateX(-50%)",
            pointerEvents: "none", 
          }}
        >
          <div
            className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-500 transform -translate-x-1/2"
            style={{ pointerEvents: "none" }}
          ></div>

          <div
            className="absolute -top-4 left-1/2 w-6 h-6 bg-red-500 rounded-full transform -translate-x-1/2 cursor-ew-resize flex items-center justify-center"
            style={{ pointerEvents: "auto" }}
            onMouseDown={handleCursorMouseDown}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>

          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {formatTime(Math.floor(currentTime))}
          </div>
        </div>


  </div>  
)
}
