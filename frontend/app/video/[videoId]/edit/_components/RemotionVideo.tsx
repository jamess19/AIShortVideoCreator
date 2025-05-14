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

  const {
    updateTextAttachment,
    updateEmojiAttachment,
    removeAttachment, updateCurrentTime
  } = useVideoContext()

  const [selectedItem, setSelectedItem] = useState<
  {
    itemId: string;
    type: "texts" | "emojis";
    isChosen: boolean
  } | null>(null);

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
    type: "text" | "emoji"
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

  if (!videoUrl) {
    return (
      <AbsoluteFill>
        <div style={{ color: "red" }}>No video URL provided.</div>
      </AbsoluteFill>
    )
  }
  // lấy các attachment có ở thời điểm hiện tại trong video
  const visibleTexts = attachments.texts.filter(
      (text) => currentTimeInSeconds >= text.startTime && currentTimeInSeconds <= text.endTime,
    )
      
  const visibleEmojis = attachments.emojis.filter(
    (emoji) => currentTimeInSeconds >= emoji.startTime && currentTimeInSeconds <= emoji.endTime)

  const visibleMusics = attachments.musics.filter((music) => {
    music.startTime <= currentTimeInSeconds && music.endTime >= currentTimeInSeconds
  })

      return (
        <AbsoluteFill className='rounded-sm bg-black'   ref={wrapperRef}>
          <Video className='w-full h-full' src={videoUrl}/>
          {visibleTexts.map((text) => (
            <div
            key={text.id}
              draggable
              onDragEnd={(e) => handleDrag(e, text.id, "text")}
              onClick={() => {
                setSelectedItem({
                  itemId: text.id,
                  type: "texts",
                  isChosen: true
                });
              }}
              style={{
                position: "absolute",
                left: `${text.position.x}%`,
                top: `${text.position.y}%`,
                fontSize: `${text.style.fontSize}px`,
                color: text.style.color,
                fontFamily: text.style.fontFamily,
                transform: "translate(-50%, -50%)",
                border: selectedItem?.isChosen === true ? "2px solid blue" : "none",
                cursor: "move",
              }}        >
          {text.content}
          {selectedItem?.isChosen === true && (
            <X
              className="absolute top-[-10px] right-[-10px] text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-300"
              onClick={() => removeAttachment("texts", text.id)}
            />
          )}
        </div>
      ))}

      {visibleEmojis.map((emoji) => (
      <div
         key={emoji.id}
         draggable
         onDragEnd={(e) => handleDrag(e, emoji.id, "emoji")}
         onClick={() => {
          setSelectedItem({
            itemId: emoji.id,
            type: "emojis",
            isChosen: true
          });
        }}
         style={{
           position: "absolute",
           left: `${emoji.position.x}%`,
           top: `${emoji.position.y}%`,
           transform: "translate(-50%, -50%)",
           border: selectedItem?.isChosen === true ? "2px solid blue" : "none", 
           cursor: "move",
         }}>
         <img
           src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${emoji.codepoint}/512.gif`}
           alt="Emoji"
           style={{
             width: `${emoji.size}px`,
             height: `${emoji.size}px`,
           }}
         />
        {selectedItem?.isChosen === true && (
          <X
            className="absolute top-[-10px] right-[-10px] font-bold text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-300"
            onClick={() => removeAttachment("emojis", emoji.id)}
          />
        )}
        </div>
      ))}
        </AbsoluteFill>
      );
}
