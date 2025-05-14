"use client"

import { useVideoContext } from "@/hooks/use-video-context"
import type React from "react"
import { useRef, useState } from "react"

export default function Timeline() {
  const { videoData, attachments, updateAttachment, updateCurrentTime} = useVideoContext()
  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineTrackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<{
    id: string
    type: "texts" | "emojis" | "musics"
    action: "start" | "end" | "move"
  } | null>(null)
  const [draggingTimeIndicator, setDraggingTimeIndicator] = useState(false)
  
  if (!videoData) return null

  const duration = videoData.duration
  const currentTime = videoData.currentTime
  const secondsArray = Array.from({ length: Math.ceil(duration) + 1 }, (_, i) => i)

  // Calculate position and width for timeline elements
  const getPositionAndWidth = (start: number, end: number) => {
    const left = (start / duration) * 100
    const width = ((end - start) / duration) * 100
    return { left, width }
  }

  // Get color based on element type
  const getColor = (type: string) => {
    switch (type) {
      case "texts":
        return "bg-blue-500"
      case "emojis":
        return "bg-yellow-500"
      case "musics":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => 
    {
      if (!timelineTrackRef.current || draggingTimeIndicator) return
  
      const rect = timelineTrackRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentX = (x / rect.width) * 100
      const newTime = (percentX / 100) * duration
  
      // Update the current time in the context
      updateCurrentTime(Math.max(0, Math.min(newTime, duration)))
    }
  

  // Handle text, emojis, musics on timeline element
  const handleTimelineElement = (
    e: React.MouseEvent,
    id: string,
    type: "texts" | "emojis" | "musics",
    action: "start" | "end" | "move",
  ) => {
    e.preventDefault()
    setDragging({ id, type, action })

    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current) return

      const rect = timelineRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentX = (x / rect.width) * 100
      const newTime = (percentX / 100) * duration

      const element = attachments[type].find((el) => el.id === id)
      if (!element) return

      if (action === "start") {
        updateAttachment(type, id, {
          startTime: Math.max(0, Math.min(newTime, element.endTime - 0.1)),
        })
      } else if (action === "end") {
        updateAttachment(type, id, {
          endTime: Math.max(element.startTime + 0.1, Math.min(newTime, duration)),
        })
      } else if (action === "move") {
        const elementDuration = element.endTime - element.startTime
        let newStart = Math.max(0, newTime - elementDuration / 2)
        let newEnd = newStart + elementDuration

        if (newEnd > duration) {
          newEnd = duration
          newStart = newEnd - elementDuration
        }

        updateAttachment(type, id, {
          startTime: newStart,
          endTime: newEnd,
        })
      }
    }

    const handleMouseUp = () => {
      setDragging(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleTimeIndicatorDrag = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent triggering timeline click
    setDraggingTimeIndicator(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineTrackRef.current) return

      const rect = timelineTrackRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentX = (x / rect.width) * 100
      const newTime = (percentX / 100) * duration

      // Update the current time in the context
      updateCurrentTime(Math.max(0, Math.min(newTime, duration)))
    }

    const handleMouseUp = () => {
      setDraggingTimeIndicator(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="p-4 h-full" ref={timelineRef}>
      <div className="mb-2">
        {/* Time */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-500">
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, "0")}{" "}
          </div>
          <div className="text-xs text-gray-500">
            {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, "0")}
          </div>
        </div>

      {/* edit text */}
        <div className="relative h-10 bg-gray-100 rounded-md overflow-hidden">        
          {attachments.texts.map((text) => {
            const { left, width } = getPositionAndWidth(text.startTime, text.endTime)
            return (
            <div key={text.id} className={`absolute h-full rounded-md cursor-move flex items-center px-2 overflow-hidden ${getColor("texts")}`}
                style={{ left: `${left}%`, width: `${width}%` }}
                onMouseDown={(e) => handleTimelineElement(e, text.id, "texts", "move")}>
                  <div 
                  className="absolute left-0 top-0 w-2 h-full bg-black/20 cursor-w-resize"
                  onMouseDown={(e) => handleTimelineElement(e, text.id, "texts", "start")}/>

                  <div 
                  className="absolute right-0 top-0 w-2 h-full bg-black/20 cursor-e-resize"
                  onMouseDown={(e) => handleTimelineElement(e, text.id, "texts", "end")}/>
                
              </div>)})}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-500">
            {Math.floor(currentTime / 60)} : {Math.floor(currentTime % 60).toString().padStart(2, "0")}{" "}
          </div>
          <div className="text-xs text-gray-500">
            {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, "0")}
          </div>
      </div>
          <div className="relative h-10 bg-gray-100 rounded-md overflow-hidden">
            {attachments.emojis.map((emoji) => {
              const { left, width } = getPositionAndWidth(emoji.startTime, emoji.endTime)
              return (
                <div
                  key={emoji.id}
                  className={`absolute h-full rounded-md cursor-move flex items-center justify-center px-2 overflow-hidden ${getColor("emojis")}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  onMouseDown={(e) => handleTimelineElement(e, emoji.id, "emojis", "move")}
                >
                  <div className="text-xs">
                    <img
                      src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${emoji.codepoint}/32.gif`}
                      alt="Emoji"
                      className="w-6 h-6"
                    />
                  </div>
                  {/* Resize handles */}
                  <div
                    className="absolute left-0 top-0 w-2 h-full bg-black/20 cursor-w-resize"
                    onMouseDown={(e) => handleTimelineElement(e, emoji.id, "emojis", "start")}
                  ></div>
                  <div
                    className="absolute right-0 top-0 w-2 h-full bg-black/20 cursor-e-resize"
                    onMouseDown={(e) => handleTimelineElement(e, emoji.id, "emojis", "end")}
                  ></div>
                </div>
              )
            })}
          </div>
        </div>
        </div>
  )
}
