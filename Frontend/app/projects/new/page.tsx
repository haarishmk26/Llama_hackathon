"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/image-upload";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// Constants
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB (slightly less than Flask's 16MB limit)
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Types for our form data
interface FormState {
  oldUIImages: File[];
  newUIImages: File[];
  csvFile: File | null;
}

// Types for validation errors
interface ValidationError {
  field: string;
  message: string;
}

// Types for our API response
interface AnalysisResponse {
  summary_section: {
    key_changes_narrative: string;
    addressed_issues: string[];
    outstanding_issues: string[];
  };
  feedback_analysis_section: {
    sentiment_summary: string;
    sentiment_scores: {
      positive_percent: number;
      neutral_percent: number;
      negative_percent: number;
    };
  };
}

export default function NewProject() {
  const router = useRouter();

  // Form state
  const [formState, setFormState] = useState<FormState>({
    oldUIImages: [],
    newUIImages: [],
    csvFile: null,
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );

  // Validation functions
  const validateFile = (file: File, type: "image" | "csv"): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(
        1
      )}MB limit`;
    }

    if (type === "image" && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Invalid image type. Please use JPEG, PNG, or WebP";
    }

    if (type === "csv" && file.type !== "text/csv") {
      return "Invalid file type. Please upload a CSV file";
    }

    return null;
  };

  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];

    if (formState.oldUIImages.length === 0) {
      errors.push({
        field: "oldUI",
        message: "Please upload the old UI image",
      });
    } else {
      const error = validateFile(formState.oldUIImages[0], "image");
      if (error) errors.push({ field: "oldUI", message: error });
    }

    if (formState.newUIImages.length === 0) {
      errors.push({
        field: "newUI",
        message: "Please upload the new UI image",
      });
    } else {
      const error = validateFile(formState.newUIImages[0], "image");
      if (error) errors.push({ field: "newUI", message: error });
    }

    if (!formState.csvFile) {
      errors.push({
        field: "csv",
        message: "Please upload the feedback CSV file",
      });
    } else {
      const error = validateFile(formState.csvFile, "csv");
      if (error) errors.push({ field: "csv", message: error });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleFileChange = (files: File[], type: "oldUI" | "newUI" | "csv") => {
    const file = files[0];
    if (!file) return;

    const error = validateFile(file, type === "csv" ? "csv" : "image");
    if (error) {
      setValidationErrors((prev) => [...prev, { field: type, message: error }]);
      return;
    }

    setValidationErrors((prev) => prev.filter((e) => e.field !== type));

    switch (type) {
      case "oldUI":
        setFormState((prev) => ({ ...prev, oldUIImages: files }));
        break;
      case "newUI":
        setFormState((prev) => ({ ...prev, newUIImages: files }));
        break;
      case "csv":
        setFormState((prev) => ({ ...prev, csvFile: file }));
        break;
    }
  };

  const isFormValid =
    formState.oldUIImages.length > 0 &&
    formState.newUIImages.length > 0 &&
    formState.csvFile !== null &&
    validationErrors.length === 0;

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Read and sanitize CSV file
      const csvText = await formState.csvFile?.text();
      if (!csvText) {
        throw new Error("Could not read CSV file");
      }

      // Remove any HTML/XML-like content and BOM
      const cleanCsvText = csvText
        .replace(/^\uFEFF/, "") // Remove BOM if present
        .replace(/<[^>]*>/g, "") // Remove HTML/XML tags
        .trim();

      // Split into lines and filter out empty ones
      const lines = cleanCsvText
        .split(/[\r\n]+/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length < 2) {
        throw new Error(
          "CSV file must contain headers and at least one data row"
        );
      }

      // Parse headers and clean them
      const headers = lines[0]
        .split(",")
        .map((header) => header.trim())
        .filter((header) => header.length > 0);

      // Parse data rows
      const jsonData = lines.slice(1).map((line) => {
        const values = line.split(",").map((value) => value.trim());
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || "";
          return obj;
        }, {} as Record<string, string>);
      });

      // Create FormData with sanitized content
      const formData = new FormData();
      formData.append("beforeImage", formState.oldUIImages[0]);
      formData.append("afterImage", formState.newUIImages[0]);
      formData.append("feedback", JSON.stringify(jsonData));

      const response = await fetch(
        "http://127.0.0.1:5000/api/analyze-changes",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || "Failed to analyze changes");
      }

      const data: AnalysisResponse = await response.json();
      localStorage.setItem("projectAnalysis", JSON.stringify(data));

      const projectId = new Date().toISOString().replace(/[^0-9]/g, "");
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-20 items-center py-6 px-2 md:px-0">
          <Link href="/" className="flex items-center gap-3">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-lg font-semibold">Back to Projects</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-background">
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-center">
            Create New Project
          </h1>
          <p className="mb-8 text-muted-foreground text-center text-base">
            Compare your previous UI with your new design
          </p>
          <Card className="mb-8 w-full max-w-2xl shadow-lg">
            <CardContent className="pt-8 pb-8 px-6">
              <Accordion type="multiple" defaultValue={["old-ui"]}>
                <AccordionItem value="old-ui">
                  <AccordionTrigger>Old UI Design</AccordionTrigger>
                  <AccordionContent forceMount>
                    <ImageUpload
                      label="Upload Old UI Screenshot"
                      description={`Add screenshot of your old UI design (Max ${(
                        MAX_FILE_SIZE /
                        (1024 * 1024)
                      ).toFixed(1)}MB)`}
                      files={formState.oldUIImages}
                      setFiles={(files) => handleFileChange(files, "oldUI")}
                    />
                    {validationErrors.find((e) => e.field === "oldUI") && (
                      <p className="mt-2 text-sm text-red-500">
                        {
                          validationErrors.find((e) => e.field === "oldUI")
                            ?.message
                        }
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="new-ui">
                  <AccordionTrigger>New UI Design</AccordionTrigger>
                  <AccordionContent forceMount>
                    <ImageUpload
                      label="Upload New UI Screenshot"
                      description={`Add screenshot of your new UI design (Max ${(
                        MAX_FILE_SIZE /
                        (1024 * 1024)
                      ).toFixed(1)}MB)`}
                      files={formState.newUIImages}
                      setFiles={(files) => handleFileChange(files, "newUI")}
                    />
                    {validationErrors.find((e) => e.field === "newUI") && (
                      <p className="mt-2 text-sm text-red-500">
                        {
                          validationErrors.find((e) => e.field === "newUI")
                            ?.message
                        }
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="csv">
                  <AccordionTrigger>Upload CSV Document</AccordionTrigger>
                  <AccordionContent forceMount>
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4 hover:bg-muted/50 cursor-pointer mt-4">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const files = e.target.files
                            ? Array.from(e.target.files)
                            : [];
                          handleFileChange(files, "csv");
                        }}
                      />
                      {formState.csvFile ? (
                        <span className="mt-2 text-sm">
                          Uploaded: {formState.csvFile.name}
                        </span>
                      ) : (
                        <span className="mt-2 text-xs text-muted-foreground">
                          Drop or select a CSV file (Max{" "}
                          {(MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)}MB)
                        </span>
                      )}
                      {validationErrors.find((e) => e.field === "csv") && (
                        <p className="mt-2 text-sm text-red-500">
                          {
                            validationErrors.find((e) => e.field === "csv")
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <div className="flex justify-center w-full mb-12">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="rounded-full px-8 py-3 font-semibold text-base shadow-md bg-green-600 text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
            >
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
          {submitError && (
            <div className="mb-8 text-center text-red-500 font-medium">
              {submitError}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
