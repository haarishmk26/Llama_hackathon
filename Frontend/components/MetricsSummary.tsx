"use client";

import { Card, CardContent } from "@/components/ui/card";
import { User, TrendingUp } from "lucide-react";

interface MetricsSection {
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
}

interface MetricsSummaryProps {
  metrics: MetricsSection;
  sentimentScores: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export function MetricsSummary({
  metrics,
  sentimentScores,
}: MetricsSummaryProps) {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5" />
            <h2 className="text-xl font-bold">User Personas & Impact</h2>
          </div>
          <div className="text-sm text-gray-600">No metrics data available</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - User Personas & Impact */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5" />
          <h2 className="text-xl font-bold">User Personas & Impact</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Primary Users</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                Finance professionals who need detailed financial analytics and
                reporting.
              </li>
              <li>
                Small business owners managing their finances and expenses.
              </li>
              <li>Individuals tracking personal finances and budgets.</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-600 font-semibold">User Satisfaction</div>
            <div className="text-3xl font-bold text-blue-700">
              +{metrics.user_satisfaction.percentage}%
            </div>
            <div className="text-sm text-blue-600 mt-1">
              {metrics.user_satisfaction.description}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-purple-600 font-semibold">
              Efficiency Improvement
            </div>
            <div className="text-3xl font-bold text-purple-700">
              {metrics.efficiency_improvement.multiplier}x
            </div>
            <div className="text-sm text-purple-600 mt-1">
              {metrics.efficiency_improvement.description}
            </div>
          </div>

          <div className="mt-4">
            <div className="font-semibold mb-2">Sentiment Analysis</div>
            <div className="flex gap-2">
              <div className="flex-1 bg-green-100 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-green-700">
                  {sentimentScores.positive}%
                </div>
                <div className="text-sm text-green-600">Positive</div>
              </div>
              <div className="flex-1 bg-gray-100 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-gray-700">
                  {sentimentScores.neutral}%
                </div>
                <div className="text-sm text-gray-600">Neutral</div>
              </div>
              <div className="flex-1 bg-red-100 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-red-700">
                  {sentimentScores.negative}%
                </div>
                <div className="text-sm text-red-600">Negative</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Right Column - Business Value */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-bold">Business Value</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Key Benefits</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                Improved user retention due to enhanced UI/UX and functionality.
              </li>
              <li>
                Potential increase in revenue through better financial
                management tools for businesses.
              </li>
              <li>
                Competitive advantage in the personal finance management space.
              </li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-600 font-semibold">Time Saved</div>
            <div className="text-xl text-green-700">
              Users save an average of {metrics.time_saved.hours_per_week} hour
              per week on financial management tasks.
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="text-amber-600 font-semibold">Revenue Impact</div>
            <div className="text-xl text-amber-700">
              Estimated {metrics.revenue_impact.percentage}% increase in revenue
              due to improved user engagement and retention.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
