"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

type ImageUploadProps = {
  label: string;
  description: string;
  files: File[];
  setFiles: (files: File[]) => void;
};

export default function ImageUpload({
  label,
  description,
  files,
  setFiles,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Create preview URLs
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Update files state
    setFiles([...files, ...selectedFiles]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);

    // Remove file and preview
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4 hover:bg-muted/50"
      >
        <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileSelection}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative rounded-md border">
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src={preview || "/placeholder.svg"}
                  alt={`Screenshot ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute -left-2 -top-2 rounded-full bg-background p-1 shadow-md hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="p-2 text-xs truncate">{files[index].name}</div>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <div className="flex h-20 items-center justify-center rounded-md border border-dashed">
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageIcon className="mb-1 h-8 w-8" />
            <span className="text-xs">No images uploaded yet</span>
          </div>
        </div>
      )}
    </div>
  );
}
