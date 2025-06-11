"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Layers } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { GetVideoScriptMetadataApi } from "@/services/video_script_api"
import { CreateVideoApi } from "@/services/video_api"
import { VideoMetadataJson, Scene} from "@/lib/models"
import { SceneEditor } from "./components/scene-editor"

const mockScriptJson = {
  "scenes": [
        {
            "scene_id": "1",
            "start_time": 0,
            "end_time": 10,
            "text": "Đây là cảnh đầu tiên.",
            "background": { "type": "solid", "color": "#f0f0f0" },
            "voice_tone": "normal",
            "music": null,
        },
        {
            "scene_id": "2",
            "start_time": 10,
            "end_time": 20,
            "text": "Đây là cảnh thứ hai.",
            "background": { "type": "image", "url": "/placeholder.svg?height=80&width=120" },
            "voice_tone": "excited",
            "music": null,
        },
    ],
}
export default function ScenesPage() {
  const [scriptJson, setScriptJson] = useState<any>(null)
  const [backgroundImages, setBackgroundImages] = useState<File[]>([])
  const [backgroundMusics, setBackgroundMusics] = useState<File[]>([])
  const [activeSceneId, setActiveSceneId] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const GetVideoScriptMetadata = async (request) => {
      try {
        const response = await GetVideoScriptMetadataApi(request)
        if (response && response.message === "success") {
          setScriptJson(response.data)
          localStorage.setItem("selectedScript", JSON.stringify(response.data))
          if (response.data.scenes && response.data.scenes.length > 0) {
            setActiveSceneId(response.data.scenes[0].scene_id)
          }
        } else {
          toast({
            title: "Lỗi",
            description: "Không thể tải dữ liệu kịch bản",
            variant: "destructive",
          })
          setScriptJson(null)
        }
      } catch (error) {
        console.error("Error fetching script metadata:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu kịch bản",
          variant: "destructive",
        })
        setScriptJson(mockScriptJson)
      }
      finally {
        setIsLoading(false)
      }
    }
    const selectedScript = localStorage.getItem("selectedScript")
    if (selectedScript) {
      const request = {
        script: selectedScript
      }
      GetVideoScriptMetadata(request)
    } else {
      setScriptJson(mockScriptJson) // Use mock data if no script is found
      if(mockScriptJson.scenes && mockScriptJson.scenes.length > 0) {
        setActiveSceneId(mockScriptJson.scenes[0].scene_id)
      }
      setIsLoading(false)
    }
  }, [])

  const handleSceneUpdate = (sceneId: number, updatedScene: any) => {
    if (!scriptJson) return

    const updatedScenes = scriptJson.scenes.map((scene: any) =>
      scene.scene_id === sceneId ? { ...scene, ...updatedScene } : scene,
    )

    const updatedScript = {
      ...scriptJson,
      scenes: updatedScenes,
    }

    setScriptJson(updatedScript)
    localStorage.setItem("selectedScript", JSON.stringify(updatedScript))
  }
  const handleBackgroundChange = (sceneId: number, background: File) => {
    setBackgroundImages(prev => {
      const next = [...prev];
      next[sceneId-1] = background;
      return next;
    });
  }
  const handleMusicChange = (sceneId: number, music: File) => {
    setBackgroundMusics((prev) => {
      const next = [...prev];
      next[sceneId-1] = music;
      return [...prev]
    })
  }

  const saveAndContinue = async () => {
    try{
      const video_metaData_json : VideoMetadataJson = {
        script : "",
        title: "Video Title",
        userId: "pqkiet854",
        videoMetadata:{
          scenes: scriptJson.scenes.map((scene: Scene) => ({
            scene_id: scene.scene_id,
            start_time: scene.start_time,
            end_time: scene.end_time,
            text: scene.text,
            background_image: backgroundImages[scene.scene_id - 1]?.name || "",
            background_music: backgroundMusics[scene.scene_id - 1]?.name || "",
          })),
        }
      }
      const background_images : File[] = backgroundImages.filter((image) => image !== undefined && image !== null);
      const background_musics : File[] = backgroundMusics.filter((music) => music !== undefined && music !== null);

      const request: FormData = new FormData();
      request.append("video_metaData_json", JSON.stringify(video_metaData_json));
      Array.from(background_images).forEach((image) => {
        request.append("background_images", image);
      });
      Array.from(background_musics).forEach((music) => {
        request.append("background_musics", music);
      });

      setIsSaving(true)
      console.log("Saving video with request:");
      for (const pair of request.entries()) {
          console.log(pair[0], pair[1]);
      }

      const response = await CreateVideoApi(request)
      if(response && response.secure_url !== "error"){
        toast({
          title: "Lưu thành công",
          description: "Cấu hình cảnh đã được lưu",
        })
        router.push("/preview")
      }
      else{
        toast({
          title: "Lỗi",
          description: "Không thể lưu cấu hình cảnh. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving video:", error)
      setIsSaving(false)
      toast({
        title: "Lỗi",
        description: "Không thể lưu cấu hình cảnh. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
    finally{
      setIsSaving(false)
      localStorage.removeItem("selectedScript");
    }
  }

  if(isLoading){
    return(
    <div className="p-8 text-black bg-white ml-64">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold mb-4 text-black">Đang tải dữ liệu kịch bản...</h2>
          <p className="text-muted-foreground mb-6 text-black">Vui lòng đợi trong giây lát</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-600"></div>
        </div>
    </div>
    )
  }
  if (!scriptJson) {
    return (
      <div className="p-8 text-black bg-white ml-64">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold mb-4 text-black">Không tìm thấy dữ liệu kịch bản</h2>
          <p className="text-muted-foreground mb-6 text-black">Vui lòng quay lại trang kịch bản để tạo kịch bản trước</p>
          <Link href="/script">
            <Button className="text-black bg-white">Quay lại trang kịch bản</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 text-black bg-white ml-64">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cấu hình cảnh</h1>
          <p className="text-muted-foreground">Tùy chỉnh từng cảnh trong video của bạn</p>
        </div>
        <div className="flex gap-2">
          <Link href="/script">
            <Button variant="outline" className="flex items-center bg-white text-black hover:bg-gray-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại kịch bản
            </Button>
          </Link>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={saveAndContinue} disabled={isSaving}>
            {isSaving ? (
              "Đang lưu..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu và tiếp tục
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="h-5 w-5 mr-2 text-purple-600" />
                Danh sách cảnh
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {scriptJson.scenes.map((scene: any, index: number) => (
                  <Button
                    key={scene.scene_id}
                    variant="ghost"
                    className={`justify-start rounded-none border-l-4 ${
                      activeSceneId === scene.scene_id
                        ? "border-l-purple-600 bg-purple-50 text-purple-700"
                        : "border-l-transparent"
                    }`}
                    onClick={() => setActiveSceneId(scene.scene_id)}
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <span className="font-medium text-purple-700">{index + 1}</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Cảnh {index + 1}</div>
                      <div className="text-xs text-muted-foreground">
                        {scene.start_time}s - {scene.end_time}s
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {scriptJson.scenes.map((scene: any) => (
            <div key={scene.scene_id} className={activeSceneId === scene.scene_id ? "block" : "hidden"}>
              <SceneEditor scene={scene} 
                handleBackgroundChangeForParent={(background : File) => handleBackgroundChange(scene.scene_id, background)}
                handleMusicChangeForParent={(music: File) => handleMusicChange(scene.scene_id, music)}
                onUpdate={(updatedScene) => handleSceneUpdate(scene.scene_id, updatedScene)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
