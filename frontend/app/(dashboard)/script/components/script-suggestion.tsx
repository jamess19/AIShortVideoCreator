"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, RefreshCw } from "lucide-react"
import { AutoGenerateScriptApi } from "@/services/video_script_api"

export function ScriptSuggestions({selectedContent, SetSelectedScriptForParent}: { selectedContent: any, SetSelectedScriptForParent: (script: string) => void }) {
  //const [keyword, setKeyword] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  
  const generateSuggestions = async () => {
    setIsGenerating(true)

    const request = {
        content: selectedContent.title,
        video_duration: 60, // Giả sử video có độ dài 60 giây
    };
    console.log("Request:", request);
    try{
        const response = await AutoGenerateScriptApi(request);

        if(response){
            if(response.message === "success"){
                setSuggestions([response.data]);
            }else{
                setSuggestions([]);
            }
        }

        setIsGenerating(false)
    } catch (error) {
        console.error("Error generating suggestions:", error)
        setIsGenerating(false)
    };
  }

  const handleSelectSuggestion = (suggestion: string) => {
    console.log("Selected suggestion:", suggestion)
    SetSelectedScriptForParent(suggestion)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {/* <Input
          placeholder="Nhập chủ đề hoặc từ khóa..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        /> */}
        <h3 className="font-medium">Gợi ý kịch bản về nội dung đã chọn từ AI</h3>
        <Button
          onClick={generateSuggestions}
          disabled={isGenerating || !selectedContent}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Gợi ý
        </Button>
      </div>

      {isGenerating && (
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 text-purple-600 animate-spin mb-2" />
            <p className="text-muted-foreground">Đang tạo gợi ý...</p>
          </div>
        </div>
      )}

      {!isGenerating && suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Gợi ý kịch bản:</h3>
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              className="hover:border-purple-400 cursor-pointer transition-colors"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <CardContent className="p-3">
                <p>{suggestion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
