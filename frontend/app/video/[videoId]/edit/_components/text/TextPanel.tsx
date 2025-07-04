import { Textarea } from '@/components/ui/textarea'
import { useVideoContext } from '@/hooks/use-video-context'
import React, { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

function TextPanel() 
{
  const {addTextAttachment, videoData} = useVideoContext()
  const [text, setText] = useState("")
  const [fontSize, setFont] = useState(24)
  const [color, setColor] = useState("#ffffff")
  const [fontFamily, setFontFamily] = useState("Arial")
  const [startTime, setStart] = useState(0);
  const [endTime, setEnd] = useState(0);

  const handleAddText = () => {
    if (!text.trim() || !videoData) return

    addTextAttachment({
      id: 'something',
      content: text,
      position: { x: 50, y: 50 },
      style: {
        fontSize,
        color,
        fontFamily,
      },
      startTime: videoData.currentTime,
      endTime: videoData.duration,
    })

    setText("")
  }
  return (
    <div>
        <Label className='text-lg font-bold'>Thêm văn bản</Label>
        <Textarea className=' mt-1 bg-white' 
        placeholder='Nhập nội dung văn bản...'
        value={text}
        onChange={(e) => setText(e.target.value)}/>

        <div className="grid grid-cols-2 gap-2 mt-4">
        <div className='space-y-2'>
          <Label htmlFor="fontSize">Cỡ chữ</Label>
          <Input
            id="fontSize"
            type="number"
            value={fontSize}
            onChange={(e) => setFont(Number(e.target.value))}
            min={10}
            step={2}
            max={100}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor="color">Màu sắc</Label>
          <Input
            id="color" 
            type="color" 
            value={color} onChange={(e) => setColor(e.target.value)} 
          />
        </div>
      </div>
      <div className='space-y-2 mt-4 mb-4'>
        <Label htmlFor="fontFamily">Font chữ</Label>
        <Select onValueChange={(v) => setFontFamily(v)}>
              <SelectTrigger className="w-[180px] z-10">
                <SelectValue placeholder="Arial" />
              </SelectTrigger>
                <SelectContent className='bg-white'>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
              </SelectContent>
            </Select>
      </div>
      
      <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white" onClick={handleAddText}>
        Thêm văn bản
      </Button>
    </div>
  )
}


export default TextPanel