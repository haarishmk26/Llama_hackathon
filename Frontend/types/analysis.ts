export interface SentimentScores {
  positive_percent: number;
  neutral_percent: number;
  negative_percent: number;
}

export interface Metrics {
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

export interface AnalysisResponse {
  summary_section: {
    key_changes_narrative: string;
    addressed_issues: string[];
    outstanding_issues: string[];
  };
  feedback_analysis_section: {
    sentiment_summary: string;
    sentiment_scores: SentimentScores;
  };
  metrics_section: Metrics;
} 