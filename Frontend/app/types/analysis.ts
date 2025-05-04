export interface MetricsData {
  app_version: string;
  feedback_date: string;
  device_type: string;
  csat_score_pre: number;
  csat_score_post: number;
  nps_rating_pre: number;
  nps_rating_post: number;
  support_tickets_opened_pre: number;
  support_tickets_opened_post: number;
  avg_task_time_pre: number;
  avg_task_time_post: number;
  clicks_per_task_pre: number;
  clicks_per_task_post: number;
  error_rate_pre: number;
  error_rate_post: number;
  sessions_per_task: number;
  weekly_hours_spent_pre: number;
  weekly_hours_spent_post: number;
  tasks_completed_per_week_pre: number;
  tasks_completed_per_week_post: number;
  avg_revenue_per_user_pre: number;
  avg_revenue_per_user_post: number;
  conversion_rate_pre: number;
  conversion_rate_post: number;
  churn_rate_pre: number;
  churn_rate_post: number;
  upsell_count_pre: number;
  upsell_count_post: number;
  support_cost_per_user_pre: number;
  support_cost_per_user_post: number;
}

export interface AnalysisResult {
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
  metrics_data: MetricsData[];
  original_feedback: any[];
} 