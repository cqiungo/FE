import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import MyCalendar from "@/components/calendar-view"
import { Outlet } from "react-router-dom";
import type { Todo } from "@/types/todo.type";

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
}

export default function CalendarPage() {
  const [todos, setTodos] = useState<Todo[]>([
    
  ])
  const [searchQuery, setSearchQuery] = useState("")

  // Get recent tasks (last 7 days, not completed)



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar activeView="dashboard" onViewChange={(e) => {console.log(e)}} />

      <div className="flex-1 flex flex-col">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onAddTask={() => {}} />

        <main className="flex-1 pt-6 pb-8 pl-14 pr-6 lg:pl-20 lg:pr-16 overflow-y-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Overview of your recent and completed tasks</p>
          </div>
          <MyCalendar></MyCalendar>

        </main>
      </div>
      <Outlet />
    </div>
  )
}
