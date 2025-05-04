import { NextResponse } from "next/server"
import { parseFeedback } from "@/lib/parseFeedback"
import { formatAnalysisPrompt } from "@/lib/formatPrompt"
import { callLlamaAPI } from "@/lib/callLlamaAPI"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Extract form data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const beforeImages = formData.getAll("beforeImages") as File[]
    const afterImages = formData.getAll("afterImages") as File[]
    const feedbackFile = formData.get("feedbackFile") as File | null

    // Validate required fields
    if (!title || beforeImages.length === 0 || afterImages.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process feedback if provided
    let feedback = []
    if (feedbackFile) {
      feedback = await parseFeedback(feedbackFile)
    }

    // In a real implementation, you would:
    // 1. Upload images to storage
    // 2. Process images to extract visual information

    // For now, we'll just use the file names as placeholders
    const beforeImageNames = beforeImages.map((img) => img.name)
    const afterImageNames = afterImages.map((img) => img.name)

    // Format prompt for LLM
    const prompt = formatAnalysisPrompt(title, beforeImageNames, afterImageNames, feedback)

    // Call LLM API
    const analysisResult = await callLlamaAPI(prompt)

    // Generate a project ID
    const projectId = `project-${Date.now()}`

    // Return analysis results
    return NextResponse.json({
      id: projectId,
      title,
      description,
      createdAt: new Date().toISOString(),
      summary: analysisResult.summary,
      uiChanges: analysisResult.uiChanges,
      feedbackInsights: analysisResult.feedbackInsights,
    })
  } catch (error) {
    console.error("Error processing analysis:", error)
    return NextResponse.json({ error: "Failed to analyze project" }, { status: 500 })
  }
}
