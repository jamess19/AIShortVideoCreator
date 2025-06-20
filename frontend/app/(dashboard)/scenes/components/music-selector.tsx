"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Play, Pause, Upload, Sparkles, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GetMusicTracksApi } from "@/services/music_api"
import { MusicTrack } from "@/lib/models"

interface MusicSelectorProps {
  currentMusicUrl?: string
  currentMusicPublicId?: string
  onMusicChange: (content?: File, publicId?: string, url?: string) => void
}

export function MusicSelector({ currentMusicUrl,currentMusicPublicId, onMusicChange }: MusicSelectorProps) {
  const [activeTab, setActiveTab] = useState<string>("library")
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([])
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null)
  const [musicVolume, setMusicVolume] = useState<number>(50)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const { toast } = useToast()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const selectedMusicUrl = currentMusicUrl;
  const selectedMusicPublicId = currentMusicPublicId;

  useEffect(() => {
    const fetchMusicTracks = async () => {
      try {
        const tracks = await GetMusicTracksApi()
        setMusicTracks(tracks)
      } catch (error) {
        console.error("Error fetching music tracks:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải nhạc nền. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      }
    }
    fetchMusicTracks()
  }, [])

  const handleMusicSelect = (musicId: string) => {

    const selectedTrack = musicTracks.find((track) => track.publicId === musicId)
    if (selectedTrack) {
      onMusicChange(undefined, selectedTrack.publicId, selectedTrack.musicUrl);
    }
  }
  const handlePlayMusicTrack = (track: MusicTrack) => {
    if (playingMusicId === track.publicId) {
      audioRef.current?.pause()
      setPlayingMusicId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.musicUrl
        audioRef.current.volume = musicVolume / 100 // Convert to 0-1 range
        audioRef.current.play()
        setPlayingMusicId(track.publicId)
      }
    }
  };

  const handleAudioEnded = () => {
    setPlayingMusicId(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload this file to a server
    // For now, we'll just use the file name
    onMusicChange(file, undefined)

    toast({
      title: "Tải lên thành công",
      description: `Đã tải lên: ${file.name}`,
    })
  }

  const generateAIMusic = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Vui lòng nhập mô tả",
        description: "Nhập mô tả để AI tạo nhạc nền",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingAI(true)

    // Simulate AI music generation
    setTimeout(() => {
      // In a real app, this would be an API call to an AI music generator

      onMusicChange({
        type: "ai",
        name: `AI: ${aiPrompt.substring(0, 20)}...`,
        prompt: aiPrompt,
        aiGenerated: true,
      })

      setIsGeneratingAI(false)

      toast({
        title: "Tạo nhạc nền thành công",
        description: "AI đã tạo nhạc nền theo mô tả của bạn",
      })
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Âm lượng nhạc</label>
        <Slider
          value={[musicVolume]}
          max={100}
          step={1}
          onValueChange={(value) => {
            setMusicVolume(value[0])
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>{musicVolume}%</span>
          <span>100%</span>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="library" className="flex-1">
            Thư viện
          </TabsTrigger>
          <TabsTrigger disabled value="ai" className="flex-1">
            Tạo bằng AI (sắp ra mắt)
          </TabsTrigger>
          <TabsTrigger disabled value="upload" className="flex-1">
            Tải lên (sắp ra mắt)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-2">
          <RadioGroup value={selectedMusicPublicId} onValueChange={handleMusicSelect} className="space-y-2">
            {musicTracks.map((track) => (
              <div
                key={track.publicId}
                className="flex items-center justify-between border rounded-md p-3 hover:border-purple-400 transition-colors"
                onClick={() => handleMusicSelect(track.publicId)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={track.publicId} id={track.publicId} />
                  <Label htmlFor={track.publicId} className="cursor-pointer">
                    <div>
                      <span className="font-medium">{track.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({track.duration})</span>
                    </div>
                  </Label>
                </div>
                <Button
                  onClick={e =>{
                    e.stopPropagation();
                    handlePlayMusicTrack(track);
                  }} 
                  variant="ghost" size="icon"
                  type="button"
                  className="h-8 w-8">
                  {playingMusicId === track.publicId ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </RadioGroup>
          <audio ref={audioRef} onEnded={handleAudioEnded}/>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="music-prompt" className="block mb-2">
                Mô tả nhạc nền bạn muốn
              </Label>
              <div className="flex gap-2">
                <Input
                  className="bg-white border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  id="music-prompt"
                  placeholder="Ví dụ: Nhạc nền vui tươi, sôi động cho video giải trí..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <Button
                  onClick={generateAIMusic}
                  disabled={isGeneratingAI || !aiPrompt.trim()}
                  className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
                >
                  {isGeneratingAI ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Tạo nhạc
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isGeneratingAI && (
              <div className="flex justify-center items-center h-20 border-2 border-dashed rounded-md">
                <div className="text-center">
                  <RefreshCw className="h-6 w-6 text-purple-600 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Đang tạo nhạc nền...</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 h-32">
              <Upload className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Kéo thả hoặc nhấp để tải lên</p>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white" 
                variant="outline" size="sm" onClick={() => document.getElementById("music-upload")?.click()}>
                Chọn tệp nhạc
              </Button>
              <Input id="music-upload" type="file" className="hidden" accept="audio/*" onChange={handleFileUpload} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
