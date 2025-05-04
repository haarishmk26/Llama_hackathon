"use client"

import type React from "react"

import { useRef } from "react"
import { Upload, X, FileText, FileSpreadsheet } from "lucide-react"

type FeedbackUploadProps = {
  file: File | null
  setFile: (file: File | null) => void
}

export default function FeedbackUpload({ file, setFile }: FeedbackUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (extension === "csv" || extension === "xlsx" || extension === "xls") {
      return <FileSpreadsheet className="h-8 w-8" />
    }

    return <FileText className="h-8 w-8" />
  }

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4 hover:bg-muted/50"
      >
        <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">Upload User Feedback</p>
        <p className="text-xs text-muted-foreground">
          Add user feedback data for the previous UI version (CSV, TXT, or other text formats)
        </p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv,.txt,.pdf,.docx,.xlsx,.json"
          onChange={handleFileSelection}
        />
      </div>

      {file ? (
        <div className="rounded-md border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(file.name)}
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={removeFile} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-20 items-center justify-center rounded-md border border-dashed">
          <div className="flex flex-col items-center text-muted-foreground">
            <FileText className="mb-1 h-8 w-8" />
            <span className="text-xs">No feedback file uploaded (optional)</span>
          </div>
        </div>
      )}

      <div className="rounded-md bg-muted p-3">
        <p className="text-xs text-muted-foreground">
          Supported formats: CSV (for structured feedback), TXT (for unstructured feedback), PDF, DOCX (for exported
          reports), and JSON (for API exports).
        </p>
      </div>
    </div>
  )
}
