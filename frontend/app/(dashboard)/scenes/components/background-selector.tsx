"use client"

import type React from "react"

import { useRef, useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, Sparkles, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GenerateImageApi, GenerateImageRequest } from "@/services/image_api"
interface BackgroundSelectorProps {
  currentBackgroundUrl?: string
  currentBackgroundPublicId?: string
  textContentOfScene?: string
  onBackgroundChange: (content?: File, publicId?: string, url?: string) => void
}

const styleOptions = [
  { value: "cartoon", label: "Hoạt hình" },
  { value: "minimalist", label: "Tối giản" },
  { value: "classic", label: "Cổ điển" },
  { value: "modern", label: "Hiện đại" },
  { value: "watercolor", label: "Màu nước" },
  { value: "oil-painting", label: "Sơn dầu" },
  { value: "digital-art", label: "Nghệ thuật số" },
  { value: "photorealistic", label: "Chân thực" },
]

export function BackgroundSelector({ currentBackgroundUrl: currentBackgroundUrl,
                                currentBackgroundPublicId, textContentOfScene,
                                 onBackgroundChange }: BackgroundSelectorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<string>("templates")
  const [selectedStyle, setSelectedStyle] = useState("")
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const { toast } = useToast()
  const selectedBackgroundUrl = currentBackgroundUrl
  const selectedBackgroundPublicId = currentBackgroundPublicId || "uploaded"

  const backgrounds = [
    { id: "bg1", type: "solid", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "bg2", type: "solid", color: "bg-gradient-to-r from-cyan-500 to-blue-500" },
    { id: "bg3", type: "solid", color: "bg-gradient-to-r from-yellow-400 to-orange-500" },
    { id: "bg4", type: "image", url: "/placeholder.svg?height=80&width=120" },
    { id: "bg5", type: "image", url: "/placeholder.svg?height=80&width=120" },
    { id: "bg6", type: "image", url: "/placeholder.svg?height=80&width=120" },
  ]

  const handleBackgroundSelect = (bgId: string) => {
    // const selectedBg = backgrounds.find((bg) => bg.id === bgId)
    // if (selectedBg) {
    //   onBackgroundChange({
    //     type: selectedBg.type,
    //     ...(selectedBg.type === "solid" ? { color: selectedBg.color } : { url: selectedBg.url }),
    //   })
    // }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    onBackgroundChange(file, undefined, "uploaded")

    toast({
      title: "Tải lên thành công",
      description: "Hình nền đã được cập nhật",
    })
  }

  const generateAIBackground = async () => {
    try{
   
     if (!textContentOfScene || !textContentOfScene.trim()) {
        toast({
          title: "Vui lòng nhập mô tả",
          description: "Nhập mô tả để AI tạo hình nền",
          variant: "destructive",
        })
        return
      }

      setIsGeneratingAI(true)

      const request: GenerateImageRequest = {
        content: textContentOfScene,
        style: selectedStyle,
        image_ratio: "16:9",
      }

      const response = await GenerateImageApi(request)
      if(response && response.status_code === 200){
        onBackgroundChange(undefined, response.public_id, response.image_url)
      }
      else{
        throw new Error("Failed to generate image")
      }

    }
    catch (error){
      alert(`Server is busy with response ${error} : . Please try again later.`)
      return
    }
    finally{
      setIsGeneratingAI(false)
    }

    
  }

  const RenderSelectedBackgroundImage = () => {
    if(!selectedBackgroundUrl){
      return(
        <div className="text-sm text-muted-foreground mt-4">
          <p>Chưa chọn hình nền. Vui lòng chọn một hình nền từ các mẫu có sẵn, tạo bằng AI hoặc tải lên.</p>
        </div>
      )
    }
    else if(selectedBackgroundUrl === "uploaded"){
      return (
        <div className="space-y-2">
          <p className="text-sm font-medium mb-2">Bạn đã tải lên ảnh</p>
        </div>
      ) 
    }
    else{
      return (
        <div className="space-y-2">
          <p className="text-sm font-medium mb-2">Hình nền đã chọn:</p>
          <div className="border-2 border-purple-300 rounded-md overflow-hidden">
            <img
              src={selectedBackgroundUrl || "/placeholder.svg"}
              alt="selected background"
              className="w-full h-100 object-cover"
            />
          </div>
        </div>
      )
    }
  }
  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="templates" className="flex-1">
            Mẫu có sẵn
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex-1">
            Tạo bằng AI
          </TabsTrigger>
          <TabsTrigger 
            disabled
            value="upload" className="flex-1">
            Tải lên (sắp ra mắt)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <RadioGroup
            value={selectedBackgroundUrl}
            onValueChange={handleBackgroundSelect}
            className="grid grid-cols-3 gap-2"
          >
            {backgrounds.map((bg) => (
              <div key={bg.id} className="relative">
                <RadioGroupItem value={bg.id} id={bg.id} className="sr-only" />
                <Label
                  htmlFor={bg.id}
                  className="cursor-pointer block h-20 rounded-md overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: selectedBackgroundUrl === bg.id ? "rgb(147, 51, 234)" : "transparent",
                  }}
                >
                  {bg.type === "solid" ? (
                    <div className={`w-full h-full ${bg.color}`}></div>
                  ) : (
                    <img src={bg.url || "/placeholder.svg"} alt="Background" className="w-full h-full object-cover" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="space-y-4">
            {/* Thông báo thay thế Input */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <Sparkles className="inline h-4 w-4 mr-1" />
                Hệ thống sẽ tự động tạo hình nền dựa trên nội dung của cảnh này. Chỉ cần chọn phong cách và nhấn tạo hình!
              </p>
            </div>

            {/* Chọn phong cách */}
            <div className="space-y-2">
              <Label htmlFor="style-select" className="text-sm font-medium text-gray-700">
                Chọn phong cách hình ảnh
              </Label>
              <div className="flex gap-2">
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger className="bg-white border border-gray-300 focus:border-purple-500 flex-1">
                    <SelectValue placeholder="Chọn phong cách..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                    {styleOptions.map((style) => (
                      <SelectItem 
                        className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer text-gray-700"
                        key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Button tạo hình */}
                <Button
                  onClick={generateAIBackground}
                  disabled={isGeneratingAI || !selectedStyle}
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
                      Tạo hình nền
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 h-40">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Kéo thả hoặc nhấp để tải lên</p>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white" 
              variant="outline" size="sm" onClick={() => imageInputRef.current?.click()}>
              Chọn tệp
            </Button>
            <Input
              className="hidden"
              ref={imageInputRef}
              id="bg-upload" type="file" onChange={handleFileUpload} />
          </div>

          {/* {currentBackground?.type === "image" && activeTab === "upload" && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Hình nền hiện tại:</p>
              <div className="border rounded-md overflow-hidden">
                <img
                  src={currentBackground.url || "/placeholder.svg"}
                  alt="Current Background"
                  className="w-full h-20 object-cover"
                />
              </div>
            </div>
          )} */}
        </TabsContent>
      </Tabs>

      {RenderSelectedBackgroundImage()}
      

    </div>
  )
}
