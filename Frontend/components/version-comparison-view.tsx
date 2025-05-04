"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VersionComparisonView() {
  const [currentScreen, setCurrentScreen] = useState(0)

  // Mock screen data
  const screens = [
    {
      name: "Onboarding: Welcome Screen",
      v1Image: "/placeholder.svg?width=300&height=600",
      v2Image: "/placeholder.svg?width=300&height=600",
    },
    {
      name: "Onboarding: Permissions",
      v1Image: "/placeholder.svg?width=300&height=600",
      v2Image: "/placeholder.svg?width=300&height=600",
    },
    {
      name: "Onboarding: Preferences",
      v1Image: "/placeholder.svg?width=300&height=600",
      v2Image: "/placeholder.svg?width=300&height=600",
    },
  ]

  const prevScreen = () => {
    setCurrentScreen((current) => (current > 0 ? current - 1 : current))
  }

  const nextScreen = () => {
    setCurrentScreen((current) => (current < screens.length - 1 ? current + 1 : current))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Screen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Screens</SelectItem>
            {screens.map((screen, index) => (
              <SelectItem key={index} value={`screen-${index}`}>
                {screen.name}
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
          <div className="text-center text-sm font-medium">Before</div>
          <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border p-2">
            <Image
              src={screens[currentScreen].v1Image || "/placeholder.svg"}
              alt={`${screens[currentScreen].name} - Before`}
              width={300}
              height={600}
              className="h-auto max-h-full w-auto"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-center text-sm font-medium">After</div>
          <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border p-2">
            <Image
              src={screens[currentScreen].v2Image || "/placeholder.svg"}
              alt={`${screens[currentScreen].name} - After`}
              width={300}
              height={600}
              className="h-auto max-h-full w-auto"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">{screens[currentScreen].name} - Changes</h3>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Reduced text content by approximately 40%</li>
          <li>Changed primary button color from blue to green</li>
          <li>Added illustrative icon to better explain feature purpose</li>
          <li>Increased font size from 14px to 16px for better readability</li>
          <li>Removed secondary navigation options to simplify screen</li>
        </ul>
      </div>
    </div>
  )
}
