export interface SentimentScores {
  positive_percent: number;
  neutral_percent: number;
  negative_percent: number;
}

export interface Metrics {
  user_satisfaction: {
    percentage: number;
    nps_improvement?: number;
    support_tickets_reduction?: number;
    description: string;
  };
  efficiency_improvement: {
    multiplier: number;
    task_time_reduction?: number;
    clicks_reduction?: number;
    error_rate_reduction?: number;
    description: string;
  };
  time_saved: {
    hours_per_week: number;
    annual_hours?: number;
    description: string;
  };
  revenue_impact: {
    percentage: number;
    conversion_improvement?: number;
    churn_reduction?: number;
    support_cost_reduction?: number;
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
    key_positive_aspects?: string[];
    key_concerns?: string[];
    improvement_suggestions?: string[];
  };
  metrics_section: Metrics;
} 