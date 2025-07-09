export interface TotalStats {
    totalVideos: number,
    uploadedVideos: number, 
    totalViews: number,
    totalLikes: number,
    totalFavorites: number,
    totalComments: number
}

// interface for video count statistics
export interface TimelyCountData {
  time: string;   
  count: number;  
}

export interface VideoCountRequest {
    time_unit: string,
    time_range: string,
    start_date: Date | undefined,
    end_date: Date | undefined,
    user_id: string | "",
}
// interface for top videos
export interface TopVideo {
  public_id: string;
  title: string;
  status: string;
  duration: number;
  updated_at: string;
  uploadedAt: string;
  view_count: number;
  like_count: number;
  favorite_count: number;
  comment_count: number;
}

export const overviewStats:TotalStats = {
    totalVideos: 2000,
    uploadedVideos: 1000, 
    totalViews: 1500000,
    totalLikes: 120000,
    totalFavorites: 200000,
    totalComments: 100000
}

export const mockVideoData7Days: TimelyCountData[] = [
  { time: '25-06-2025', count: 530000 },
  { time: '26-06-2025', count: 610000 },
  { time: '27-06-2025', count: 570000 },
  { time: '28-06-2025', count: 650000 },
  { time: '29-06-2025', count: 600000 },
  { time: '30-06-2025', count: 690000 },
  { time: '01-07-2025', count: 720000 },
];

export const mockVideoData30Days: TimelyCountData[] = [
  { time: '02-06-2025', count: 420000 },
  { time: '03-06-2025', count: 430000 },
  { time: '04-06-2025', count: 410000 },
  { time: '05-06-2025', count: 440000 },
  { time: '06-06-2025', count: 450000 },
  { time: '07-06-2025', count: 460000 },
  { time: '08-06-2025', count: 470000 },
  { time: '09-06-2025', count: 480000 },
  { time: '10-06-2025', count: 490000 },
  { time: '11-06-2025', count: 500000 },
  { time: '12-06-2025', count: 510000 },
  { time: '13-06-2025', count: 520000 },
  { time: '14-06-2025', count: 530000 },
  { time: '15-06-2025', count: 540000 },
  { time: '16-06-2025', count: 550000 },
  { time: '17-06-2025', count: 560000 },
  { time: '18-06-2025', count: 570000 },
  { time: '19-06-2025', count: 580000 },
  { time: '20-06-2025', count: 590000 },
  { time: '21-06-2025', count: 600000 },
  { time: '22-06-2025', count: 610000 },
  { time: '23-06-2025', count: 620000 },
  { time: '24-06-2025', count: 630000 },
  { time: '25-06-2025', count: 640000 },
  { time: '26-06-2025', count: 650000 },
  { time: '27-06-2025', count: 660000 },
  { time: '28-06-2025', count: 670000 },
  { time: '29-06-2025', count: 680000 },
  { time: '30-06-2025', count: 690000 },
  { time: '01-07-2025', count: 700000 },
];

export const currentVideos : TopVideo[] = [
   {
    public_id: "vid_1",
    title: "How AI Changes Video Editing",
    status: "published",
    duration: 540,
    updated_at: "2025-07-01T10:20:00.000Z",
    uploadedAt: "2025-07-01T09:00:00.000Z",
    view_count: 1200000,
    like_count: 95000,
    favorite_count: 20000,
    comment_count: 3500,
  },
  {
    public_id: "vid_2",
    title: "Marketing Video with AI Script",
    status: "published",
    duration: 720,
    updated_at: "2025-06-29T14:15:00.000Z",
    uploadedAt: "2025-06-29T13:00:00.000Z",
    view_count: 800000,
    like_count: 67000,
    favorite_count: 15000,
    comment_count: 2100,
  },
  {
    public_id: "vid_3",
    title: "TikTok Viral AI Video",
    status: "published",
    duration: 320,
    updated_at: "2025-06-28T08:30:00.000Z",
    uploadedAt: "2025-06-28T08:00:00.000Z",
    view_count: 950000,
    like_count: 72000,
    favorite_count: 17000,
    comment_count: 1800,
  },
  {
    public_id: "vid_4",
    title: "Educational AI Video",
    status: "published",
    duration: 900,
    updated_at: "2025-06-27T11:45:00.000Z",
    uploadedAt: "2025-06-27T11:00:00.000Z",
    view_count: 600000,
    like_count: 54000,
    favorite_count: 12000,
    comment_count: 1200,
  },
  {
    public_id: "vid_5",
    title: "YouTube Shorts with AI",
    status: "published",
    duration: 60,
    updated_at: "2025-06-26T16:10:00.000Z",
    uploadedAt: "2025-06-26T15:00:00.000Z",
    view_count: 400000,
    like_count: 32000,
    favorite_count: 8000,
    comment_count: 900,
  },
]

export const monthlyData = [
  { time: "01/2025", count: 12000 },
  { time: "02/2025", count: 15000 },
  { time: "03/2025", count: 18000 },
  { time: "04/2025", count: 21000 },
  { time: "05/2025", count: 17000 },
  { time: "06/2025", count: 20000 },
  { time: "07/2025", count: 22000 },
];