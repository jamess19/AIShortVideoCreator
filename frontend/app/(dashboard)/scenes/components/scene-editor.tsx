"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { BackgroundSelector } from "./background-selector"
import { VoiceToneSelector } from "./voice-tone-selector"
import { Sparkles } from "lucide-react"
import { MusicSelector } from "./music-selector"
import { Scene } from "@/lib/models"

interface SceneEditorProps {
  scene: Scene
  onUpdate: (updatedScene: any) => void
  handleBackgroundChangeForParent: (content?: File, publicId?: string) => void
  handleMusicChangeForParent: (content?: File, publicId?: string) => void
}

export function SceneEditor({ scene, onUpdate, 
                              handleBackgroundChangeForParent,
                              handleMusicChangeForParent }: SceneEditorProps) {
  const [sceneText, setSceneText] = useState(scene.text || "")

  const handleTextChange = (text: string) => {
    setSceneText(text)
    onUpdate({ text })
  }
  const handleVoiceToneChange = (voiceTone: string) => {
    onUpdate({ voiceTone })
  }

  const improveTextWithAI = () => {
    // Simulate AI improvement
    setTimeout(() => {
      const improvedText = `${sceneText}\n\n[Cải thiện bởi AI: Thêm chi tiết và làm rõ nội dung]`
      setSceneText(improvedText)
      onUpdate({ text: improvedText })
    }, 1000)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">
            Cảnh: {scene.start_time}s - {scene.end_time}s
          </h2>
          <p className="text-sm text-muted-foreground">Thời lượng: {scene.end_time - scene.start_time} giây</p>
        </div>

        <Tabs defaultValue="text">
          <TabsList className="mb-4">
            <TabsTrigger value="text">Nội dung</TabsTrigger>
            <TabsTrigger value="background">Hình nền</TabsTrigger>
            <TabsTrigger value="music">Nhạc nền</TabsTrigger>
            <TabsTrigger value="voice">Giọng đọc</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Nội dung cảnh</h3>
              <Button variant="outline" size="sm" className="flex items-center bg-white" onClick={improveTextWithAI}>
                <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                Cải thiện với AI
              </Button>
            </div>

            <Textarea
              value={sceneText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Nhập nội dung cho cảnh này..."
              className="min-h-[200px] bg-white"
            />

            <div className="text-sm text-muted-foreground">
              Nội dung này sẽ được chuyển thành giọng nói trong video của bạn.
            </div>
          </TabsContent>

          <TabsContent value="background">
            <BackgroundSelector 
              currentBackground={scene.bg_image_public_id}
              onBackgroundChange={(content?: File, publicId?: string) => handleBackgroundChangeForParent(content, publicId)} />
          </TabsContent>

          <TabsContent value="music">
            <MusicSelector currentMusic={scene.bg_music_public_id} onMusicChange={(content?: File, publicId? : string) => handleMusicChangeForParent(content,publicId)} />
          </TabsContent>

          <TabsContent value="voice">
            <VoiceToneSelector currentVoiceTone={scene.voiceTone} onVoiceToneChange={handleVoiceToneChange} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
