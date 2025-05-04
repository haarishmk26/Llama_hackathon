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

export default function NewProject() {
  const router = useRouter();
  const [oldUIImages, setOldUIImages] = useState<File[]>([]);
  const [newUIImages, setNewUIImages] = useState<File[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (oldUIImages.length === 0 || newUIImages.length === 0 || !csvFile) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, this would send the data to the server
      // For now, we'll just simulate a delay and redirect to a mock project
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to the project page
      router.push("/projects/project-1");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <main className="flex-1 bg-background">
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-center">
            Create New Project
          </h1>
          <p className="mb-8 text-muted-foreground text-center">
            Compare your previous UI with your new design
          </p>

          <Card className="mb-8 w-full max-w-2xl shadow-lg">
            <CardContent className="pt-6">
              <Accordion
                selectionMode="multiple"
                defaultSelectedKeys={["old-ui"]}
                variant="splitted"
              >
                <AccordionItem value="old-ui">
                  <AccordionTrigger>Old UI Design</AccordionTrigger>
                  <AccordionContent>
                    <ImageUpload
                      label="Upload Old UI Screenshot"
                      description="Add screenshot of your old UI design"
                      files={oldUIImages}
                      setFiles={setOldUIImages}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="new-ui">
                  <AccordionTrigger>New UI Design</AccordionTrigger>
                  <AccordionContent>
                    <ImageUpload
                      label="Upload New UI Screenshot"
                      description="Add screenshot of your new UI design"
                      files={newUIImages}
                      setFiles={setNewUIImages}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="csv">
                  <AccordionTrigger>Upload CSV Document</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4 hover:bg-muted/50 cursor-pointer mt-4">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setCsvFile(e.target.files[0]);
                          }
                        }}
                      />
                      {csvFile ? (
                        <span className="mt-2 text-sm">
                          Uploaded: {csvFile.name}
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
              disabled={
                isSubmitting ||
                oldUIImages.length === 0 ||
                newUIImages.length === 0 ||
                !csvFile
              }
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
        </div>
      </main>
    </div>
  );
}
