"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Screen = {
  screenName: string
  beforeImage: string
  afterImage: string
  changes: string[]
}

type ImageDiffViewerProps = {
  screens: Screen[]
}

export default function ImageDiffViewer({ screens }: ImageDiffViewerProps) {
  const [currentScreen, setCurrentScreen] = useState(0)

  const prevScreen = () => {
    setCurrentScreen((current) => (current > 0 ? current - 1 : current))
  }

  const nextScreen = () => {
    setCurrentScreen((current) => (current < screens.length - 1 ? current + 1 : current))
  }

  const handleScreenChange = (value: string) => {
    const index = Number.parseInt(value)
    if (!isNaN(index) && index >= 0 && index < screens.length) {
      setCurrentScreen(index)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={currentScreen.toString()} onValueChange={handleScreenChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select screen" />
          </SelectTrigger>
          <SelectContent>
            {screens.map((screen, index) => (
              <SelectItem key={index} value={index.toString()}>
                {screen.screenName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevScreen} disabled={currentScreen === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {currentScreen + 1} of {screens.length}
          </span>
          <Button variant="outline" size="icon" onClick={nextScreen} disabled={currentScreen === screens.length - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8">
        <div className="space-y-2">
          <div className="text-center text-sm font-medium">
            <span className="inline-block bg-slate-100 px-3 py-1 rounded-md">Before</span>
          </div>
          <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border p-2 relative">
            <div className="absolute top-2 left-2 bg-slate-100 text-xs px-2 py-1 rounded-md opacity-75">
              Previous UI
            </div>
            <Image
              src={screens[currentScreen].beforeImage || "/placeholder.svg"}
              alt={`${screens[currentScreen].screenName} - Before`}
              width={300}
              height={600}
              className="h-auto max-h-full w-auto"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-center text-sm font-medium">
            <span className="inline-block bg-slate-100 px-3 py-1 rounded-md">After</span>
          </div>
          <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border p-2 relative">
            <div className="absolute top-2 left-2 bg-slate-100 text-xs px-2 py-1 rounded-md opacity-75">New UI</div>
            <Image
              src={screens[currentScreen].afterImage || "/placeholder.svg"}
              alt={`${screens[currentScreen].screenName} - After`}
              width={300}
              height={600}
              className="h-auto max-h-full w-auto"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">{screens[currentScreen].screenName} - Changes</h3>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          {screens[currentScreen].changes.map((change, index) => (
            <li key={index}>{change}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
