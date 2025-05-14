import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { ImageIcon, Type, Sticker } from 'lucide-react'
import MusicPanel from './music/musicPanel'
import TextPanel from './TextPanel'
import EmojiPanel from './EmojiPanel'

function EditTabBar() {
  return (
    <div>
        <div className="w-full p-2">
      <div className="transition-all duration-300 bg-gray-100 shadow-md rounded-sm h-screen w-full">
        <div className="w-full h-full overflow-hidden">
        <Tabs defaultValue="music" className="flex flex-col h-full justify-between">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger
              value="music"
              className="rounded-sm m-2 border-1 hover:bg-gray-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white "
            >
              <div className="flex items-center justify-center p-2">
                <ImageIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-bold text-sm">
                  Music
                </span>
              </div>
            </TabsTrigger>

            <TabsTrigger value="text" 
            className="rounded-sm m-2 border-1 hover:bg-gray-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <div className="flex items-center justify-center p-2">
                <Type className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-bold text-sm">
                  Text
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="stickers"
              className="rounded-sm m-2 border-1 hover:bg-gray-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <div className="flex items-center justify-center p-2">
                <Sticker className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-bold text-sm">
                  Sticker
                </span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="music"
            className="overflow-auto flex-grow my-2">
            <MusicPanel />
          </TabsContent>
          <TabsContent value="text" className="p-4 overflow-auto flex-grow">
            <TextPanel/>
          </TabsContent>
          <TabsContent value="stickers" className="p-4 overflow-auto flex-grow">
            <EmojiPanel/>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
    </div>
  )
}

export default EditTabBar