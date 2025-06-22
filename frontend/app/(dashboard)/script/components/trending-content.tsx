"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Youtube, TrendingUp } from "lucide-react"

interface TrendingContentProps {
  contents: any[]
  onSelect: (content: any) => void
}

export function TrendingContent({ contents, onSelect }: TrendingContentProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")

  const platforms = [
    { id: "all", name: "Tất cả" },
    { id: "youtube", name: "YouTube" },
    { id: "tiktok", name: "TikTok" },
  ]

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-600" />
      case "tiktok":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
              fill="currentColor"
            />
          </svg>
        )
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map((content) => (
          <Card key={content.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <img
                src={content.thumbnailUrl || "/placeholder.svg"}
                alt={content.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">{content.viewCount} lượt xem</span>
                </div>
                <h3 className="font-medium mb-2">{content.title}</h3>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0 h-8"
                  onClick={() => onSelect(content)}
                >
                  Chọn nội dung này
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
