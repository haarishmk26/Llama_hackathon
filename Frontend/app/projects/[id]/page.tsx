"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImageDiffViewer from "@/components/image-diff-viewer"
import FeedbackList from "@/components/feedback-list"
import InsightSection from "@/components/insight-section"
import { Skeleton } from "@/components/ui/skeleton"

// Mock project data - in a real app, this would be fetched from an API
const mockProject = {
  id: "project-1",
  title: "Mobile App Onboarding Flow",
  description: "Analysis of changes between previous NPM package and new UI design",
  createdAt: "2023-05-01",
  summary: `The onboarding flow underwent significant simplification between the previous version and the new design, reducing the number of steps from 5 to 3 while maintaining all critical functionality. Key changes include combining account creation and preference selection into a single screen, eliminating redundant permission requests, introducing more visual cues and progress indicators, and simplifying language with approximately 40% less text.`,
  uiChanges: [
    {
      screenName: "Welcome Screen",
      beforeImage: "/placeholder.svg?width=300&height=600",
      afterImage: "/placeholder.svg?width=300&height=600",
      changes: [
        "Reduced text content by approximately 40%",
        "Changed primary button color from blue to green",
        "Added illustrative icon to better explain feature purpose",
        "Increased font size from 14px to 16px for better readability",
        "Removed secondary navigation options to simplify screen",
      ],
    },
    {
      screenName: "Permissions Screen",
      beforeImage: "/placeholder.svg?width=300&height=600",
      afterImage: "/placeholder.svg?width=300&height=600",
      changes: [
        "Consolidated multiple permission requests into a single screen",
        "Added explanatory text for each permission",
        "Implemented progressive disclosure pattern",
        "Replaced technical language with user-friendly descriptions",
        "Added ability to skip non-essential permissions",
      ],
    },
    {
      screenName: "Preferences Screen",
      beforeImage: "/placeholder.svg?width=300&height=600",
      afterImage: "/placeholder.svg?width=300&height=600",
      changes: [
        "Combined with account creation screen",
        "Reduced number of required fields from 8 to 4",
        "Added visual toggles instead of checkboxes",
        "Implemented smart defaults based on user context",
        "Added progress indicator showing completion status",
      ],
    },
  ],
  feedbackInsights: {
    summary:
      "User feedback for the previous version highlighted frustration with the lengthy onboarding process, confusion about permission requests, and excessive text. The new design directly addresses these pain points.",
    sentimentDistribution: {
      positive: 20,
      neutral: 20,
      negative: 60,
    },
    feedback: [
      {
        id: 1,
        user: "User 123",
        sentiment: "negative",
        text: "Too many screens to get through before I can use the app. Frustrating!",
        source: "App Store",
        date: "2023-04-15",
      },
      {
        id: 2,
        user: "User 456",
        sentiment: "negative",
        text: "The permission requests are confusing. Why do you need all of these?",
        source: "In-App",
        date: "2023-04-18",
      },
      {
        id: 3,
        user: "User 789",
        sentiment: "neutral",
        text: "Onboarding is detailed but takes too long. Could be more streamlined.",
        source: "Support Ticket",
        date: "2023-04-20",
      },
      {
        id: 4,
        user: "User 101",
        sentiment: "negative",
        text: "Too much text to read during setup. Just let me use the app!",
        source: "In-App",
        date: "2023-04-22",
      },
      {
        id: 5,
        user: "User 202",
        sentiment: "positive",
        text: "I like the app overall, but the onboarding takes too many steps.",
        source: "NPS Survey",
        date: "2023-04-25",
      },
    ],
    addressedIssues: [
      "Lengthy onboarding process",
      "Confusing permission requests",
      "Excessive text and reading",
      "Too many required fields",
    ],
    outstandingIssues: ["Limited customization options", "No way to return to previous steps"],
  },
}

export default function ProjectPage() {
  const [project, setProject] = useState<typeof mockProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    const fetchProject = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProject(mockProject)
      setLoading(false)
    }

    fetchProject()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-8 h-[400px] w-full" />
            </div>
          ) : project ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                <p className="text-muted-foreground">{project.description}</p>
              </div>

              <Tabs defaultValue="summary" className="space-y-4">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="ui-changes">UI Changes</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Changes Addressed</CardTitle>
                      <CardDescription>Major improvements based on feedback</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <InsightSection
                        summary={project.summary}
                        addressedIssues={project.feedbackInsights.addressedIssues}
                        outstandingIssues={project.feedbackInsights.outstandingIssues}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ui-changes" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Visual Comparison</CardTitle>
                      <CardDescription>Side-by-side view of interface changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ImageDiffViewer screens={project.uiChanges} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Feedback Analysis</CardTitle>
                      <CardDescription>Sentiment and thematic analysis of previous version</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FeedbackList
                        feedbackSummary={project.feedbackInsights.summary}
                        sentimentDistribution={project.feedbackInsights.sentimentDistribution}
                        feedback={project.feedbackInsights.feedback}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <p>Project not found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
