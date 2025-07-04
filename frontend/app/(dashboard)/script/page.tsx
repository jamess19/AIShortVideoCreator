"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Play, Pause, Volume2, ArrowRight, TrendingUp, Sparkles, RefreshCw } from "lucide-react"
import TrendingSearch from "./components/trending-search"
import { useRouter } from "next/navigation"
import type { Voice } from "@/lib/models"
import { GetVoicesApi } from "@/services/video_script_api"
import { AutoGenerateScriptApi } from "@/services/video_script_api"

export default function ScriptPage() {
  const router = useRouter()
  const [selectedVoiceId, setSelectedVoiceId] = useState("minh-anh")
  const [scriptDuration, setScriptDuration] = useState(30)
  const [volumeLevel, setVolumeLevel] = useState(80)
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [selectedScript, setSelectedScript] = useState<string>("")
  const [scriptContent, setScriptContent] = useState<string>("") // Nội dung textarea
  const [sceneCount, setSceneCount] = useState(3);
  const [voices, setVoices] = useState<Voice[]>([])
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null)
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Fetch voices on component mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const voiceList = await GetVoicesApi()
        setVoices(voiceList)
        if (voiceList.length > 0) {
          setSelectedVoiceId(voiceList[0].voiceId)
        }
      } catch (error) {
        console.error("Error fetching voices:", error)
      }
    }
    fetchVoices()
  }, [])

  // Cập nhật selectedScript khi scriptContent thay đổi
  useEffect(() => {
    setSelectedScript(scriptContent)
  }, [scriptContent])

  const handlePlaySample = (voice: Voice) => {
    if (playingVoiceId === voice.voiceId) {
      audioRef.current?.pause()
      setPlayingVoiceId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.src = voice.sampleVoiceUrl
        audioRef.current.play()
        setPlayingVoiceId(voice.voiceId)
      }
    }
  }

  const handleAudioEnded = () => {
    setPlayingVoiceId(null)
  }

  // Hàm gợi ý kịch bản AI
  const generateScriptSuggestion = async () => {
    if (!selectedContent) return

    setIsGeneratingScript(true)

    const request = {
      content: selectedContent.title,
      video_duration: scriptDuration,
      scene_quantity: sceneCount
    }

    try {
      const response = await AutoGenerateScriptApi(request)

      if (response && response.message === "success") {
        // Cập nhật trực tiếp vào textarea
        setScriptContent(response.data)
      }
    } catch (error) {
      console.error("Error generating script:", error)
    } finally {
      setIsGeneratingScript(false)
    }
  }

  const HandleNextStep = () => {
    if (selectedScript) {
      localStorage.setItem("selectedScript", selectedScript)
      localStorage.setItem("selectedVoiceId", selectedVoiceId)
      localStorage.setItem("selectedContent", JSON.stringify(selectedContent))
      router.push("/scenes")
    } else {
      console.warn("No script selected")
    }
  }

  return (
    <div className="p-8 text-black bg-white ml-64">
      <h1 className="text-2xl font-bold mb-2">Soạn kịch bản & Chọn giọng đọc</h1>
      <p className="text-gray-600 mb-6">Viết kịch bản cho video của bạn hoặc để AI gợi ý nội dung</p>

      {selectedContent && (
        <div className="p-3 bg-purple-50 rounded-md border border-purple-200 mb-6">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-800">
              Nội dung đã chọn (sẽ được chọn làm tiêu đề video):{" "}
            </span>
            <span className="text-sm text-purple-700 ml-1">{selectedContent.title}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 border border-gray-300 rounded-lg p-6">
          <Tabs defaultValue="write">
            <TabsList className="mb-4 bg-gray-100 rounded-lg">
              <TabsTrigger
                className="px-4 data-[state=active]:bg-white data-[state=active]:text-gray-800"
                value="trending"
              >
                Tìm kiếm nội dung xu hướng
              </TabsTrigger>
              <TabsTrigger
                value="write"
                className="px-4 data-[state=active]:bg-white data-[state=active]:text-gray-800"
              >
                Viết kịch bản
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="space-y-4">
              <TrendingSearch SetSelectedContentForParent={setSelectedContent} />
            </TabsContent>

            <TabsContent value="write">
              <div className="mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-gray-500">Thời lượng: {scriptDuration} giây</span>
              </div>

              {/* Phần gợi ý AI */}
              <div className="mb-6 relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-blue-50">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full translate-y-12 -translate-x-12 opacity-40"></div>

                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Gợi ý kịch bản từ AI</h3>
                        <p className="text-sm text-gray-600">Tạo kịch bản tự động dựa trên nội dung đã chọn</p>
                      </div>
                    </div>
                    <Button
                      onClick={generateScriptSuggestion}
                      disabled={isGeneratingScript || !selectedContent}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2"
                    >
                      {isGeneratingScript ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Tạo gợi ý
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Selected content info */}
                  <div className="mb-4 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-purple-100">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-purple-800">Nội dung được chọn:</span>
                        <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                          {selectedContent?.title || "Chưa có nội dung nào được chọn"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Configuration controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Duration control */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        Thời lượng video
                      </label>
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center gap-3">
                          <Slider
                            value={[scriptDuration]}
                            min={5}
                            max={120}
                            step={5}
                            onValueChange={(value: number[]) => setScriptDuration(value[0])}
                            className="flex-1"
                          />
                          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium min-w-[70px] text-center">
                            {scriptDuration}s
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5s</span>
                          <span>120s</span>
                        </div>
                      </div>
                    </div>

                    {/* Scene count control */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        Số cảnh
                      </label>
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-purple-200 hover:bg-purple-50 bg-white"
                              onClick={() => setSceneCount(Math.max(1, sceneCount - 1))}
                              disabled={sceneCount <= 1}
                            >
                              -
                            </Button>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={sceneCount}
                              onChange={(e) => setSceneCount(Math.max(1, Math.min(10, Number(e.target.value))))}
                              className="w-16 h-8 border border-purple-200 rounded text-center text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-purple-200 hover:bg-purple-50 bg-white"
                              onClick={() => setSceneCount(Math.min(10, sceneCount + 1))}
                              disabled={sceneCount >= 10}
                            >
                              +
                            </Button>
                          </div>
                          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                            {sceneCount} cảnh
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI suggestion info */}
                  <div className="bg-gradient-to-r from-purple-100/50 to-blue-100/50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-purple-200 rounded-full">
                        <svg
                          className="h-4 w-4 text-purple-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 mb-1">AI sẽ tạo kịch bản tối ưu</p>
                        <p className="text-sm text-gray-600">
                          Dựa trên nội dung {selectedContent?.title}, AI sẽ tạo kịch bản phù hợp với
                          <span className="font-medium text-purple-700"> {scriptDuration} giây</span> và
                          <span className="font-medium text-purple-700"> {sceneCount} cảnh</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              

              <Textarea
                placeholder="Nhập kịch bản của bạn ở đây hoặc nhận gợi ý từ AI..."
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className="min-h-[240px] mb-4 resize-none border-gray-300 bg-gray-50 focus:ring-gray-300 focus:border-gray-500 h-[400px] overflow-y-auto"
              />

              <div className="flex items-center gap-2">
                <span className="text-gray-600 min-w-[80px]">Thời lượng:</span>
                <Slider
                  value={[scriptDuration]}
                  min={5}
                  max={120}
                  step={1}
                  onValueChange={(value: number[]) => setScriptDuration(value[0])}
                  className="flex-1 mr-2 text-purple-600"
                />
                <span className="text-gray-600 min-w-[60px]">{scriptDuration} giây</span>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Voice selection section */}
        <div className="w-full md:w-1/3 border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Chọn giọng đọc</h2>

          <div className="space-y-3">
            {voices.map((voice) => (
              <div
                key={voice.voiceId}
                className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer ${
                  selectedVoiceId === voice.voiceId ? "border-purple-500 bg-purple-50" : "border-gray-200"
                }`}
                onClick={() => setSelectedVoiceId(voice.voiceId)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedVoiceId === voice.voiceId ? "border-purple-600" : "border-gray-400"
                    }`}
                  >
                    {selectedVoiceId === voice.voiceId && <div className="w-3 h-3 rounded-full bg-purple-600"></div>}
                  </div>
                  <span className="ml-3 font-medium">{voice.voiceId}</span>
                  <span className="ml-2 text-gray-500 text-sm">({voice.gender === "Female" ? "Nữ" : "Nam"})</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlaySample(voice)
                  }}
                >
                  {playingVoiceId === voice.voiceId ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            ))}
            <audio ref={audioRef} onEnded={handleAudioEnded} />
          </div>

          <div className="mt-6 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-gray-500" />
            <Slider
              value={[volumeLevel]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value: number[]) => setVolumeLevel(value[0])}
              className="flex-1 text-purple-600"
            />
            <span className="text-gray-600 min-w-[40px]">{volumeLevel}%</span>
          </div>

          <Button
            onClick={HandleNextStep}
            disabled={!selectedScript}
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
          >
            <span>Tiếp tục</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
