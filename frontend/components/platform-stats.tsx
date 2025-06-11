"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Youtube, Facebook } from "lucide-react"

interface PlatformStatsProps {
  platforms: {
    youtube: { videos: number; views: number; subscribers: number }
    tiktok: { videos: number; views: number; followers: number }
    facebook: { videos: number; views: number; followers: number }
  }
}

export function PlatformStats({ platforms }: PlatformStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const platformData = [
    {
      name: "YouTube",
      icon: Youtube,
      color: "text-red-600",
      bgColor: "bg-red-100",
      data: platforms.youtube,
      followerLabel: "subscribers",
    },
    {
      name: "TikTok",
      icon: () => (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      color: "text-black",
      bgColor: "bg-gray-100",
      data: platforms.tiktok,
      followerLabel: "followers",
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      data: platforms.facebook,
      followerLabel: "followers",
    },
  ]

  return (
    <div className="space-y-4">
      {platformData.map((platform, index) => (
        <Card key={index} className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${platform.bgColor}`}>
                  <platform.icon className={`h-6 w-6 ${platform.color}`} />
                </div>
                <div>
                  <h3 className="font-medium">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(platform.data[platform.followerLabel as keyof typeof platform.data])}{" "}
                    {platform.followerLabel}
                  </p>
                </div>
              </div>

              <div className="flex space-x-6 text-right">
                <div>
                  <p className="text-sm text-muted-foreground">Video</p>
                  <p className="font-bold">{platform.data.videos}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lượt xem</p>
                  <p className="font-bold">{formatNumber(platform.data.views)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
