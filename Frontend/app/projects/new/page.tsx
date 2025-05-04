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

// Types for our form data
interface FormState {
  oldUIImages: File[];
  newUIImages: File[];
  csvFile: File | null;
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

  const isFormValid =
    formState.oldUIImages.length > 0 &&
    formState.newUIImages.length > 0 &&
    formState.csvFile !== null;

  const handleSubmit = async () => {
    if (!isFormValid) return;

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
          // Ensure we have a valid value
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
                      description="Add screenshot of your old UI design"
                      files={formState.oldUIImages}
                      setFiles={(files) =>
                        setFormState((prev) => ({
                          ...prev,
                          oldUIImages: files,
                        }))
                      }
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="new-ui">
                  <AccordionTrigger>New UI Design</AccordionTrigger>
                  <AccordionContent forceMount>
                    <ImageUpload
                      label="Upload New UI Screenshot"
                      description="Add screenshot of your new UI design"
                      files={formState.newUIImages}
                      setFiles={(files) =>
                        setFormState((prev) => ({
                          ...prev,
                          newUIImages: files,
                        }))
                      }
                    />
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
                          const file = e.target.files?.[0] || null;
                          setFormState((prev) => ({ ...prev, csvFile: file }));
                        }}
                      />
                      {formState.csvFile ? (
                        <span className="mt-2 text-sm">
                          Uploaded: {formState.csvFile.name}
                        </span>
                      ) : (
                        <span className="mt-2 text-xs text-muted-foreground">
                          Drop or select a CSV file
                        </span>
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
