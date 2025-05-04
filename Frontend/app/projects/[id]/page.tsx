"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// Updated type to match Flask backend response
interface AnalysisResult {
  analysis: {
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
  };
  original_feedback: Record<string, string>[];
}

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
        console.error("Error parsing analysis:", e);
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

  const { summary_section, feedback_analysis_section } = analysis.analysis;

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
              <TabsTrigger value="changes">Changes</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Key Changes</h2>
                    <p className="whitespace-pre-wrap">
                      {summary_section.key_changes_narrative}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Sentiment Analysis
                    </h2>
                    <p className="whitespace-pre-wrap">
                      {feedback_analysis_section.sentiment_summary}
                    </p>
                    <div className="mt-4 flex gap-4">
                      <div className="flex-1 p-4 bg-green-100 rounded-lg">
                        <p className="text-center text-green-800">
                          <span className="block text-2xl font-bold">
                            {
                              feedback_analysis_section.sentiment_scores
                                .positive_percent
                            }
                            %
                          </span>
                          <span className="text-sm">Positive</span>
                        </p>
                      </div>
                      <div className="flex-1 p-4 bg-gray-100 rounded-lg">
                        <p className="text-center text-gray-800">
                          <span className="block text-2xl font-bold">
                            {
                              feedback_analysis_section.sentiment_scores
                                .neutral_percent
                            }
                            %
                          </span>
                          <span className="text-sm">Neutral</span>
                        </p>
                      </div>
                      <div className="flex-1 p-4 bg-red-100 rounded-lg">
                        <p className="text-center text-red-800">
                          <span className="block text-2xl font-bold">
                            {
                              feedback_analysis_section.sentiment_scores
                                .negative_percent
                            }
                            %
                          </span>
                          <span className="text-sm">Negative</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="changes">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Addressed Issues
                      </h2>
                      <ul className="list-disc pl-6 space-y-2">
                        {summary_section.addressed_issues.map(
                          (issue, index) => (
                            <li key={index} className="text-green-700">
                              {issue}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Outstanding Issues
                      </h2>
                      <ul className="list-disc pl-6 space-y-2">
                        {summary_section.outstanding_issues.map(
                          (issue, index) => (
                            <li key={index} className="text-red-700">
                              {issue}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {analysis.original_feedback.map((feedback, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <p className="font-semibold">
                          {feedback["User Name"]} ({feedback["User Role"]})
                        </p>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Pain Points:</p>
                          <p>{feedback["Pain Points"] || "N/A"}</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            Suggested Improvements:
                          </p>
                          <p>{feedback["Suggested Improvements"] || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
