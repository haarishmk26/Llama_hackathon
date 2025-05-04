import Link from "next/link"
import Image from "next/image"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import ProjectList from "@/components/project-list"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Artifact Logo" width={32} height={32} className="h-8 w-8" />
            <span className="text-xl font-semibold">Artifact</span>
          </div>
          <Link href="/projects/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Recent Projects</h1>
            <p className="text-muted-foreground">Analyze UI changes and their impact on user experience</p>
          </div>

          <div className="space-y-4">
            <ProjectList />
          </div>
        </div>
      </main>
    </div>
  )
}
