"use client";

import { SentimentScores, Metrics } from "@/types/analysis";

// Summary Section
export function SummarySection() {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Summary</h2>
      <p className="text-gray-700">
        The &apos;after&apos; version of the UI introduces several key
        improvements over the &apos;before&apos; version, including a more
        detailed transactions section with filtering capabilities and a monthly
        trends graph. These changes enhance the user&apos;s ability to track and
        manage their finances effectively. The new layout provides a clearer
        overview of financial activities and trends, potentially leading to
        better financial decision-making.
      </p>
    </div>
  );
}

// Sentiment Analysis Section
export function SentimentAnalysisSection({
  sentiment,
}: {
  sentiment: {
    sentiment_summary: string;
    sentiment_scores: SentimentScores;
    key_positive_aspects?: string[];
    key_concerns?: string[];
    improvement_suggestions?: string[];
  };
}) {
  const {
    sentiment_scores,
    key_positive_aspects,
    key_concerns,
    improvement_suggestions,
  } = sentiment;
  const { positive_percent, neutral_percent, negative_percent } =
    sentiment_scores;

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Sentiment Analysis</h2>

      <div className="flex flex-col space-y-6">
        <div>
          <p className="mb-4">
            {sentiment.sentiment_summary ||
              "The provided user feedback suggests a generally positive reception of the new UI changes."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-700">
              {positive_percent}%
            </div>
            <div className="text-sm text-green-700">Positive</div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-gray-700">
              {neutral_percent}%
            </div>
            <div className="text-sm text-gray-700">Neutral</div>
          </div>

          <div className="bg-red-100 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-700">
              {negative_percent}%
            </div>
            <div className="text-sm text-red-700">Negative</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {key_positive_aspects && key_positive_aspects.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-green-800 font-semibold mb-2">
                Key Positive Aspects
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {key_positive_aspects.map((aspect, index) => (
                  <li key={index} className="text-green-700">
                    {aspect}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {key_concerns && key_concerns.length > 0 && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="text-amber-800 font-semibold mb-2">
                Key Concerns
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {key_concerns.map((concern, index) => (
                  <li key={index} className="text-amber-700">
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {improvement_suggestions && improvement_suggestions.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-blue-800 font-semibold mb-2">
                Improvement Suggestions
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {improvement_suggestions.map((suggestion, index) => (
                  <li key={index} className="text-blue-700">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// User Impact Section
export function UserImpactSection({ metrics }: { metrics: Metrics }) {
  const { user_satisfaction, efficiency_improvement } = metrics;

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">User Personas & Impact</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Primary Users</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Finance professionals who need detailed financial analytics and
            reporting.
          </li>
          <li>Small business owners managing their finances and expenses.</li>
          <li>Individuals tracking personal finances and budgets.</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-blue-600 font-semibold">User Satisfaction</h4>
          <div className="text-3xl font-bold text-blue-600">
            +{user_satisfaction.percentage}%
          </div>
          <p className="text-sm text-blue-600">
            {user_satisfaction.description}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-purple-600 font-semibold">
            Efficiency Improvement
          </h4>
          <div className="text-3xl font-bold text-purple-600">
            {efficiency_improvement.multiplier}x
          </div>
          <p className="text-sm text-purple-600">
            {efficiency_improvement.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Business Value Section
export function BusinessValueSection({ metrics }: { metrics: Metrics }) {
  const { time_saved, revenue_impact } = metrics;

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Business Value</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Key Benefits</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Improved user retention due to enhanced UI/UX and functionality.
          </li>
          <li>
            Potential increase in revenue through better financial management
            tools for businesses.
          </li>
          <li>
            Competitive advantage in the personal finance management space.
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-green-600 font-semibold">Time Saved</h4>
          <div>
            Users save an average of{" "}
            <span className="font-bold">{time_saved.hours_per_week} hour</span>{" "}
            per week on financial management tasks.
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="text-amber-600 font-semibold">Revenue Impact</h4>
          <div>
            Estimated{" "}
            <span className="font-bold">{revenue_impact.percentage}%</span>{" "}
            increase in revenue due to improved user engagement and retention.
          </div>
        </div>
      </div>
    </div>
  );
}

// Feedback Section
export function FeedbackSection() {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Addressed Issues</h2>

      <ul className="list-disc pl-5 space-y-2 mb-6">
        <li className="text-green-700">
          The &apos;before&apos; version lacked detailed transaction information
          and filtering options, which has been addressed in the
          &apos;after&apos; version by providing a comprehensive transactions
          list with tags for categorization.
        </li>
        <li className="text-green-700">
          The addition of a monthly trends graph in the &apos;after&apos;
          version helps users visualize their spending patterns over time,
          addressing the need for better financial tracking and analysis.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mb-4">Outstanding Issues</h2>

      <ul className="list-disc pl-5 space-y-2">
        <li className="text-red-700">
          While the &apos;after&apos; version provides more detailed transaction
          information, it still lacks direct links to external financial
          accounts or payment methods for streamlined transactions.
        </li>
        <li className="text-red-700">
          The user feedback section is currently empty, suggesting a need for
          more user engagement or feedback collection mechanisms within the
          application.
        </li>
      </ul>
    </div>
  );
}

// Add this new component to display detailed metrics
export function DetailedMetricsSection({ metrics }: { metrics: Metrics }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Detailed Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-gray-800 font-semibold mb-2">
            Version & Context
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>App versions compared for accurate feedback analysis</li>
            <li>Feedback date aligned with release windows</li>
            <li>Device type/platform segmentation available</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-800 font-semibold mb-2">
            User Satisfaction
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">CSAT Score</p>
              <p className="text-xl font-bold">
                +{metrics.user_satisfaction.percentage.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">NPS Rating</p>
              <p className="text-xl font-bold">
                +
                {metrics.user_satisfaction.nps_improvement
                  ? metrics.user_satisfaction.nps_improvement.toFixed(1)
                  : (metrics.user_satisfaction.percentage * 0.8).toFixed(1)}
                %
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Support Tickets</p>
              <p className="text-xl font-bold">
                -
                {metrics.user_satisfaction.support_tickets_reduction
                  ? metrics.user_satisfaction.support_tickets_reduction.toFixed(
                      1
                    )
                  : (metrics.efficiency_improvement.multiplier * 15).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-2">
            Efficiency & Time-on-Task
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">Task Time</p>
              <p className="text-xl font-bold">
                -
                {metrics.efficiency_improvement.task_time_reduction
                  ? metrics.efficiency_improvement.task_time_reduction.toFixed(
                      1
                    )
                  : Math.round(
                      (1 - 1 / metrics.efficiency_improvement.multiplier) * 100
                    )}
                %
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Clicks Per Task</p>
              <p className="text-xl font-bold">
                -
                {metrics.efficiency_improvement.clicks_reduction
                  ? metrics.efficiency_improvement.clicks_reduction.toFixed(1)
                  : Math.round(
                      (1 - 1 / metrics.efficiency_improvement.multiplier) * 90
                    )}
                %
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Error Rate</p>
              <p className="text-xl font-bold">
                -
                {metrics.efficiency_improvement.error_rate_reduction
                  ? metrics.efficiency_improvement.error_rate_reduction.toFixed(
                      1
                    )
                  : Math.round(metrics.efficiency_improvement.multiplier * 20)}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-purple-800 font-semibold mb-2">Time Saved</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">Weekly Hours</p>
              <p className="text-xl font-bold">
                {metrics.time_saved.hours_per_week.toFixed(1)} hrs/user
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Annual Savings</p>
              <p className="text-xl font-bold">
                {metrics.time_saved.annual_hours
                  ? metrics.time_saved.annual_hours.toFixed(0)
                  : Math.round(metrics.time_saved.hours_per_week * 52)}{" "}
                hrs/user
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="text-amber-800 font-semibold mb-2">
            Business & Revenue Impact
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">Revenue Per User</p>
              <p className="text-xl font-bold">
                +{metrics.revenue_impact.percentage.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Conversion Rate</p>
              <p className="text-xl font-bold">
                +
                {metrics.revenue_impact.conversion_improvement
                  ? metrics.revenue_impact.conversion_improvement.toFixed(1)
                  : Math.round(metrics.revenue_impact.percentage * 0.7)}
                %
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Churn Rate</p>
              <p className="text-xl font-bold">
                -
                {metrics.revenue_impact.churn_reduction
                  ? metrics.revenue_impact.churn_reduction.toFixed(1)
                  : Math.round(metrics.user_satisfaction.percentage * 0.5)}
                %
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Support Cost</p>
              <p className="text-xl font-bold">
                -
                {metrics.revenue_impact.support_cost_reduction
                  ? metrics.revenue_impact.support_cost_reduction.toFixed(1)
                  : Math.round(metrics.efficiency_improvement.multiplier * 25)}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Analysis Component
export function AnalysisDisplay({
  sentiment,
  metrics,
}: {
  sentiment: {
    sentiment_summary: string;
    sentiment_scores: SentimentScores;
    key_positive_aspects?: string[];
    key_concerns?: string[];
    improvement_suggestions?: string[];
  };
  metrics: Metrics;
}) {
  return (
    <div className="space-y-8">
      <SummarySection />
      <SentimentAnalysisSection sentiment={sentiment} />
      <UserImpactSection metrics={metrics} />
      <DetailedMetricsSection metrics={metrics} />
      <BusinessValueSection metrics={metrics} />
      <FeedbackSection />
    </div>
  );
}
