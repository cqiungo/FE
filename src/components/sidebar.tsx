import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, CheckSquare, Flag, Star, Settings, BarChart3, Menu, X, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  stats: {
    total: number
    completed: number
    pending: number
    overdue: number
    highPriority: number
  }
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ stats, activeView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dash Board", icon: ClipboardList, count: 0},
    { id: "all", label: "All Tasks", icon: Home, count: stats.total },
    { id: "pending", label: "Pending", icon: CheckSquare, count: stats.pending },
    { id: "completed", label: "Completed", icon: CheckSquare, count: stats.completed },
    { id: "overdue", label: "Overdue", icon: Flag, count: stats.overdue },
    { id: "high-priority", label: "High Priority", icon: Star, count: stats.highPriority },
  ]

  return (
    <div
      className={cn(
        "bg-white/95 backdrop-blur border-r border-slate-200 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-slate-900">TaskMaster</h2>
              <p className="text-xs text-slate-500">Pro Dashboard</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-500 hover:text-slate-700"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
      <Button
        key={item.id}
        variant={activeView === item.id ? "default" : "ghost"}
        className={cn(
          "w-full",
          isCollapsed ? "justify-center" : "justify-start text-left",
          activeView === item.id
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
        )}
        onClick={() => onViewChange(item.id)}
      >
        <item.icon className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.count > 0 && (
              <Badge variant={activeView === item.id ? "secondary" : "outline"} className="mx-auto text-xs">
                {item.count}
              </Badge>
            )}
          </>
        )}
      </Button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
          <BarChart3 className={cn("w-4 h-4", isCollapsed ? "" : "mr-3")} />
          {!isCollapsed && "Analytics"}
        </Button>
        <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
          <Settings className={cn("w-4 h-4", isCollapsed ? "" : "mr-3")} />
          {!isCollapsed && "Settings"}
        </Button>
      </div>
    </div>
  )
}
