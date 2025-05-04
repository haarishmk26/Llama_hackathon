import { CheckCircle2, AlertCircle } from "lucide-react"

type InsightSectionProps = {
  summary: string
  addressedIssues: string[]
  outstandingIssues: string[]
}

export default function InsightSection({ summary, addressedIssues, outstandingIssues }: InsightSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p>{summary}</p>
      </div>

      <div className="space-y-4">
        <h3 className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          Issues Addressed
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          {addressedIssues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
      </div>

      {outstandingIssues.length > 0 && (
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-medium">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Outstanding Issues
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            {outstandingIssues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
