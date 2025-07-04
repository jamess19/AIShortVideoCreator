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
  ];

  const width = 600; // tăng width gốc để viewBox rộng hơn
  const height = 200;
  const padding = 40;
  const maxViews = Math.max(...chartData.map((d) => d.views));
  const minViews = Math.min(...chartData.map((d) => d.views));
  const stepX = (width - 2 * padding) / (chartData.length - 1);

  const points = chartData.map((d, i) => {
    const x = padding + i * stepX;
    const y =
      height -
      padding -
      ((d.views - minViews) / (maxViews - minViews || 1)) * (height - 2 * padding);
    return [x, y];
  });

  const linePath = points
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ");

  return (
    <div className="w-full">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        preserveAspectRatio="none"
      >
        {/* Trục X */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#e5e7eb"
          strokeWidth={2}
        />
        {/* Trục Y */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#e5e7eb"
          strokeWidth={2}
        />
        {/* Đường biểu đồ */}
        <path
          d={linePath}
          fill="none"
          stroke="#a78bfa"
          strokeWidth={3}
        />
        {/* Các điểm tròn */}
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={6}
            fill="#a78bfa"
            stroke="#fff"
            strokeWidth={2}
          />
        ))}
        {/* Nhãn ngày */}
        {points.map(([x], i) => (
          <text
            key={i}
            x={x}
            y={height - padding + 24}
            textAnchor="middle"
            fontSize={14}
            fill="#6b7280"
          >
            {chartData[i].day}
          </text>
        ))}
        {/* Nhãn số lượng lớn nhất */}
        <text
          x={padding - 10}
          y={padding + 4}
          textAnchor="end"
          fontSize={14}
          fill="#6b7280"
        >
          {maxViews}
        </text>
        {/* Nhãn số lượng nhỏ nhất */}
        <text
          x={padding - 10}
          y={height - padding + 4}
          textAnchor="end"
          fontSize={14}
          fill="#6b7280"
        >
          {minViews}
        </text>
      </svg>
    </div>
  );
}