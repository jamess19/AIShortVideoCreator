"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getVideoMetadata } from "@remotion/media-utils"

export interface Position {
    x: number
    y: number
}
// Định nghĩa kiểu dữ liệu cho video
export interface VideoData {
  videoId: string
  videoUrl: string
  title: string
  duration: number
  currentTime: number
}
// xử lý cái attachment trong video
export interface videoAttachments {
    texts: TextAttachment[]
    emojis: EmojiAttachment[]
    musics: MusicAttachment[]
}

export interface TextAttachment {
    id: string
    content: string
    position:Position
    style: 
    {
        fontSize: number
        color: string
        fontFamily: string
    }
    startTime: number
    endTime: number
}

export interface EmojiAttachment {
    id: string
    codepoint: string
    position: Position
    size: number
    startTime: number
    endTime: number
}

export interface MusicAttachment {
    id: string
    url: string
    title: string
    artist: string
    startTime: number
    endTime: number
  }


interface VideoContextType {
  videoData: VideoData | null
  setVideoData: React.Dispatch<React.SetStateAction<VideoData | null>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>

  attachments: videoAttachments
  addTextAttachment: (text: TextAttachment) => void
  updateTextAttachment: (id: string, updates: Partial<TextAttachment>) => void
  addEmojiAttachment: (emoji: EmojiAttachment) => void
  updateEmojiAttachment: (id: string, updates: Partial<EmojiAttachment>) => void
  addMusicAttachment: (music: MusicAttachment) => void
  removeAttachment: (type: "texts" | "emojis" | "musics", id: string) => void
  updateAttachment: (type: "texts" | "emojis" | "musics", id: string, data: any) => void
  updateCurrentTime: (time: number) => void
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

export function VideoProvider(
    {
        children,
        videoId,
      }: {
        children: React.ReactNode;
        videoId: string;
      }
) {
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<videoAttachments>({
    texts: [
        {
            id: "text-1",
            content: "Xin chào!",
            startTime: 1,
            endTime: 4,
            position: { x: 50, y: 40 },
            style: {
                fontSize: 40,
                color: "#ffffff",
                fontFamily: "Arial"}
        },
        {
            id: "text-2",
            content: "Chào mừng đến với Remotion!",
            startTime: 5,
            endTime: 8,
            position: { x: 50, y: 60 },
            style: {
              fontSize: 32,
              color: "#00ffcc",
              fontFamily: "Verdana"
            }
        }
    ],
    emojis: [
        {
            id: "emoji-1",
            codepoint: "1f600", // 😀
            startTime: 2,
            endTime: 6,
            size: 64,
            position: { x: 20, y: 50 }
          },
          {
            id: "emoji-2",
            codepoint: "1f389", // 🎉
            startTime: 6,
            endTime: 9,
            size: 72,
            position: { x: 80, y: 30 }
          }
    ],
    musics: [
        {
            id: "music-1",
            title: 'name',
            artist: 'someone',
            startTime: 0,
            endTime: 10,
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          }
    ]
  })
  // Fetch video data khi component được mount hoặc khi videoId thay đổi
  useEffect(() => {
          const getVideoById = async (videoId: string) => {
            setIsLoading(true);
  
          //   try {
          //     const response = await axios.get(`http://localhost:8000/api/v1/video/${videoId}`);
          //     setVideo(response.data);
          //   } catch (error) {
          //     setError('Failed to get video, please try again!');
          //     console.error('Error in get video:', error);
          //   } finally {
          //     setIsLoading(false);
          //   }
          
          const sampleVideo: VideoData = {
              videoId: videoId || '123',
              videoUrl: "https://res.cloudinary.com/dzgatscqu/video/upload/v1746938916/NO%CC%9BI_NA%CC%80Y_CO%CC%81_ANH_-_SO%CC%9BN_TU%CC%80NG_MTP_gcjobl.mp4", // Sample MP4 URL
              title: 'Sample Video',
              duration: 0,
              currentTime: 0
            };
            const metaData = await getVideoMetadata(sampleVideo?.videoUrl!)
            sampleVideo.duration = metaData.durationInSeconds
            setVideoData(sampleVideo)
            setIsLoading(false);
          };
      
          if (videoId) {
            getVideoById(videoId);
          } else {
            setIsLoading(false);
          }
          
        }, [videoId]);

    // Cầm fetch những text, emoji, music đang có của video nữa

    // định nghĩa các hàm thực hiện
    const addTextAttachment = (text: TextAttachment) => {
        setAttachments((prev) => ({
            ...prev, texts: [...prev.texts, text],
        }))
    }

    const updateTextAttachment = (id: string, updates: Partial<TextAttachment>) => {
        setAttachments((prev) => ({
          ...prev,
          texts: prev.texts.map((text) => (text.id === id ? { ...text, ...updates } : text)),
        }))
      }

    const addEmojiAttachment = (emoji: EmojiAttachment) => {
        setAttachments((prev) => ({
            ...prev, emojis: [...prev.emojis, emoji],
        }))
    }

    const updateEmojiAttachment = (id: string, updates: Partial<EmojiAttachment>) => {
        setAttachments((prev) => ({
          ...prev,
          emojis: prev.emojis.map((emoji) => (emoji.id === id ? { ...emoji, ...updates } : emoji)),
        }))
    }

    const addMusicAttachment = (music: MusicAttachment) => {
        setAttachments((prev) => ({
          ...prev,
          musics: [...prev.musics, music],
        }))
      }

    const removeAttachment = (type: "texts" | "emojis" | "musics", id: string) => {
        setAttachments((prev) => ({
            ...prev,
            [type]: prev[type].filter((item) => item.id !== id),
          }))
    }

    const updateAttachment = (type: "texts" | "emojis" | "musics", id: string, data: any) => {
        setAttachments((prev) => ({
            ...prev,
            [type]: prev[type].map((item) => (item.id === id ? { ...item, ...data } : item)),
        }))
    }
    const updateCurrentTime = (time: number) => {
        if (videoData) {
          setVideoData({
            ...videoData,
            currentTime: time,
          })
        }
      }

    const value = {
        videoData,
        setVideoData,
        isLoading,
        setIsLoading,
        attachments,
        addTextAttachment,
        updateTextAttachment,
        addEmojiAttachment,
        updateEmojiAttachment,
        addMusicAttachment,
        removeAttachment,
        updateAttachment,
        updateCurrentTime
  }

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
}

// Hook để sử dụng context
export function useVideoContext() {
  const context = useContext(VideoContext)
  if (context === undefined) {
    throw new Error("useVideoContext must be used within a VideoProvider")
  }
  return context
}
