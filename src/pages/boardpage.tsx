import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CheckCircle2, Circle, CalendarIcon, Clock, ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Chart from "@/components/chart"
import type { Priority, Todo } from "@/types/todo.type"
import { useAuthContext } from "@/context/authContext"

const PRIORITY_COLORS: Record<Priority, string> = {
  high: "red",
  medium: "orange",
  low: "green",
};


export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`https://be-3-xja1.onrender.com/user/${user!.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json(); // data là object user
        const fetchedTodos = data.todos || [];

        // map và gán id tăng dần từ 0
        const mappedTodos: Todo[] = fetchedTodos.map((todo: any, index: number) => ({
          id: index,
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          priority: todo.priority as Priority,
          category: todo.category,
          image: todo.image,
          start: new Date(todo.start),
          end: new Date(todo.end),
          actualTime: new Date(todo.actual || todo.start),
        }));

        setTodos(mappedTodos);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchTodos();
  });
  
  const isOverdue = (todo: Todo) => {
    return todo.end && todo.end < new Date() && !todo.completed
  }

  // Get recent tasks (last 7 days, not completed)
  const recentTasks = todos
    .filter((todo) => {
      const daysDiff = Math.floor((new Date().getTime() - todo.start.getTime()) / (1000 * 60 * 60 * 24))
      return !todo.completed && daysDiff <= 7
    })
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .slice(0, 4)

  // Get completed tasks (most recently completed)
  const completedTasks = todos
    .filter((todo) => todo.completed)
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .slice(0, 2)
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, [date]);


  const completed = todos.filter((t) => t.completed).length
  const inProgress = todos.filter((t) => !t.completed && t.end).length

  const data = [
    { name: "Completed", value: completed, color: "#22c55e" }, // xanh lá
    { name: "In Progress", value: inProgress, color: "#3b82f6" }, // xanh dương
  ]
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

          {/* Stats Overview */}

          {/* Main Dashboard Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Tasks - Left Side */}
            <Card className="bg-white/90 backdrop-blur row-span-2 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="w-5 h-5 text-slate-600" />
                  Recent Tasks
                  <Badge variant="secondary" className="ml-auto h-full max-h-24">
                    <p className="text-xl">To do</p>
                    <ClipboardCheck className="h-full max-h-24" />
                  </Badge>
                </CardTitle>
                <p className="text-sm text-slate-500">
                  {date.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 max-h overflow-y-auto pr-1">
                  {recentTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-500">No recent tasks</p>
                    </div>
                  ) : (
                    recentTasks.map((todo) => (
                      <div
                        key={todo.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 hover:bg-slate-50 hover:shadow-sm cursor-pointer",
                          todo.priority === "high" && "border-l-4 border-l-red-500",
                          todo.priority === "medium" && "border-l-4 border-l-yellow-500",
                          todo.priority === "low" && "border-l-4 border-l-green-500",
                          isOverdue(todo) && "bg-red-50 border-l-red-600"
                        )}
                      >
                        <Circle className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {todo.title}
                          </p>
                          {todo.description && (
                            <p className="text-xs flex-wrap break-words whitespace-normal text-slate-500 mt-0.5 line-clamp-2">
                              {todo.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-5">
                            <Badge variant="secondary" className="text-xs">
                              {todo.category}
                            </Badge>
                            <Badge
                              className={cn("text-xs capitalize", PRIORITY_COLORS[todo.priority])}
                            >
                              {todo.priority}
                            </Badge>
                            {todo.end && (
                              <Badge
                                variant={isOverdue(todo) ? "destructive" : "outline"}
                                className="text-xs"
                              >
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                {format(todo.end, "MMM dd")}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {todo.image && (
                          <img
                            src={todo.image}
                            alt="Task"
                            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Chart data={data}></Chart>

            {/* Completed Tasks - Right Side */}
            <Card className="bg-white/90 backdrop-blur border-0 shadow-lg lg:col-start-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Completed Tasks
                  <Badge variant="secondary" className="ml-auto">
                    {completedTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {completedTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-500">No completed tasks yet</p>
                    </div>
                  ) : (
                    completedTasks.map((todo) => (
                      <Card
                        key={todo.id}
                        className="transition-all duration-200 hover:shadow-md border-l-4 border-l-green-500 opacity-75 cursor-pointer"
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-600 line-through truncate">{todo.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs opacity-75">
                                  {todo.category}
                                </Badge>
                                <Badge className={cn("text-xs opacity-75", PRIORITY_COLORS[todo.priority])}>
                                  {todo.priority}
                                </Badge>
                                {todo.end && (
                                  <Badge variant="outline" className="text-xs opacity-75">
                                    <CalendarIcon className="w-3 h-3 mr-1" />
                                    {format(todo.end, "MMM dd")}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
