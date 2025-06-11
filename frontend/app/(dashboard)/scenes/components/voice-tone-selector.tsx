"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Volume2 } from "lucide-react"

interface VoiceToneSelectorProps {
  currentVoiceTone: string
  onVoiceToneChange: (voiceTone: string) => void
}

export function VoiceToneSelector({ currentVoiceTone, onVoiceToneChange }: VoiceToneSelectorProps) {
  const [selectedTone, setSelectedTone] = useState<string>(currentVoiceTone || "neutral")
  const [isPlaying, setIsPlaying] = useState<string | null>(null)

  const voiceTones = [
    {
      id: "enthusiastic",
      name: "Nhiệt tình",
      description: "Giọng nói năng động, hứng khởi",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      id: "informative",
      name: "Thông tin",
      description: "Giọng nói rõ ràng, chuyên nghiệp",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      id: "motivational",
      name: "Động viên",
      description: "Giọng nói truyền cảm hứng, tích cực",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      id: "calm",
      name: "Bình tĩnh",
      description: "Giọng nói nhẹ nhàng, thư giãn",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      id: "friendly",
      name: "Thân thiện",
      description: "Giọng nói ấm áp, gần gũi",
      color: "bg-pink-100 text-pink-800 border-pink-200",
    },
    {
      id: "neutral",
      name: "Trung tính",
      description: "Giọng nói cân bằng, tự nhiên",
      color: "bg-gray-100 text-gray-800 border-gray-200",
    },
  ]

  const handleToneSelect = (toneId: string) => {
    setSelectedTone(toneId)
    onVoiceToneChange(toneId)
  }

  const togglePlay = (toneId: string) => {
    if (isPlaying === toneId) {
      setIsPlaying(null)
    } else {
      setIsPlaying(toneId)
      // In a real app, this would play a sample of the voice tone
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Chọn tông giọng</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Tông giọng sẽ ảnh hưởng đến cách AI đọc nội dung của cảnh này
        </p>
      </div>

      <RadioGroup value={selectedTone} onValueChange={handleToneSelect} className="space-y-3">
        {voiceTones.map((tone) => (
          <Card
            key={tone.id}
            className={`cursor-pointer transition-all ${
              selectedTone === tone.id ? "ring-2 ring-purple-500 border-purple-300" : "hover:border-purple-200"
            }`}
            onClick={() => handleToneSelect(tone.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={tone.id} id={tone.id} />
                  <div>
                    <Label htmlFor={tone.id} className="cursor-pointer">
                      <div className="font-medium">{tone.name}</div>
                      <div className="text-sm text-muted-foreground">{tone.description}</div>
                    </Label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${tone.color}`}>{tone.name}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlay(tone.id)
                    }}
                    className="h-8 w-8"
                  >
                    {isPlaying === tone.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <div className="flex items-center">
          <Volume2 className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">Tông giọng đã chọn: </span>
          <span className="text-sm text-blue-700 ml-1">
            {voiceTones.find((tone) => tone.id === selectedTone)?.name}
          </span>
        </div>
      </div>
    </div>
  )
}
