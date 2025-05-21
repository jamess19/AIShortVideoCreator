import { useVideoContext } from '@/hooks/use-video-context'
import React, { useEffect, useRef, useState } from 'react'
import { formatTime, parseTime } from '@/lib/time'
type TimeSliderProps = {
  startTime: number,
  endTime: number,
  type: 'emoji' | 'text' | 'music',
  objectId: string,
  content: string
}

function TimeSlider( {startTime, endTime, type, objectId, content}: TimeSliderProps) {
  const {videoData, 
    updateEmojiAttachment, 
    updateTextAttachment, 
    updateCurrentTime, 
    updateMusicAttachment,
    playerRef, 
    setSelectedItem, selectedItem   
} = useVideoContext()
  const videoDuration = videoData?.duration || 100
  const [start, setStart] = useState(startTime/ videoDuration * 100)
  const [end, setEnd] = useState(endTime/ videoDuration * 100)
  const [dragging, setDragging] = useState<"start" | "end" | null>(null)
  const timeSliderRef = useRef<HTMLDivElement>(null)


  const handleMouseDown = (actionOn: 'start' | 'end') => {
    setDragging(actionOn)
  }
  const handleMouseUp = () => {
    setDragging(null)
    
    // Tính toán thời gian thật dựa trên % từ giao diện
    const newStartTime = start*videoDuration/100
    const newEndTime = end*videoDuration/100

    if(type = 'text') {
      updateTextAttachment(objectId, {
        endTime: newEndTime,
        startTime: newStartTime
      })
    }

    if(type = 'emoji') {
      updateEmojiAttachment(objectId, {
        startTime: newStartTime,
        endTime: newEndTime
      })
    }

    if(type = 'music') {
      updateMusicAttachment(objectId, {
        startTime: newStartTime,
        endTime: newEndTime
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if(!dragging) return
    const rect = timeSliderRef.current?.getBoundingClientRect()
    const x = e.clientX - rect?.left!
    const percentage = (x/rect?.width!) * 100
    const clamped = Math.min(100, Math.max(0,percentage))

    if (dragging === "start") 
    {
    setStart(Math.min(clamped, end - 1))
    } 
    else {
    setEnd(Math.max(clamped, start + 1))
    };
  } 
  useEffect(() => {
    if (dragging) {
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
  }, [dragging])

  const handleClick = () => {
  const realStartTime = start * videoDuration / 100
  updateCurrentTime(realStartTime)
  playerRef.current?.seekTo(realStartTime * 30) // vì mỗi frame dài 1/30s

  setSelectedItem({
    itemId: objectId,
    type: type === 'text' ? 'texts' : type === 'emoji' ? 'emojis' : 'musics'
  })
}

const isSelected = selectedItem?.itemId === objectId && (
  (selectedItem?.type === 'texts' && type === 'text') ||
  (selectedItem?.type === 'emojis' && type === 'emoji') ||
    (selectedItem?.type === 'musics' && type === 'music')

)
  return (
    <div className='w-full h-auto mt-2 rounded-md bg-white' ref={timeSliderRef} onClick={handleClick}>      
      <div className='relative w-full h-12 mt-2 bg-gray-100 rounded cursor-pointer'>
        {/* time range */}
        <div className={`absolute top-0 h-full 
        ${type === 'text' ? "bg-blue-300" : 
        type === 'emoji' ? "bg-yellow-300": "bg-gray-300"}`}
          style={{
            left: `${start}%`,
            width: `${end - start}%`,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {(type === 'emoji') && (
              <div>
                <img 
                src={"https://fonts.gstatic.com/s/e/notoemoji/latest/"+content+"/512.gif"} 
                style={{
                  height: 40,
                  width: 40,
                  objectFit: 'contain',
                  display: 'block',
                  pointerEvents: 'none', 
                }}
                />
              </div>
            )}

            {(type === 'text') && (
              <div>
                {content}
              </div>
            )}

        </div>

        {/* start Edit button */}
        <div
        className='absolute h-full border bg-white cursor-ew-resize rounded w-3 z-10'
        style={{ left: `${start}%` }}
        onMouseDown={() => {handleMouseDown("start")}}
        >
        </div>

        {/* end Edit button */}
        <div
        className='absolute h-full border bg-white cursor-ew-resize rounded w-3 z-10'
        style={{ left: `${end-1}%` }}
        onMouseDown={() => {handleMouseDown("end")}}

        >
        </div>
      </div>
    </div>
  )
}

export default TimeSlider