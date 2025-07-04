"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Video,
  Upload,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Clock,
  Calendar1Icon,
} from "lucide-react"
import {
  AreaChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
 import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { TotalStats, TimelyCountData, TopVideo, VideoCountRequest, mockVideoData7Days, monthlyData } from "./model"
import { getAllVideosStats, getTimelyCountStats } from "@/services/statistic_api"
import { GetVideosApi } from "@/services/video_api"

const FILTER_OPTIONS = {
  day: [
    { value: "last_7_days", label: "7 ngày qua" },
    { value: "last_30_days", label: "30 ngày qua" },
    { value: "custom", label: "Tùy chọn" },
  ],
  month: [
    { value: "last_3_months", label: "3 tháng qua" },
    { value: "last_6_months", label: "6 tháng qua" },
    { value: "custom", label: "Tùy chọn" },
  ],
  year: [
    { value: "last_year", label: "1 năm qua" },
    { value: "last_3_years", label: "3 năm qua" },
    { value: "custom", label: "Tùy chọn" },
  ],
}

export default function AnalyticsDashboard() {
  const [overviewData, setoverviewData] = useState<TotalStats>({
    totalVideos: 0,
    uploadedVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalFavorites: 0,
    totalComments: 0,            

  })
  const [chartData, setChartData] = useState<TimelyCountData[]>([]);
   const [videoCountRequest, setvideoCountRequest] = useState<VideoCountRequest>({
    time_unit: "day",
    time_range: "last_7_days",
    start_date: undefined,
    end_date: undefined,
  });
  const [currentVideo, setCurrentVideo] = useState<TopVideo[]>([])

  useEffect( () =>  {
      const fetchTotalStats = async () => {
        try {
        const [totalStatsRes, timelyStatsRes, currentVideosRes ] = await Promise.all([
          getAllVideosStats(),
          getTimelyCountStats(videoCountRequest),
          GetVideosApi({
            page_size: 5,
            current_page_number: 1,
            user_id: '',
            status: '',
            title: '',
          })
      ]);

        if(totalStatsRes) {
          setoverviewData({
          totalVideos: totalStatsRes.total_videos,
          uploadedVideos: totalStatsRes.total_youtube_uploaded_videos,
          totalViews: totalStatsRes.statistics_info.view_count,
          totalLikes: totalStatsRes.statistics_info.like_count,
          totalFavorites: totalStatsRes.statistics_info.favorite_count,
          totalComments: totalStatsRes.statistics_info.comment_count,            
          })
        } 

        if (timelyStatsRes) {
            setChartData(timelyStatsRes.timely_video_count);

        }
        if (currentVideosRes && currentVideosRes.items) {
            const mappedVideos: TopVideo[] = currentVideosRes.items.map((item: any) => {
              const firstUpload = item.uploaded_info?.[0];
              return {
                public_id: item.public_id,
                title: item.title,
                status: item.status,
                duration: item.duration,
                updated_at: item.updated_at,
                uploadedAt: firstUpload?.uploadedAt || "",
                view_count: firstUpload?.statistics_info?.view_count ?? 0,
                like_count: firstUpload?.statistics_info?.like_count ?? 0,
                favorite_count: firstUpload?.statistics_info?.favorite_count ?? 0,
                comment_count: firstUpload?.statistics_info?.comment_count ?? 0,
              };
            });
            setCurrentVideo(mappedVideos);
          }
       } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      }
    }
    fetchTotalStats()
    }, [])

const handleViewClick = async () => {
  // try {
    // const res = await getTimelyCountStats(videoCountRequest);
  //   setChartData(res.timely_video_count);
  //   console.log("Kết quả thống kê:", res);
  // } catch (error) {
  //   console.error("Lỗi khi lấy thống kê theo thời gian:", error);
  // }
};


  return (
    <div className="min-h-screen p-8 ml-64 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Video Analytics</h1>
            <p className="text-slate-600 mt-1">Thống kê toàn diện cho nền tảng tạo video AI</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white ">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Tổng Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{overviewData.totalVideos.toLocaleString()}</div>
                </div>
                <Video className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Đã Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{overviewData.uploadedVideos.toLocaleString()}</div>
                </div>
                <Upload className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Tổng Lượt Xem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{overviewData.totalViews}</div>
                </div>
                <Eye className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md bg-white border-1 border-gray-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tổng Likes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{overviewData.totalLikes}</div>
                <Heart className="w-5 h-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-white border-1 border-gray-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tổng Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{overviewData.totalComments}</div>
                <MessageCircle className="w-5 h-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-white border-1 border-gray-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tổng Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{overviewData.totalFavorites}</div>
                <Share2 className="w-5 h-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Chart */}
          <Card className="lg:col-span-2 shadow-md bg-white border-1 border-gray-300">
            {/* Sử lý header, nút sort */}
            <CardHeader>
                <div className="flex flex-col justify-center">
                <div>
                  <CardTitle>Xu Hướng Hiệu Suất</CardTitle>
                  <CardDescription>Thống kê likes, views và comments theo thời gian</CardDescription>
                </div>

                <div className="flex gap-2 mt-4">
                {/* Chọn time_unit muốn xem (day, month, year)*/}
                <Select
                    value={videoCountRequest.time_unit}
                    onValueChange={(value) => setvideoCountRequest(prev => ({ ...prev, time_unit: value }))}>
                    <SelectTrigger className="w-35 bg-white">
                    <SelectValue placeholder="khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="day">Theo ngày</SelectItem>
                      <SelectItem value="month">Theo tháng</SelectItem>
                      <SelectItem value="year">Theo năm</SelectItem>
                    </SelectContent>
                </Select>
                {/* Hiển thị time_range option tuơng ứng */}
                {videoCountRequest.time_unit && (
                <div className="flex gap-2">
                  <Select
                    value={videoCountRequest.time_range}
                    onValueChange={(value) =>
                      setvideoCountRequest((prev) => ({ ...prev, time_range: value }))
                    }
                  >
                    <SelectTrigger className="w-35 bg-white h-8">
                      <SelectValue placeholder="Khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {(FILTER_OPTIONS[videoCountRequest.time_unit as 'day' | 'month' | 'year']).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* nếu chọn custom thì hiển thị chọn thời gian */}
              {/* Chưa xử lý cho tháng, năm */}
              {videoCountRequest.time_range === 'custom' && videoCountRequest.time_unit === 'day' && (
              <div className='flex gap-2'>
                {/* Từ ngày */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-35 h-9 justify-start text-left font-normal gap-2">
                      <Calendar1Icon className="w-4 h-4 mr-1" />
                      {videoCountRequest.start_date ? format(videoCountRequest.start_date, "dd/MM/yyyy") : <span>Từ ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto bg-white" align="end">
                    <Calendar
                      mode="single"
                      selected={videoCountRequest.start_date}
                      onSelect={(date) =>
                        setvideoCountRequest((prev) => ({ ...prev, start_date: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                {/* Đến ngày */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-35 h-9 justify-start text-left font-normal gap-2">
                      <Calendar1Icon className="w-4 h-4 mr-1" />
                      {videoCountRequest.end_date ? format(videoCountRequest.end_date, "dd/MM/yyyy") : <span>Đến ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="end">
                    <Calendar
                      mode="single"
                      selected={videoCountRequest.end_date}
                      onSelect={(date) =>
                        setvideoCountRequest((prev) => ({ ...prev, end_date: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {/* nút xem sau khi chọn ngày xong */}
                <Button
                variant="outline"
                className=" text-sm font-medium ml-2 h-9 hover:bg-gray-200"
                onClick={handleViewClick}
              >
                Xem
              </Button>
              </div>
                )}
                </div>
              </div>
            
            </CardHeader>
            {/* Sử lý nội dung đồ thị */}
            <CardContent>
              <ResponsiveContainer className='p-2' width="100%" height={300}>
                <AreaChart data={chartData.length ? chartData : mockVideoData7Days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey='time'
                    tickFormatter={time => {
                        // Nếu time là "2025-06-27" => trả về "27/06"
                        if (!time) return "";
                        const [year, month, day] = time.split("-");
                        return `${day}/${month}`;
                      }}                    
                      interval={videoCountRequest.time_range === "last_7_days" ? 0 : videoCountRequest.time_range === "last_30_days" ? 7 : 0}
                    />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={3} dot={true} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Action */}
          <Card className="shadow-md bg-white border-1 border-gray-300">
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <Link href="/script">
                <Button
                  variant="outline"
                  className="w-full h-14 border-1 border-gray-300 justify-start gap-4 text-left 
                  hover:bg-blue-50 hover:border-blue-200 transition-colors bg-transparent">
                  <Video className="h-5 w-5 text-blue-600 ml-1" />
                  <span className="text-base font-medium">Tạo video mới</span>
                </Button>
              </Link>
              <Link href="/my-videos">
                <Button variant='outline' 
                  className="w-full h-14 border-1 border-gray-300 justify-start gap-4 text-left 
                  hover:bg-blue-50 hover:border-blue-200 transition-colors bg-transparent">
                  <Eye className="h-5 w-5 text-green-600" />
                  Xem tất cả video
                </Button>
              </Link>
              <Link href="/my-videos">
                <Button variant='outline' 
                  className="w-full h-14 border-1 border-gray-300 justify-start gap-4 text-left 
                  hover:bg-blue-50 hover:border-blue-200 transition-colors bg-transparent">
                  <Upload className="h-5 w-5 text-purple-600" />
                  Đăng video lên nền tảng
                </Button>
              </Link>
            </div>
          </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* hiệu suất theo tháng */}
        {/* <Card className="shadow-md bg-white border-1 border-gray-300">
            <CardHeader>
            <CardTitle>Hiệu Suất Theo Tháng</CardTitle>
            <CardDescription>Comments, shares và likes</CardDescription>
            </CardHeader>

            <CardContent>
            <ResponsiveContainer className='p-1.5' width="100%" height={400}>
                <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={75}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
            </ResponsiveContainer>
            </CardContent>
        </Card> */}

        {/* Video Gần đây */}
        <Card className="shadow-md bg-white border-1 border-gray-300">
            <CardHeader>
             <CardTitle>
              <div className='p-2'> Top Video tạo gần đây </div>
              <div className="mt-2 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-100 overflow-y-auto p-2 scrollbar-hide">
                {currentVideo.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg shadow-md border-1 border-gray-300">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm break-words whitespace-normal max-w-xs">{video.title}</h4>
                      <div className='flex gap-4'>
                        {video.uploadedAt != '' && (
                          <div className="flex items-center gap-4 my-1 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {(video.view_count / 1000000).toFixed(1)}M
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {(video.like_count / 1000).toFixed(0)}K
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-4 my-1 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Number(video.duration).toFixed(2)}
                        </span>
                        </div>
                      </div>
                      {video.uploadedAt && video.uploadedAt !== "" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã tải lên</Badge>
                        ) : (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Chưa tải lên</Badge>
                        )}
                    </div>
                  <div>
                 <Badge variant="secondary" className={`ml-4 capitalize ${video.status === 'done' ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>
                    {video.status === "done" ? 'đã edit' : 'chưa edit'}
                  </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
