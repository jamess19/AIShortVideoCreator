import React, { useState } from 'react'
import {getAvailableEmojis} from "@remotion/animated-emoji";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useVideoContext } from '@/hooks/use-video-context';
import { v4 as uuidv4 } from "uuid"

const emojiList = getAvailableEmojis();

function EmojiPanel() {
  const { addEmojiAttachment, videoData } = useVideoContext()

  const handleAddEmoji = (codepoint: string) => {
    if (!videoData) return

    addEmojiAttachment({
      id: uuidv4(),
      codepoint,
      position: { x: 50, y: 50 }, // Mặc định ở giữa
      size: 64, // Kích thước mặc định
      startTime: videoData.currentTime,
      endTime: videoData.currentTime + 1, // Mặc định hiển thị đến hết video
    })
  }

  return (
    <div>
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4 bg-white">
        <div className='grid grid-cols-3 md:grid-cols-5 gap-3'>
            {emojiList.map((emoji, index) => (
                <img key={index} 
                src={"https://fonts.gstatic.com/s/e/notoemoji/latest/"+emoji.codepoint+"/512.gif"} 
                width="42" height="42"
                onClick={() => handleAddEmoji(emoji.codepoint)}
                className='hover:bg-gray-300 m-2 cursor-pointer'/>
            ))}
        </div>
    </ScrollArea>
    </div>
  )
}

export default EmojiPanel