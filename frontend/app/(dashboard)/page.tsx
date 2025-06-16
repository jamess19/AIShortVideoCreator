"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoIcon, Eye, Upload, BarChart3 } from "lucide-react"
import { StatsOverview } from "@/components/stats-overview"
import { PlatformStats } from "@/components/platform-stats"
import { PerformanceChart } from "@/components/performance-chart"
import Link from "next/link"
import { getStatisticApi } from "@/services/user_api"
import { useRouter } from "next/navigation"

interface StatisticInfo{
    videoId: string,    
    viewCount: number,
    likeCount: number,
    favoriteCount: number,
    commentCount: number,
}
interface statsData {
  totalVideos: number,
  totalViews: number,
  totalLikes: number,
  totalFavorites: number,
  totalComments: number
}
export default function HomePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days")
  const [statsData, setStatsData] = useState<statsData>({
  totalVideos: 0,
  totalViews: 0,
  totalLikes: 0,
  totalFavorites: 0,
  totalComments: 0,
})
  // Load data -> call API for get stats Data
useEffect(() => {
  const fetchStats = async () => {
    try {
      const videoStatsList: StatisticInfo[] = await getStatisticApi("1");
      console.log("Kết quả trả về từ getStatisticApi:", videoStatsList);

      const totalVideos = videoStatsList.length;
      const totalViews = videoStatsList.reduce((sum, v) => sum + (v.viewCount || 0), 0);
      const totalLikes = videoStatsList.reduce((sum, v) => sum + (v.likeCount || 0), 0);
      const totalFavorites = videoStatsList.reduce((sum, v) => sum + (v.favoriteCount || 0), 0);
      const totalComments = videoStatsList.reduce((sum, v) => sum + (v.commentCount || 0), 0);

      setStatsData({
        totalVideos,
        totalViews,
        totalLikes,
        totalFavorites,
        totalComments,
      });
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
    }
  };

  fetchStats();
}, []);
  
  return (
    <div className="p-8 ml-64">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-lg text-muted-foreground">Theo dõi hiệu suất video và quản lý nội dung của bạn</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link href="/script">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <VideoIcon className="mr-2 h-4 w-4" />
                Tạo video mới
              </Button>
            </Link>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Đăng video
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={statsData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Platform Statistics */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  Thống kê theo nền tảng
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="7days">7 ngày qua</option>
                    <option value="30days">30 ngày qua</option>
                    <option value="90days">3 tháng qua</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PlatformStats stats={statsData} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/script">
                <Button className="w-full justify-start" variant="outline">
                  <VideoIcon className="mr-2 h-4 w-4" />
                  Tạo video mới
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Xem tất cả video
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Đăng video lên nền tảng
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Xem báo cáo chi tiết
              </Button>
            </CardContent>
          </Card>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất theo thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
