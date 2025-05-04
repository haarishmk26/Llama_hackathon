"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MetricsSummary } from "@/components/MetricsSummary";
import { calculateMetrics } from "@/lib/calculateMetrics";

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
    metrics_section: {
      user_satisfaction: {
        percentage: number;
        description: string;
      };
      efficiency_improvement: {
        multiplier: number;
        description: string;
      };
      time_saved: {
        hours_per_week: number;
        description: string;
      };
      revenue_impact: {
        percentage: number;
        description: string;
      };
    };
  };
  original_feedback: Record<string, string>[];
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [calculatedMetrics, setCalculatedMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedAnalysis = localStorage.getItem("projectAnalysis");
    if (storedAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(storedAnalysis);
        setAnalysis(parsedAnalysis);

        // Calculate metrics from the feedback data
        const feedbackData = JSON.parse(
          localStorage.getItem("feedbackData") || "[]"
        );
        const metrics = calculateMetrics(feedbackData);
        setCalculatedMetrics(metrics);
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

  if (!analysis || !calculatedMetrics) {
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
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight mb-8">
            Analysis Results
          </h1>

          {/* Summary and Sentiment Analysis Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">
                  {summary_section.key_changes_narrative}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">
                  Sentiment Analysis
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">
                  {feedback_analysis_section.sentiment_summary}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-green-100 rounded-lg">
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
                  <div className="p-4 bg-gray-100 rounded-lg">
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
                  <div className="p-4 bg-red-100 rounded-lg">
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
              </CardContent>
            </Card>
          </div>

          {/* Metrics Summary */}
          <div className="mb-8">
            <MetricsSummary
              metrics={calculatedMetrics.metrics_section}
              sentimentScores={calculatedMetrics.sentiment_scores}
            />
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="changes" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="changes">Changes</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="changes">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
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
                      <h2 className="text-xl font-semibold mb-4">
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
                  <div className="grid gap-4">
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
