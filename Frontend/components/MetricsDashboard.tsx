"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MetricsData {
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

interface MetricsDashboardProps {
  data: MetricsData[];
}

const calculateMetrics = (data: MetricsData[] | undefined) => {
  if (!data || data.length === 0) {
    return {
      userSatisfactionIncrease: "0.0",
      efficiencyMultiplier: "1.0",
      timeSavedPerWeek: "0.0",
      revenueImpact: "0.0",
    };
  }

  const latest = data[data.length - 1];

  const userSatisfactionIncrease =
    ((latest.csat_score_post - latest.csat_score_pre) / latest.csat_score_pre) *
    100;

  const efficiencyMultiplier =
    latest.avg_task_time_pre / latest.avg_task_time_post;

  const timeSavedPerWeek =
    latest.weekly_hours_spent_pre - latest.weekly_hours_spent_post;

  const revenueImpact =
    ((latest.avg_revenue_per_user_post - latest.avg_revenue_per_user_pre) /
      latest.avg_revenue_per_user_pre) *
    100;

  return {
    userSatisfactionIncrease: userSatisfactionIncrease.toFixed(1),
    efficiencyMultiplier: efficiencyMultiplier.toFixed(1),
    timeSavedPerWeek: timeSavedPerWeek.toFixed(1),
    revenueImpact: revenueImpact.toFixed(1),
  };
};

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const metrics = calculateMetrics(data);

  // Add data validation
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No metrics data available</p>
      </div>
    );
  }

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatTime = (value: number) => `${value.toFixed(1)}s`;
  const formatClicks = (value: number) => `${value.toFixed(1)}`;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              User Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{metrics.userSatisfactionIncrease}%
            </div>
            <p className="text-xs text-muted-foreground">
              From previous version
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.efficiencyMultiplier}x
            </div>
            <p className="text-xs text-muted-foreground">
              Faster task completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.timeSavedPerWeek}h
            </div>
            <p className="text-xs text-muted-foreground">Per user per week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics.revenueImpact}%</div>
            <p className="text-xs text-muted-foreground">Revenue per user</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="h-[400px]">
              <ChartContainer
                config={{
                  satisfaction: {
                    label: "User Satisfaction",
                    color: "#4ade80",
                  },
                  efficiency: {
                    label: "Task Efficiency",
                    color: "#60a5fa",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feedback_date" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="csat_score_post"
                      name="Satisfaction"
                      stroke="#4ade80"
                    />
                    <Line
                      type="monotone"
                      dataKey="avg_task_time_post"
                      name="Task Time"
                      stroke="#60a5fa"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="satisfaction" className="h-[400px]">
              <ChartContainer
                config={{
                  csat: {
                    label: "CSAT Score",
                    color: "#4ade80",
                  },
                  nps: {
                    label: "NPS Rating",
                    color: "#60a5fa",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feedback_date" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="csat_score_post" name="CSAT" fill="#4ade80" />
                    <Bar dataKey="nps_rating_post" name="NPS" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="efficiency" className="h-[400px]">
              <ChartContainer
                config={{
                  taskTime: {
                    label: "Task Time",
                    color: "#4ade80",
                  },
                  clicks: {
                    label: "Clicks per Task",
                    color: "#60a5fa",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feedback_date" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avg_task_time_post"
                      name="Task Time"
                      stroke="#4ade80"
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks_per_task_post"
                      name="Clicks"
                      stroke="#60a5fa"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="revenue" className="h-[400px]">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue per User",
                    color: "#4ade80",
                  },
                  conversion: {
                    label: "Conversion Rate",
                    color: "#60a5fa",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feedback_date" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avg_revenue_per_user_post"
                      name="Revenue"
                      stroke="#4ade80"
                    />
                    <Line
                      type="monotone"
                      dataKey="conversion_rate_post"
                      name="Conversion"
                      stroke="#60a5fa"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Platform Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["iOS", "Android", "Web"].map((platform) => {
              const platformData = data.filter(
                (d) => d.device_type === platform
              );
              const avgSatisfaction =
                platformData.length > 0
                  ? platformData.reduce(
                      (acc, curr) => acc + curr.csat_score_post,
                      0
                    ) / platformData.length
                  : 0;

              return (
                <div
                  key={platform}
                  className="flex flex-col space-y-2 p-4 border rounded-lg"
                >
                  <span className="text-sm font-medium">{platform}</span>
                  <span className="text-2xl font-bold">
                    {avgSatisfaction.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Avg. Satisfaction
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { MetricsDashboard };
