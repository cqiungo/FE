import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import MyCalendar from "@/components/calendar-view"

interface Todo {
  id: number
  text: string
  completed: boolean
  start: Date
  end?: Date
  description?: string
  priority: "low" | "medium" | "high"
  category: string
  imgUrl?: string
}

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
}

export default function CalendarPage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Finish project report" ,completed: false,imgUrl:"https://res.cloudinary.com/dbjroxnkb/image/upload/v1751217677/samples/coffee.jpg", description:"", start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),    end: new Date(new Date(new Date().setHours(10)).setMinutes(0)), priority: "high", category: "Work" },
    { id: 2, text: "Grocery shopping", completed: true,imgUrl:"https://res.cloudinary.com/dbjroxnkb/image/upload/v1751217677/samples/coffee.jpg",description:"sdhfkjshdkfjdhskdjfhkjsdf" ,start:new Date(2025, 8, 15, 14, 30, 45),end: new Date(2025,8,15,20,0,0), priority: "medium", category: "Personal",  },
    { id: 3, text: "Book flight tickets", completed: false,imgUrl:"https://res.cloudinary.com/dbjroxnkb/image/upload/v1751217677/samples/coffee.jpg",description:"sdhfkjshdkfjdhskdjfhkjsdf" , start: new Date(2025,9,11,1,0,0), end: new Date(2025,9,11,5,0,0), priority: "low", category: "Travel"},
    { id: 4, text: "Call the bank", completed: false,imgUrl:"https://res.cloudinary.com/dbjroxnkb/image/upload/v1751217677/samples/coffee.jpg",description:"sdhfkjshdkfjdhskdjfhkjsdf" , start: new Date(2025,9,11,1,0,0), end: new Date(2025,9,11,5,0,0), priority: "high", category: "Finance"},
    { id: 5, text: "Schedule dentist appointment", completed: true,imgUrl:"https://res.cloudinary.com/dbjroxnkb/image/upload/v1751217677/samples/coffee.jpg",description:"sdhfkjshdkfjdhskdjfhkjsdf" , start: new Date(2025,9,12,1,0,0), end: new Date(2025,9,12,5,0,0), priority: "medium", category: "Health"},
    { id: 6, text: "Prepare presentation slides", completed: false,imgUrl:"https://res.cloudinary.com/dbjroxnkb/image/upload/v1751217677/samples/coffee.jpg",description:"sdhfkjshdkfjdhskdjfhkjsdf" , start: new Date(2025,9,13,1,0,0), end: new Date(2025,9,14,5,0,0), priority: "high", category: "Work"},
    { id: 7, text: "Renew car insurance", completed: false,imgUrl:"https://res.cloudinary.com/dbjroxnkb/image/upload/v1751217677/samples/coffee.jpg",description:"sdhfkjshdkfjdhskdjfhkjsdf" , start: new Date(2025,9,16,1,0,0), end: new Date(2025,9,16,5,0,0), priority: "medium", category: "Finance"},
    { id: 8, text: "Plan weekend getaway", completed: false,imgUrl:"https://res.cloudinary.com/dbjroxnkb/image/upload/v1751217677/samples/coffee.jpg",description:"sdhfkjshdkfjdhskdjfhkjsdf" , start: new Date(2025,9,17,1,0,0), end: new Date(2025,9,17,5,0,0), priority: "low", category: "Personal" },
  ])
  const [searchQuery, setSearchQuery] = useState("")

  // Get recent tasks (last 7 days, not completed)
  const recentTasks = todos
    .filter((todo) => {
      const daysDiff = Math.floor((new Date().getTime() - todo.start.getTime()) / (1000 * 60 * 60 * 24))
      return !todo.completed && daysDiff <= 7
    })
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .slice(0, 8)

  // Get completed tasks (most recently completed)
  const completedTasks = todos
    .filter((todo) => todo.completed)
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .slice(0, 8)
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, [date]);
  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
    overdue: todos.filter((t) => t.end && t.end < new Date() && !t.completed).length,
    highPriority: todos.filter((t) => t.priority === "high" && !t.completed).length,
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar stats={stats} activeView="dashboard" onViewChange={(e) => {console.log(e)}} />

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
    </div>
  )
}
