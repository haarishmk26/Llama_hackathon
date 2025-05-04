export type Project = {
  id: string
  title: string
  description?: string
  createdAt: string
  screenshots: {
    before: string[]
    after: string[]
  }
  feedbackDoc?: string
  summary: string
  uiChanges: UIChange[]
  feedbackInsights: FeedbackInsights
}

export type UIChange = {
  screenName: string
  beforeImage: string
  afterImage: string
  changes: string[]
}

export type FeedbackItem = {
  id: number
  user: string
  sentiment: "positive" | "neutral" | "negative"
  text: string
  source: string
  date: string
}

export type FeedbackInsights = {
  summary: string
  sentimentDistribution: {
    positive: number
    neutral: number
    negative: number
  }
  feedback: FeedbackItem[]
  addressedIssues: string[]
  outstandingIssues: string[]
}
