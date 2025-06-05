"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Layers } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

import { SceneEditor } from "./components/scene-editor"

export default function ScenesPage() {
  const [scriptJson, setScriptJson] = useState<any>({
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
  })
  const [activeSceneId, setActiveSceneId] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Load script JSON from localStorage
    const scriptFromStorage = localStorage.getItem("scriptJson")
    if (scriptFromStorage) {
      const parsedScript = JSON.parse(scriptFromStorage)
      setScriptJson(parsedScript)

      // Set first scene as active by default
      if (parsedScript.scenes && parsedScript.scenes.length > 0) {
        setActiveSceneId(parsedScript.scenes[0].id)
      }
    }
  }, [])

  const handleSceneUpdate = (sceneId: string, updatedScene: any) => {
    if (!scriptJson) return

    const updatedScenes = scriptJson.scenes.map((scene: any) =>
      scene.id === sceneId ? { ...scene, ...updatedScene } : scene,
    )

    const updatedScript = {
      ...scriptJson,
      scenes: updatedScenes,
    }

    setScriptJson(updatedScript)
    localStorage.setItem("scriptJson", JSON.stringify(updatedScript))
  }

  const saveAndContinue = () => {
    if (!scriptJson) {
      toast({
        title: "Không có dữ liệu kịch bản",
        description: "Vui lòng quay lại trang kịch bản để tạo kịch bản",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    // Simulate saving to server
    setTimeout(() => {
      localStorage.setItem("finalScriptJson", JSON.stringify(scriptJson))
      setIsSaving(false)

      toast({
        title: "Lưu thành công",
        description: "Cấu hình cảnh đã được lưu",
      })

      router.push("/preview")
    }, 1000)
  }

  if (!scriptJson) {
    return (
      <div className="p-8 text-black bg-white ml-64">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold mb-4 text-black">Không tìm thấy dữ liệu kịch bản</h2>
          <p className="text-muted-foreground mb-6 text-black">Vui lòng quay lại trang kịch bản để tạo kịch bản trước</p>
          <Link href="/script">
            <Button className="text-black">Quay lại trang kịch bản</Button>
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
            <Button variant="outline" className="flex items-center">
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
              <SceneEditor scene={scene} onUpdate={(updatedScene) => handleSceneUpdate(scene.id, updatedScene)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
