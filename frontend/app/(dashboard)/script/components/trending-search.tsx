"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {  RefreshCw, Search, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input";
import { TrendingContent } from "./trending-content";
export default function TrendingSearch({SetSelectedContentForParent}: {SetSelectedContentForParent: (content: any) => void}) {
    const [keyword, setKeyword] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleTrendingSearch = () => {
        if (!keyword.trim()) return

        setIsSearching(true)

        // Simulate API call to YouTube/TikTok
        setTimeout(() => {
        const mockResults = [
            {
            id: "1",
            title: "Thử thách 30 ngày " + keyword,
            platform: "youtube",
            views: "2.5M",
            thumbnail: "/placeholder.svg?height=120&width=200",
            trending_rank: 1,
            },
            {
            id: "2",
            title: "Hướng dẫn " + keyword + " cơ bản",
            platform: "tiktok",
            views: "1.8M",
            thumbnail: "/placeholder.svg?height=120&width=200",
            trending_rank: 2,
            },
            {
            id: "3",
            title: "Mẹo học " + keyword + " hiệu quả",
            platform: "youtube",
            views: "3.2M",
            thumbnail: "/placeholder.svg?height=120&width=200",
            trending_rank: 3,
            },
            {
            id: "4",
            title: "Review " + keyword + " mới nhất",
            platform: "tiktok",
            views: "4.1M",
            thumbnail: "/placeholder.svg?height=120&width=200",
            trending_rank: 4,
            },
        ]

        setSearchResults(mockResults)
        setIsSearching(false)
            }, 1000)
    };
    const handleContentSelect = (content: any) => {
        SetSelectedContentForParent(content);
    };
    return (
        <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="bg-white border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Nhập từ khóa để tìm nội dung xu hướng..."
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleTrendingSearch()}
                        />
                      </div>
                      <Button
                        onClick={handleTrendingSearch}
                        disabled={isSearching}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      </Button>
                    </div>

                    {searchResults.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3">Kết quả tìm kiếm cho {keyword}</h3>
                        <TrendingContent contents={searchResults} onSelect={handleContentSelect} />
                      </div>
                    )}
                  </div>
    )
}