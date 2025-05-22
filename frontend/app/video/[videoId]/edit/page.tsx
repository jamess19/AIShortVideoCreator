"use client"

import { Button } from "@/components/ui/button"
import Preview from "./_components/Preview"
import EditTabBar from "./_components/EditTabBar"
import TimeSlider from "./_components/TimeSlider"
import Timeline from "./_components/Timeline"
import { useState } from "react"

export default function EditVideoPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
        <div className="p-5 md:px-24 lg:px-32">
          <div className="grid grid-cols-6 gap-2 justify-center">
            <div className={isOpen ? 'col-span-2' : 'col-span-1'}>
              <EditTabBar isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          <div className={isOpen ? 'col-span-4 flex flex-col p-2' : 'col-span-5 flex flex-col p-2'}>
              <Preview/>
            </div>
          </div>
        </div>
      )
}
