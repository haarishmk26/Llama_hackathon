"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Feedback = {
  id: number
  user: string
  sentiment: "positive" | "neutral" | "negative"
  text: string
  source: string
  date: string
}

type SentimentDistribution = {
  positive: number
  neutral: number
  negative: number
}

type FeedbackListProps = {
  feedbackSummary: string
  sentimentDistribution: SentimentDistribution
  feedback: Feedback[]
}

export default function FeedbackList({ feedbackSummary, sentimentDistribution, feedback }: FeedbackListProps) {
  const [sentimentFilter, setSentimentFilter] = useState("all")

  // Filter feedback based on selected sentiment
  const filteredFeedback =
    sentimentFilter === "all" ? feedback : feedback.filter((item) => item.sentiment === sentimentFilter)

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted p-4">
        <p className="text-sm">{feedbackSummary}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg border p-3">
          <div className="text-xl font-bold text-emerald-500">{sentimentDistribution.positive}%</div>
          <div className="text-xs text-muted-foreground">Positive</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xl font-bold text-amber-500">{sentimentDistribution.neutral}%</div>
          <div className="text-xs text-muted-foreground">Neutral</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xl font-bold text-red-500">{sentimentDistribution.negative}%</div>
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
