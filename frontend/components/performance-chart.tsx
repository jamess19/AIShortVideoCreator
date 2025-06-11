"use client"

export function PerformanceChart() {
  // Mock data for the chart
  const chartData = [
    { day: "T2", views: 1200, likes: 89 },
    { day: "T3", views: 1800, likes: 124 },
    { day: "T4", views: 2400, likes: 167 },
    { day: "T5", views: 1900, likes: 142 },
    { day: "T6", views: 3200, likes: 234 },
    { day: "T7", views: 2800, likes: 198 },
    { day: "CN", views: 2100, likes: 156 },
  ]

  const maxViews = Math.max(...chartData.map((d) => d.views))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Lượt xem</span>
        <span className="text-muted-foreground">7 ngày qua</span>
      </div>

      <div className="h-48 flex items-end justify-between space-x-2">
        {chartData.map((data, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 flex-1">
            <div className="w-full bg-gray-200 rounded-t relative" style={{ height: "120px" }}>
              <div
                className="bg-purple-500 rounded-t transition-all duration-300 hover:bg-purple-600"
                style={{
                  height: `${(data.views / maxViews) * 100}%`,
                  width: "100%",
                  position: "absolute",
                  bottom: 0,
                }}
              />
            </div>
            <span className="text-xs font-medium">{data.day}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>{Math.round(maxViews / 1000)}K</span>
      </div>
    </div>
  )
}
