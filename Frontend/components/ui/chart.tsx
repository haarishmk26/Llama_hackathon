import type React from "react"
export const Chart = ({ children }: { children: React.ReactNode }) => {
  return <div className="chart">{children}</div>
}

export const ChartArea = () => {
  return <div className="chart-area"></div>
}

export const ChartAxisLabel = ({
  axisName,
  className,
  formatter,
}: { axisName: string; className?: string; formatter?: (value: number) => string }) => {
  return <div className={className}>{axisName}</div>
}

export const ChartGrid = ({ horizontal, vertical }: { horizontal?: boolean; vertical?: boolean }) => {
  return <div className="chart-grid"></div>
}

export const ChartLineSeries = ({
  children,
  data,
  xField,
  yField,
  name,
}: { children: React.ReactNode; data: any[]; xField: string; yField: string; name: string }) => {
  return <div className="chart-line-series">{children}</div>
}

export const ChartLine = ({ className }: { className?: string }) => {
  return <div className={className}></div>
}

export const ChartContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>
}

export const ChartLegend = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>
}

export const ChartTooltip = () => {
  return <div className="chart-tooltip"></div>
}
