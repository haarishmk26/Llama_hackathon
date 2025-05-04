"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeedbackSummary() {
  const [sentimentFilter, setSentimentFilter] = useState("all")

  // Mock feedback data
  const feedback = [
    {
      id: 1,
      user: "User 123",
      sentiment: "positive",
      text: "I like the app overall, but the onboarding takes too many steps.",
      source: "App Store",
      date: "2023-04-15",
    },
    {
      id: 2,
      user: "User 456",
      sentiment: "negative",
      text: "Too many screens to get through before I can use the app. Frustrating!",
      source: "In-App",
      date: "2023-04-18",
    },
    {
      id: 3,
      user: "User 789",
      sentiment: "negative",
      text: "The permission requests are confusing. Why do you need all of these?",
      source: "Support Ticket",
      date: "2023-04-20",
    },
    {
      id: 4,
      user: "User 101",
      sentiment: "neutral",
      text: "Onboarding is detailed but takes too long. Could be more streamlined.",
      source: "In-App",
      date: "2023-04-22",
    },
    {
      id: 5,
      user: "User 202",
      sentiment: "negative",
      text: "Too much text to read during setup. Just let me use the app!",
      source: "NPS Survey",
      date: "2023-04-25",
    },
  ]

  // Filter feedback based on selected sentiment
  const filteredFeedback =
    sentimentFilter === "all" ? feedback : feedback.filter((item) => item.sentiment === sentimentFilter)

  // Calculate sentiment distribution
  const positiveFeedback = feedback.filter((item) => item.sentiment === "positive").length
  const neutralFeedback = feedback.filter((item) => item.sentiment === "neutral").length
  const negativeFeedback = feedback.filter((item) => item.sentiment === "negative").length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg border p-3">
          <div className="text-xl font-bold text-emerald-500">
            {Math.round((positiveFeedback / feedback.length) * 100)}%
          </div>
          <div className="text-xs text-muted-foreground">Positive</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xl font-bold text-amber-500">
            {Math.round((neutralFeedback / feedback.length) * 100)}%
          </div>
          <div className="text-xs text-muted-foreground">Neutral</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xl font-bold text-red-500">
            {Math.round((negativeFeedback / feedback.length) * 100)}%
          </div>
          <div className="text-xs text-muted-foreground">Negative</div>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setSentimentFilter(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="neutral">Neutral</TabsTrigger>
          <TabsTrigger value="negative">Negative</TabsTrigger>
        </TabsList>

        <TabsContent value={sentimentFilter} className="mt-4 space-y-3">
          {filteredFeedback.length === 0 ? (
            <div className="py-3 text-center text-sm text-muted-foreground">No feedback matching this filter</div>
          ) : (
            filteredFeedback.map((item) => (
              <div key={item.id} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{item.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{item.user}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.source}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                </div>
                <p className="text-sm">{item.text}</p>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
