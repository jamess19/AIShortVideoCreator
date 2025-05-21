"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Play, Volume2, ArrowRight } from "lucide-react";
import { ScriptSuggestions } from "./components/script-suggestion";

export default function ScriptPage() {
  const [selectedVoice, setSelectedVoice] = useState("minh-anh");
  const [scriptDuration, setScriptDuration] = useState(30);
  const [volumeLevel, setVolumeLevel] = useState(80);

  const voices = [
    { id: "minh-anh", name: "Minh Anh", gender: "Nữ" },
    { id: "hoang-nam", name: "Hoàng Nam", gender: "Nam" },
    { id: "thu-ha", name: "Thu Hà", gender: "Nữ" },
    { id: "quang-minh", name: "Quang Minh", gender: "Nam" },
  ];

  return (
    <div className="p-8 text-black bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2">
        Soạn kịch bản & Chọn giọng đọc
      </h1>
      <p className="text-gray-600 mb-6">
        Viết kịch bản cho video của bạn hoặc để AI gợi ý nội dung
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 border border-gray-300 rounded-lg p-6">
          <Tabs defaultValue="write">
            <TabsList className="mb-4 bg-gray-100 rounded-lg">
              <TabsTrigger
                value="write"
                className="px-4 data-[state=active]:bg-white data-[state=active]:text-gray-800"
              >
                Viết kịch bản
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="px-4 data-[state=active]:bg-white data-[state=active]:text-gray-800"
              >
                Gợi ý AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write">
              <div className="mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-gray-500">
                  Thời lượng: {scriptDuration} giây
                </span>

                <Button
                  variant="outline"
                  className="ml-auto flex items-center gap-2 text-purple-600 border-purple-200 bg-white hover:bg-purple-50"
                >
                  <span>Cải thiện</span>
                </Button>
              </div>

              <Textarea
                placeholder="Nhập kịch bản của bạn ở đây..."
                className="min-h-[240px] mb-4 resize-none border-gray-300 bg-gray-50 focus:ring-gray-300 focus:border-gray-500"
              />

              <div className="flex items-center gap-2">
                <span className="text-gray-600 min-w-[80px]">Thời lượng:</span>
                <Slider
                  value={[scriptDuration]}
                  min={5}
                  max={120}
                  step={1}
                  onValueChange={(value: number[]) =>
                    setScriptDuration(value[0])
                  }
                  className="flex-1 mr-2 text-purple-600"
                />
                <span className="text-gray-600 min-w-[60px]">
                  {scriptDuration} giây
                </span>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <ScriptSuggestions />
            </TabsContent>
          </Tabs>
        </div>

        {/* Voice selection section */}
        <div className="w-full md:w-1/3 border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Chọn giọng đọc</h2>

          <div className="space-y-3">
            {voices.map((voice) => (
              <div
                key={voice.id}
                className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer ${
                  selectedVoice === voice.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedVoice(voice.id)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedVoice === voice.id
                        ? "border-purple-600"
                        : "border-gray-400"
                    }`}
                  >
                    {selectedVoice === voice.id && (
                      <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    )}
                  </div>
                  <span className="ml-3 font-medium">{voice.name}</span>
                  <span className="ml-2 text-gray-500 text-sm">
                    ({voice.gender})
                  </span>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
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

          <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2">
            <span>Xem trước video</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
