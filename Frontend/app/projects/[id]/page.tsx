"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

type AnalysisResult = {
  summary: string;
  uiChanges: string[];
  feedback: string[];
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedAnalysis = localStorage.getItem("projectAnalysis");
    if (storedAnalysis) {
      try {
        setAnalysis(JSON.parse(storedAnalysis));
      } catch (e) {
        setError("Failed to load analysis results");
      }
    } else {
      setError("No analysis results found");
    }
  }, []);

  if (error) {
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
            <Card className="w-full max-w-2xl">
              <CardContent className="pt-6">
                <p className="text-center text-red-500">{error}</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!analysis) {
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
            <Card className="w-full max-w-2xl">
              <CardContent className="pt-6">
                <p className="text-center">Loading analysis results...</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
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
      <main className="flex-1 bg-background">
        <div className="container py-8">
          <h1 className="mb-8 text-3xl font-bold tracking-tight">
            Analysis Results
          </h1>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="ui-changes">UI Changes</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <Card>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-wrap">{analysis.summary}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ui-changes">
              <Card>
                <CardContent className="pt-6">
                  <ul className="list-disc pl-6 space-y-2">
                    {analysis.uiChanges.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardContent className="pt-6">
                  <ul className="list-disc pl-6 space-y-2">
                    {analysis.feedback.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
