import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { ImageIcon, Type, Sticker, ChevronLeft, ChevronsRight } from 'lucide-react'
import MusicPanel from './music/musicPanel'
import TextPanel from './text/TextPanel'
import EmojiPanel from './emoji/EmojiPanel'
import { Button } from '@/components/ui/button'

interface EditTabBarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditTabBar({ isOpen, setIsOpen }:EditTabBarProps) {
  return (

    <div className=" h-full">
      <div className={`relative transition-all duration-300 bg-gray-100 shadow-md rounded-sm h-screen ${
          isOpen ? 'w-[100%]' : 'w-[15%]'} overflow-hidden`}>
        <div className="flex items-center justify-end h-12 px-2 bg-gray-100">
          {isOpen && (
            <div className='m-auto font-bold text-xl'> Thêm sticker hoặc văn bản  </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white hover:bg-gray-100 rounded shadow-md transition-all duration-300"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronsRight size={20} />}
          </Button>
        </div>

        
        {isOpen && (<div className="w-full h-full">
        <Tabs defaultValue="text" className="flex flex-col h-full justify-between">
          <TabsList className="grid grid-cols-2">
            {/* <TabsTrigger
              value="music"
              className="rounded-sm m-2 border-1 hover:bg-gray-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white "
            >
              <div className="flex items-center justify-center p-2">
                <ImageIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-bold text-sm">
                  Music
                </span>
              </div>
            </TabsTrigger> */}

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

          {/* <TabsContent
            value="music"
            className="overflow-auto flex-grow my-2">
            <MusicPanel />
          </TabsContent> */}
          <TabsContent value="text" className="p-4 overflow-auto flex-grow">
            <TextPanel/>
          </TabsContent>
          <TabsContent value="stickers" className="p-4 overflow-auto flex-grow">
            <EmojiPanel/>
          </TabsContent>
        </Tabs>
      </div>
        )}
      </div>
    </div>
  )
}

export default EditTabBar