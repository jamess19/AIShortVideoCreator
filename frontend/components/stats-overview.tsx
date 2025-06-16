"use client"

import { Card, CardContent } from "@/components/ui/card"
import { VideoIcon, Eye, Heart, Star, Share2 } from "lucide-react"

interface StatsOverviewProps {
  stats: {
  totalVideos: number,
  totalViews: number,
  totalLikes: number,
  totalFavorites: number,
  totalComments: number
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const statItems = [
    {
      title: "Tổng video",
      value: stats.totalVideos,
      icon: VideoIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+12%",
    },
    {
      title: "Tổng lượt xem",
      value: formatNumber(stats.totalViews),
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+23%",
    },
    {
      title: "Tổng lượt Like",
      value: formatNumber(stats.totalLikes),
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
      change: "+18%",
    },
    {
      title: "Tổng lượt yêu thích",
      value: formatNumber(stats.totalFavorites),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      change: "+18%",
    },
    {
      title: "Tổng lượt comment",
      value: formatNumber(stats.totalComments),
      icon: Share2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+15%",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{item.value}</p>
                  <span className="text-xs text-green-600 font-medium">{item.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
