"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Youtube } from "lucide-react"

interface StatsDataProps {
  stats: {
  totalVideos: number,
  totalViews: number,
  totalLikes: number,
  totalFavorites: number,
  totalComments: number
  }
}

export function PlatformStats({stats}: StatsDataProps) {
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
      data: stats,
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
                </div>
              </div>

              <div className="flex space-x-6 text-right">
                <div>
                  <p className="text-sm text-muted-foreground">Video</p>
                  <p className="font-bold">{platform.data.totalVideos}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lượt xem</p>
                  <p className="font-bold">{formatNumber(platform.data.totalViews)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Like</p>
                  <p className="font-bold">{formatNumber(platform.data.totalLikes)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Favorite</p>
                  <p className="font-bold">{formatNumber(platform.data.totalFavorites)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Comment</p>
                  <p className="font-bold">{formatNumber(platform.data.totalComments)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
