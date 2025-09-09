import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useState } from "react"

interface PercentageChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
  title?: string
  icon?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "donut" | "pie" | "progress"
  layout?: "grid" | "horizontal" | "vertical"
  showTooltip?: boolean
  showLegend?: boolean
  showPercentage?: boolean
  showValues?: boolean
  animated?: boolean
  interactive?: boolean
  theme?: "light" | "dark" | "gradient"
  className?: string
  onItemClick?: (item: any, index: number) => void
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white/95 backdrop-blur border rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-medium">{data.name}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Value: {data.value} ({((data.value / data.total) * 100).toFixed(1)}%)
        </p>
      </div>
    )
  }
  return null
}

export default function PercentageChart({
  data,
  title = "Task Status",
  icon = <CheckCircle2 className="w-5 h-5" />,
  size = "md",
  variant = "donut",
  layout = "grid",
  showTooltip = true,
  showLegend = false,
  showPercentage = true,
  showValues = false,
  animated = true,
  interactive = true,
  theme = "light",
  className = "",
  onItemClick,
}: PercentageChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const total = data.reduce((sum, item) => sum + item.value, 0)

  const sizeConfig = {
    sm: { chart: 60, inner: 20, outer: 25, container: 70 },
    md: { chart: 90, inner: 30, outer: 40, container: 100 },
    lg: { chart: 120, inner: 40, outer: 55, container: 140 },
    xl: { chart: 150, inner: 50, outer: 70, container: 170 },
  }

  const config = sizeConfig[size]

  const themeConfig = {
    light: {
      card: "bg-white/90 backdrop-blur border-0 shadow-lg",
      title: "text-gray-800",
      text: "text-gray-600",
    },
    dark: {
      card: "bg-gray-900/90 backdrop-blur border border-gray-700 shadow-lg",
      title: "text-white",
      text: "text-gray-300",
    },
    gradient: {
      card: "bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur border-0 shadow-xl",
      title: "text-gray-800",
      text: "text-gray-600",
    },
  }

  const currentTheme = themeConfig[theme]

  const enhancedData = data.map((item, index) => ({
    ...item,
    total,
    isHovered: hoveredIndex === index,
    isSelected: selectedIndex === index,
  }))

  const renderChart = (item: any, index: number) => {
    const percentage = ((item.value / total) * 100).toFixed(0)

    if (variant === "progress") {
      return (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <span className="text-sm font-semibold">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                backgroundColor: item.color,
                width: animated ? `${percentage}%` : "0%",
              }}
            />
          </div>
          {showValues && <p className="text-xs text-gray-500">{item.value} tasks</p>}
        </div>
      )
    }

    const pieData = [
      { value: item.value, color: item.color, ...item },
      { value: total - item.value, color: "#e5e7eb" },
    ]

    return (
      <div
        key={index}
        className={`flex flex-col items-center ${interactive ? "cursor-pointer hover:scale-105 transition-transform" : ""}`}
        onMouseEnter={() => interactive && setHoveredIndex(index)}
        onMouseLeave={() => interactive && setHoveredIndex(null)}
        onClick={() => {
          if (interactive && onItemClick) {
            onItemClick(item, index)
          }
          setSelectedIndex(selectedIndex === index ? null : index)
        }}
      >
        <ResponsiveContainer width={config.container} height={config.container}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={variant === "donut" ? config.inner : 0}
              outerRadius={config.outer}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              animationBegin={0}
              animationDuration={animated ? 800 : 0}
            >
              {pieData.map((d, idx) => (
                <Cell key={idx} fill={d.color} />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
          </PieChart>
        </ResponsiveContainer>

        {showPercentage && <p className={`text-sm font-semibold ${currentTheme.title}`}>{percentage}%</p>}

        <div className={`flex items-center gap-1 text-xs mt-1 ${currentTheme.text}`}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
          {item.name}
        </div>

        {showValues && <p className={`text-xs ${currentTheme.text} mt-1`}>{item.value} tasks</p>}
      </div>
    )
  }

  const getLayoutClass = () => {
    switch (layout) {
      case "horizontal":
        return "flex flex-row gap-6 justify-center items-center"
      case "vertical":
        return "flex flex-col gap-4"
      case "grid":
      default:
        return "grid grid-cols-2 gap-4 place-items-center"
    }
  }

  if (variant === "progress") {
    return (
      <Card className={`${currentTheme.card} ${className}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${currentTheme.title}`}>
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">{enhancedData.map((item, index) => renderChart(item, index))}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${currentTheme.card} ${className}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${currentTheme.title}`}>
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={getLayoutClass()}>{enhancedData.map((item, index) => renderChart(item, index))}</div>

        {showLegend && (
          <div className="flex flex-wrap gap-4 justify-center mt-4 pt-4 border-t">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`text-sm ${currentTheme.text}`}>
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
