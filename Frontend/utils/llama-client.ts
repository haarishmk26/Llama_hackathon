import OpenAI from 'openai';

// Use environment variables if available, otherwise fall back to hardcoded values
// You can create a .env.local file with these variables for better security
const LLAMA_API_KEY = process.env.NEXT_PUBLIC_LLAMA_API_KEY || "LLM|1671322013583157|rLNuBsns7aO149BRL62uO5OLcIk";
const LLAMA_API_ENDPOINT = process.env.NEXT_PUBLIC_LLAMA_API_BASE_URL || "https://api.llama.com/compat/v1/";

export const llamaClient = new OpenAI({
  apiKey: LLAMA_API_KEY,
  baseURL: LLAMA_API_ENDPOINT,
  dangerouslyAllowBrowser: true,
});

// Utility function to safely parse CSV data to JSON
export const safeParseCSV = (csvText: string): Record<string, string>[] => {
  try {
    // Remove any BOM and trim whitespace
    const cleanCsvText = csvText
      .replace(/^\uFEFF/, "")
      .replace(/<[^>]*>/g, "")
      .trim();

    // Split into lines and filter out empty ones
    const lines = cleanCsvText
      .split(/[\r\n]+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      throw new Error("CSV file must contain headers and at least one data row");
    }

    // Parse headers and clean them
    const headers = lines[0]
      .split(",")
      .map((header) => header.trim())
      .filter((header) => header.length > 0);

    // Parse data rows (limit to 1000 rows to prevent payload size issues)
    const jsonData = lines.slice(1, 1001).map((line) => {
      // Handle quotes and commas within quoted fields
      let values: string[] = [];
      let currentValue = "";
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = "";
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue.trim());
      
      // Remove surrounding quotes from values
      values = values.map(v => {
        if (v.startsWith('"') && v.endsWith('"')) {
          return v.slice(1, -1);
        }
        return v;
      });
      
      // Create object with header keys
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || "";
        return obj;
      }, {} as Record<string, string>);
    });

    return jsonData;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    return [];
  }
};

export const analyzeSentiment = async (feedbackData: any[]) => {
  if (!feedbackData || feedbackData.length === 0) {
    console.error('No feedback data provided for sentiment analysis');
    throw new Error('No feedback data provided for sentiment analysis');
  }

  try {
    console.log('Calling Llama API for sentiment analysis...');
    const response = await fetch('/api/llama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analysisType: 'sentiment',
        messages: [
          {
            role: "system",
            content: `You are a sentiment analysis expert specializing in user feedback analysis. Analyze the provided feedback data to extract sentiment trends, common themes, and user satisfaction patterns.

Focus on:
1. Overall sentiment distribution (positive, neutral, negative) as percentages
2. Key positive aspects users mention about the new UI/features
3. Key pain points or concerns that appear in feedback
4. Trends in sentiment based on user type, platform, or other segmentation
5. Suggestions for improvements based on the sentiment analysis

Return your analysis in the following JSON format:
{
  "summary": "A concise 2-3 sentence summary of the overall sentiment and key findings",
  "scores": {
    "positive_percent": number,
    "neutral_percent": number,
    "negative_percent": number
  },
  "key_positive_aspects": [
    "Positive aspect 1",
    "Positive aspect 2",
    "Positive aspect 3"
  ],
  "key_concerns": [
    "Concern 1",
    "Concern 2",
    "Concern 3"
  ],
  "improvement_suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}`
          },
          {
            role: "user",
            content: JSON.stringify(feedbackData)
          }
        ]
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse API response:', jsonError);
      // Let the calling function handle this case with its own direct calculation
      throw new Error('Failed to parse sentiment analysis API response');
    }

    if (!response.ok) {
      console.error('API error:', data.error || 'Unknown error');
      throw new Error(data.error || 'API request failed');
    }
    
    // Validate that the content is valid JSON
    try {
      const parsedContent = JSON.parse(data.content);
      
      // Check that the structure is valid (has required fields)
      if (!parsedContent.scores || 
          typeof parsedContent.scores.positive_percent !== 'number' ||
          typeof parsedContent.scores.neutral_percent !== 'number' ||
          typeof parsedContent.scores.negative_percent !== 'number') {
        console.error('API returned invalid sentiment data structure:', parsedContent);
        throw new Error('Invalid sentiment data structure');
      }
      
      return data.content;
    } catch (parseError) {
      console.error('API returned invalid JSON for sentiment analysis:', parseError);
      // Let the calling function handle this with its own direct calculation
      throw new Error('Invalid sentiment analysis JSON from API');
    }
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    // Let the main component's error handling take care of the fallback
    throw error;
  }
};

export const calculateMetrics = async (feedbackData: any[]) => {
  if (!feedbackData || feedbackData.length === 0) {
    console.error('No feedback data provided for metrics calculation');
    throw new Error('No feedback data provided for metrics calculation');
  }

  try {
    console.log('Calling Llama API for metrics calculation...');
    const response = await fetch('/api/llama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analysisType: 'metrics',
        messages: [
          {
            role: "system",
            content: `You are a data analysis expert. Calculate key metrics from the provided feedback data using these specific formulas:

1. User Satisfaction:
- User Satisfaction Percentage = (mean(csat_score_post) - mean(csat_score_pre)) / mean(csat_score_pre) * 100
- NPS Rating Improvement = (mean(nps_rating_post) - mean(nps_rating_pre)) / mean(nps_rating_pre) * 100
- Support Tickets Reduction = (sum(support_tickets_opened_pre) - sum(support_tickets_opened_post)) / sum(support_tickets_opened_pre) * 100

2. Efficiency & Time-on-Task:
- Efficiency Multiplier = mean(avg_task_time_pre) / mean(avg_task_time_post)
- Task Time Reduction = (1 - 1/efficiency_multiplier) * 100
- Clicks Reduction = (mean(clicks_per_task_pre) - mean(clicks_per_task_post)) / mean(clicks_per_task_pre) * 100
- Error Rate Reduction = (mean(error_rate_pre) - mean(error_rate_post)) / mean(error_rate_pre) * 100

3. Time Saved:
- Hours Per Week = mean(weekly_hours_spent_pre - weekly_hours_spent_post)
- Annual Hours Saved = Hours Per Week * 52

4. Business & Revenue Impact:
- Revenue Impact = (mean(avg_revenue_per_user_post) - mean(avg_revenue_per_user_pre)) / mean(avg_revenue_per_user_pre) * 100
- Conversion Rate Improvement = (mean(conversion_rate_post) - mean(conversion_rate_pre)) / mean(conversion_rate_pre) * 100
- Churn Rate Reduction = (mean(churn_rate_pre) - mean(churn_rate_post)) / mean(churn_rate_pre) * 100
- Support Cost Reduction = (mean(support_cost_per_user_pre) - mean(support_cost_per_user_post)) / mean(support_cost_per_user_pre) * 100

Analyze the data and return metrics in the following JSON format:
{
  "user_satisfaction": {
    "percentage": number,
    "nps_improvement": number,
    "support_tickets_reduction": number,
    "description": "Improvement in user satisfaction based on CSAT scores"
  },
  "efficiency_improvement": {
    "multiplier": number,
    "task_time_reduction": number,
    "clicks_reduction": number,
    "error_rate_reduction": number,
    "description": "Improvement in task completion efficiency"
  },
  "time_saved": {
    "hours_per_week": number,
    "annual_hours": number,
    "description": "Average time saved per user per week"
  },
  "revenue_impact": {
    "percentage": number,
    "conversion_improvement": number,
    "churn_reduction": number,
    "support_cost_reduction": number,
    "description": "Estimated increase in revenue due to improved engagement"
  }
}`
          },
          {
            role: "user",
            content: JSON.stringify(feedbackData)
          }
        ]
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse API response:', jsonError);
      // Let the calling function handle this with its own direct calculation
      throw new Error('Failed to parse metrics calculation API response');
    }

    if (!response.ok) {
      console.error('API error:', data.error || 'Unknown error');
      throw new Error(data.error || 'API request failed');
    }
    
    // Validate that the content is valid JSON
    try {
      const parsedContent = JSON.parse(data.content);
      
      // Check that the structure is valid (has required fields)
      if (!parsedContent.user_satisfaction || 
          typeof parsedContent.user_satisfaction.percentage !== 'number' ||
          !parsedContent.efficiency_improvement ||
          typeof parsedContent.efficiency_improvement.multiplier !== 'number') {
        console.error('API returned invalid metrics data structure:', parsedContent);
        throw new Error('Invalid metrics data structure');
      }
      
      return data.content;
    } catch (parseError) {
      console.error('API returned invalid JSON for metrics:', parseError);
      // Let the calling function handle this with its own direct calculation
      throw new Error('Invalid metrics JSON from API');
    }
  } catch (error) {
    console.error('Error in metrics calculation:', error);
    // Let the main component's error handling take care of the fallback
    throw error;
  }
}; 