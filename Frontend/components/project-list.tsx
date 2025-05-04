import Link from "next/link"
import { ImageIcon, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ProjectList() {
  const projects = [
    {
      id: "project-1",
      title: "Mobile App Onboarding Flow",
      updatedAt: "2 days ago",
      versions: ["v1.0", "v2.0"],
      hasVisual: true,
      hasFeedback: true,
    },
    {
      id: "project-2",
      title: "Checkout Process Redesign",
      updatedAt: "1 week ago",
      versions: ["Current", "Proposed"],
      hasVisual: true,
      hasFeedback: false,
    },
    {
      id: "project-3",
      title: "Settings Page Layout",
      updatedAt: "2 weeks ago",
      versions: ["v1", "v2", "v3"],
      hasVisual: true,
      hasFeedback: true,
    },
  ]

  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`} className="block">
          <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50">
            <div className="grid gap-1">
              <div className="font-medium">{project.title}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{project.updatedAt}</span>
                <span>•</span>
                <span>{project.versions.join(" → ")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {project.hasVisual && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  <span className="text-xs">UI</span>
                </Badge>
              )}
              {project.hasFeedback && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span className="text-xs">Feedback</span>
                </Badge>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
