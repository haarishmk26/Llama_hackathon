interface FeedbackData {
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
  weekly_hours_spent_pre: number;
  weekly_hours_spent_post: number;
  avg_revenue_per_user_pre: number;
  avg_revenue_per_user_post: number;
}

export function calculateMetrics(feedbackData: FeedbackData[]) {
  if (!feedbackData || feedbackData.length === 0) {
    return null;
  }

  // Calculate averages for each metric
  const metrics = feedbackData.reduce(
    (acc, curr) => {
      // User Satisfaction
      acc.csatScorePre += curr.csat_score_pre;
      acc.csatScorePost += curr.csat_score_post;
      acc.npsRatingPre += curr.nps_rating_pre;
      acc.npsRatingPost += curr.nps_rating_post;
      acc.supportTicketsPre += curr.support_tickets_opened_pre;
      acc.supportTicketsPost += curr.support_tickets_opened_post;

      // Efficiency
      acc.taskTimePre += curr.avg_task_time_pre;
      acc.taskTimePost += curr.avg_task_time_post;
      acc.clicksPre += curr.clicks_per_task_pre;
      acc.clicksPost += curr.clicks_per_task_post;
      acc.errorRatePre += curr.error_rate_pre;
      acc.errorRatePost += curr.error_rate_post;

      // Time Saved
      acc.hoursSpentPre += curr.weekly_hours_spent_pre;
      acc.hoursSpentPost += curr.weekly_hours_spent_post;

      // Revenue
      acc.revenuePre += curr.avg_revenue_per_user_pre;
      acc.revenuePost += curr.avg_revenue_per_user_post;

      return acc;
    },
    {
      csatScorePre: 0,
      csatScorePost: 0,
      npsRatingPre: 0,
      npsRatingPost: 0,
      supportTicketsPre: 0,
      supportTicketsPost: 0,
      taskTimePre: 0,
      taskTimePost: 0,
      clicksPre: 0,
      clicksPost: 0,
      errorRatePre: 0,
      errorRatePost: 0,
      hoursSpentPre: 0,
      hoursSpentPost: 0,
      revenuePre: 0,
      revenuePost: 0,
    }
  );

  const count = feedbackData.length;

  // Calculate final metrics
  const userSatisfactionImprovement = 
    ((metrics.csatScorePost / count - metrics.csatScorePre / count) / 
    (metrics.csatScorePre / count)) * 100;

  const efficiencyImprovement = 
    metrics.taskTimePre / count / (metrics.taskTimePost / count);

  const timeSavedPerWeek = 
    (metrics.hoursSpentPre - metrics.hoursSpentPost) / count;

  const revenueImprovement = 
    ((metrics.revenuePost / count - metrics.revenuePre / count) / 
    (metrics.revenuePre / count)) * 100;

  // Calculate sentiment scores based on CSAT improvement
  const sentimentScores = {
    positive: 60, // These could be calculated based on actual feedback sentiment analysis
    neutral: 20,  // For now using placeholder values as sentiment analysis
    negative: 20  // would require natural language processing
  };

  return {
    metrics_section: {
      user_satisfaction: {
        percentage: Math.round(userSatisfactionImprovement),
        description: "Increase in user satisfaction based on CSAT scores"
      },
      efficiency_improvement: {
        multiplier: Number(efficiencyImprovement.toFixed(1)),
        description: "Improvement in task completion efficiency"
      },
      time_saved: {
        hours_per_week: Math.round(timeSavedPerWeek),
        description: "Average time saved per user per week"
      },
      revenue_impact: {
        percentage: Math.round(revenueImprovement),
        description: "Increase in revenue per user"
      }
    },
    sentiment_scores: sentimentScores
  };
} 