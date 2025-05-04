"use client"

import { useState } from "react"
import { Upload, X } from "lucide-react"

type FileUploadZoneProps = {
  versionNumber: number
  fileType: "image" | "document" | "data"
}

export default function FileUploadZone({ versionNumber, fileType }: FileUploadZoneProps) {
  const [files, setFiles] = useState<string[]>([])

  // In a real app, you'd handle actual file uploads
  const handleFileSelection = () => {
    // Mock file upload
    setFiles([
      ...files,
      `File-${Math.floor(Math.random() * 1000)}.${fileType === "image" ? "png" : fileType === "data" ? "csv" : "pdf"}`,
    ])
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  return (
    <div className="space-y-2">
      <div
        onClick={handleFileSelection}
        className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4 hover:bg-muted/50"
      >
        <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {fileType === "image"
            ? "Drag & drop screenshots or click to browse"
            : "Upload feedback data (CSV, TXT files)"}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between rounded-md border p-2">
              <span className="text-sm">{file}</span>
              <button onClick={() => removeFile(index)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
