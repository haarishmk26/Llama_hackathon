"use client"

import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

// Dummy data for the last 6 months
const monthlyData = [
  { month: "Jan", spent: 2450, earned: 3200 },
  { month: "Feb", spent: 2100, earned: 3200 },
  { month: "Mar", spent: 2800, earned: 3400 },
  { month: "Apr", spent: 2300, earned: 3200 },
  { month: "May", spent: 2600, earned: 3300 },
  { month: "Jun", spent: 2900, earned: 3200 },
]

// Calculate percentage change from last month
const calculateChange = () => {
  const currentMonth = monthlyData[monthlyData.length - 1].spent
  const lastMonth = monthlyData[monthlyData.length - 2].spent
  const percentageChange = ((currentMonth - lastMonth) / lastMonth) * 100
  return {
    value: Math.abs(percentageChange).toFixed(1),
    isIncrease: percentageChange > 0,
  }
}

export default function TrendVisualization() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const change = calculateChange()

  return (
    <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23] rounded-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-zinc-900 dark:text-zinc-50" />
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Monthly Trends</CardTitle>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand chart" : "Collapse chart"}
          >
            {isCollapsed ? (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>
        <CardDescription className="flex items-center mt-1">
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              change.isIncrease ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400",
            )}
          >
            <span className="text-base">
              {change.isIncrease ? "📈" : "📉"} You spent {change.value}% {change.isIncrease ? "more" : "less"} this
              month than last month
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="pt-0">
          <div className="h-[250px] w-full mt-2">
            <ChartContainer
              config={{
                spent: {
                  label: "Total Spent",
                  color: "hsl(var(--chart-1))",
                },
                earned: {
                  label: "Total Earned",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} width={60} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    stroke="var(--color-spent)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earned"
                    stroke="var(--color-earned)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
