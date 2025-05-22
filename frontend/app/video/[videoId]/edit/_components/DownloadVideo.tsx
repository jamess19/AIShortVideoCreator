"use client"

import { useState } from "react"
import { useVideoContext } from "@/hooks/use-video-context"
import { Download, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DownloadVideo() {
  const { videoData } = useVideoContext()
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    if (!videoData?.videoUrl) {
      console.error("No video URL available")
      return
    }

    try {
      setDownloading(true)

      const response = await fetch(videoData.videoUrl)
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

      setDownloaded(true)

      setTimeout(() => {
        setDownloaded(false)
      }, 3000)
    } catch (error) {
      console.error("Error downloading video:", error)
    } finally {
      setDownloading(false)
    }
  }

  if (!videoData?.videoUrl) {
    return null
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={downloading}
      className={`${
        downloaded ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"
      } text-white font-medium rounded-lg p-3 transition-colors`}
    >
      {downloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : downloaded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Downloaded
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download Video
        </>
      )}
    </Button>
  )
}
