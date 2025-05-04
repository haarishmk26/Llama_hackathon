"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageUpload from "@/components/image-upload"
import { Card, CardContent } from "@/components/ui/card"

export default function NewProject() {
  const router = useRouter()
  const [npmPackage, setNpmPackage] = useState("")
  const [newUIImages, setNewUIImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!npmPackage || newUIImages.length === 0) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, this would send the data to the server
      // For now, we'll just simulate a delay and redirect to a mock project
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to the project page
      router.push("/projects/project-1")
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center py-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container max-w-4xl py-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="mb-8 text-muted-foreground">Compare your previous UI with your new design</p>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="npm-package">Previous UI NPM Package</Label>
                  <Input
                    id="npm-package"
                    placeholder="e.g., @company/ui-library@1.0.0"
                    value={npmPackage}
                    onChange={(e) => setNpmPackage(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the NPM package name of your previous UI library
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>New UI Design</Label>
                  <ImageUpload
                    label="Upload New UI Screenshot"
                    description="Add screenshot of your new UI design"
                    files={newUIImages}
                    setFiles={setNewUIImages}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isSubmitting || !npmPackage || newUIImages.length === 0}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Changes"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
