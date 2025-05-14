"use client"

import { Button } from "@/components/ui/button"
import Preview from "./_components/Preview"
import EditTabBar from "./_components/EditTabBar"
import Timeline from "./_components/Timeline"
export default function EditVideoPage() {

  return (
        <div className="p-10 md:px-24 lg:px-32">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-2xl"> Edit Video </h2>
            <Button className='bg-purple-600 text-white hover:bg-purple-500'> Export Video </Button>
          </div>

          <div className="grid grid-cols-6">
            <div className='col-span-2'>
              <EditTabBar/>
            </div>

            <div className='col-span-4 flex flex-col p-2'>
              <Preview/>
              <Timeline/>
            </div>
          </div>
        </div>
      )
}
