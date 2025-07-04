"use client"

import { useState } from "react"
import { useVideoContext } from "@/hooks/use-video-context"
import { Download, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Video } from "@/lib/models"
import { toast } from "sonner"

export default function DownloadVideo({videoData} : {videoData: Video}) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    if (!videoData?.video_url) {
      console.error("No video URL available")
      return
    }

    try {
      setDownloading(true)

      const response = await fetch(videoData.video_url)
      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url

      const filename = videoData.title
        ? `${videoData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.mp4`
        : "downloaded_video.mp4"

      a.download = filename

      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setTimeout(() => {
      toast.success(
        <span className="flex items-center gap-2">
          Tải video thành công!
        </span>,
        { duration: 7000 }
          )
      setDownloaded(true);
          setTimeout(() => {
            setDownloaded(false);
          }, 5000);
        }, 1500);

    } catch (error) {
    toast.error("Tải video thất bại!", { duration: 5000 })
      console.error("Error downloading video:", error)
    } finally {
      setDownloading(false)
    }
  }

  if (!videoData?.video_url) {
    return null
  }

  return (
    <button
    onClick={e => {
          e.stopPropagation();
          handleDownload();
        }}
      disabled={downloading}
      className={`${
        downloaded ? "bg-green-600 hover:bg-green-700" : "bg-white hover:bg-gray-200"
      } font-medium rounded-lg transition-colors cursor-pointer text-gray-800 px-3 py-1.5 flex items-center gap-1 text-sm w-28 justify-center`}
    >
      {downloading ? (
        <>
          <Loader2 size={14} className="m-auto text-sm animate-spin" />
          Downloading...
        </>
      ) : downloaded ? (
        <>
          <Check size={14} className="m-auto text-sm" />
          Downloaded
        </>
      ) : (
        <>
          <Download size={14} className="m-auto text-sm" />
          Download
        </>
      )}
    </button>
  )
}
