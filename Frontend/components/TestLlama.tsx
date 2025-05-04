"use client";

import { useState } from "react";
import { analyzeSentiment, calculateMetrics } from "@/utils/llama-client";
import { Button } from "@/components/ui/button";

export default function TestLlama() {
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [requestDetails, setRequestDetails] = useState<string>("");

  const testData = [
    {
      feedback: "The new UI is much better and easier to use",
      csat_score: 4.5,
      task_time: 45,
    },
    {
      feedback: "Still needs some improvements in navigation",
      csat_score: 3.5,
      task_time: 60,
    },
  ];

  const runTest = async () => {
    setLoading(true);
    setError("");
    setResult("");
    setRequestDetails(JSON.stringify(testData, null, 2));

    try {
      // Test sentiment analysis
      console.log("Sending sentiment analysis request...");
      const sentimentResult = await analyzeSentiment(testData);
      console.log("Sentiment Analysis Result:", sentimentResult);

      // Test metrics calculation
      console.log("Sending metrics calculation request...");
      const metricsResult = await calculateMetrics(testData);
      console.log("Metrics Calculation Result:", metricsResult);

      setResult(
        JSON.stringify(
          {
            sentiment: sentimentResult,
            metrics: metricsResult,
          },
          null,
          2
        )
      );
    } catch (err) {
      console.error("Test Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Llama API Test</h2>

      <div className="space-y-4">
        <Button
          onClick={runTest}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          {loading ? "Testing..." : "Run Test"}
        </Button>

        {requestDetails && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Request Data:</h3>
            <pre className="p-4 bg-gray-100 rounded-md overflow-auto text-sm">
              {requestDetails}
            </pre>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            <h3 className="text-lg font-semibold">Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Response:</h3>
            <pre className="p-4 bg-gray-100 rounded-md overflow-auto text-sm">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
