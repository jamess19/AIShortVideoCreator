import { useVideoContext, videoAttachments } from '@/hooks/use-video-context';
import React, { useEffect, useRef, useState } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, Video } from 'remotion';
import { X } from 'lucide-react';

interface videoProps {
  videoUrl: string, 
  attachments: videoAttachments,
}
export const MyVideo = ({videoUrl, attachments}: videoProps) => {  
  const frame = useCurrentFrame()
  const currentTimeInSeconds = frame / 30
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    updateTextAttachment,
    updateEmojiAttachment,
    removeAttachment, updateCurrentTime,
    selectedItem,
    setSelectedItem
  } = useVideoContext()


  useEffect(() => {
      const video = videoRef.current
      if(!video)
        return
      
      const handleTimeUpdate = () => {
        updateCurrentTime(videoRef.current?.currentTime!)
      }

      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate)
      }
    })

    useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setSelectedItem(null);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleDrag = (
    e: React.DragEvent<HTMLDivElement>,
    id: string,
    type: "text" | "emoji" | "music"
  ) => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect()
    if (!rect) return

    const xPercent = ((e.clientX - rect.left) / rect.width) * 100
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100

    if (type === "text") {
      updateTextAttachment(id, { position: { x: xPercent, y: yPercent } })
    } else {
      updateEmojiAttachment(id, { position: { x: xPercent, y: yPercent } })
    }
  }
  
    const visibleTexts = attachments.texts.filter(
      (text) => currentTimeInSeconds >= text.startTime && currentTimeInSeconds <= text.endTime,
    )
      
  const visibleEmojis = attachments.emojis.filter(
    (emoji) => currentTimeInSeconds >= emoji.startTime && currentTimeInSeconds <= emoji.endTime)

  const visibleMusics = attachments.musics.filter((music) => {
    music.startTime <= currentTimeInSeconds && music.endTime >= currentTimeInSeconds
  })


  if (!videoUrl) {
    return (
      <AbsoluteFill>
        <div style={{ color: "red" }}>No video URL provided.</div>
      </AbsoluteFill>
    )
  }
      return (
        <AbsoluteFill className='rounded-sm bg-black'   ref={wrapperRef}>
          <Video className='w-full h-full' src={videoUrl} ref={videoRef} />
          {visibleTexts.map((text) => 
          {
            const isSelected = selectedItem?.itemId === text.id && selectedItem.type === 'texts'
            
            return (<div
            key={text.id}
            
              draggable
              onDragEnd={(e) => handleDrag(e, text.id, "text")}
              onClick={(e) => {
              e.stopPropagation();
              setSelectedItem({
                itemId: text.id,
                type: "texts",
              });
            }}
              style={{
              position: "absolute",
              left: `${text.position.x}%`,
              top: `${text.position.y}%`,
              transform: "translate(-50%, -50%)",
              cursor: "move",
              border: isSelected ? "2px solid blue" : "none",
              borderRadius: "8px", // bo viền tròn đẹp hơn
              padding: "2px",
              }}        >
          {text.content}
          {isSelected && (
            <X
              className="absolute top-[-10px] right-[-10px] text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-300"
              onClick={() => removeAttachment("texts", text.id)}
            />
          )}
        </div>)
      })}
      {visibleEmojis.map((emoji) => {
        // Kiểm tra emoji này có đang được chọn không
        const isSelected = selectedItem?.itemId === emoji.id && selectedItem?.type === "emojis";

        return (
          <div
            key={emoji.id}
            draggable
            onDragEnd={(e) => handleDrag(e, emoji.id, "emoji")}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem({
                itemId: emoji.id,
                type: "emojis",
              });
            }}
            style={{
              position: "absolute",
              left: `${emoji.position.x}%`,
              top: `${emoji.position.y}%`,
              transform: "translate(-50%, -50%)",
              cursor: "move",
              border: isSelected ? "2px solid blue" : "none",
              borderRadius: "8px", // bo viền tròn đẹp hơn
              padding: "2px",
            }}
          >
            <img
              src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${emoji.codepoint}/512.gif`}
              alt="Emoji"
              style={{
                width: `${emoji.size}px`,
                height: `${emoji.size}px`,
                display: "block",
              }}
            />

            {isSelected && (
              <X
                className="absolute top-[-10px] right-[-10px] text-red-500 hover:text-red-700 cursor-pointer bg-white rounded-full"
                size={16}
                onClick={(e) => {
                  e.stopPropagation(); 
                  removeAttachment("emojis", emoji.id);
                  setSelectedItem(null); // bỏ chọn emoji khi xóa
                }}
              />
            )}
          </div>
        );
      })}
      </AbsoluteFill>
      );
}
