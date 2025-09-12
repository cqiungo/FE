import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Trash2, CheckCircle2, Circle, CalendarIcon, CheckSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import StatsCard from "@/components/ui/stats-card"
import AddTask from "@/components/ui/add-task-dialog"
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
  dueDate?: Date
  priority: "low" | "medium" | "high"
  category: string
}

const CATEGORIES = ["Personal", "Work", "Shopping", "Health", "Learning", "Other"]
const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [activeView, setActiveView] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  dayjs.extend(customParseFormat);
  const addTodo = (todo: Todo) => {
    setTodos([todo, ...todos])
    setShowAddForm(false)
  }
  const isOverdue = (todo: Todo) => {
    return todo.dueDate && todo.dueDate < new Date() && !todo.completed
  }

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }))
      setTodos(parsedTodos)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])
  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const markAllCompleted = () => {
    setTodos(todos.map((todo) => ({ ...todo, completed: true })))
  }

  const deleteCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || todo.category === filterCategory
    const matchesPriority = filterPriority === "all" || todo.priority === filterPriority

    let matchesView = true
    if (activeView === "pending") matchesView = !todo.completed
    else if (activeView === "completed") matchesView = todo.completed
    else if (activeView === "overdue") matchesView = !!isOverdue(todo)
    else if (activeView === "high-priority") matchesView = todo.priority === "high" && !todo.completed

    return matchesSearch && matchesCategory && matchesPriority && matchesView
  })

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
    overdue: todos.filter((t) => t.dueDate && t.dueDate < new Date() && !t.completed).length,
    highPriority: todos.filter((t) => t.priority === "high" && !t.completed).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onAddTask={() => setShowAddForm(true)} />

        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <StatsCard stats={stats} />

          <div className="grid lg:grid-cols-3 gap-6">
            {showAddForm && (
              <div className="lg:col-span-1">
                <AddTask setShowAddForm={setShowAddForm} onAdd={addTodo} />

                {todos.length > 0 && (
                  <Card className="bg-white/90 backdrop-blur border-0 shadow-lg mt-6">
                    <CardHeader>
                      <CardTitle className="text-sm">Bulk Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" onClick={markAllCompleted} className="w-full text-sm bg-transparent">
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Mark All Complete
                      </Button>
                      <Button variant="outline" onClick={deleteCompleted} className="w-full text-sm bg-transparent">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Completed
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Tasks List */}
            <div className={cn("lg:col-span-2", !showAddForm && "lg:col-span-3")}>
              <Card className="bg-white/90 backdrop-blur border-0 shadow-lg">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex gap-2 ml-auto">
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-32 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger className="w-32 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredTodos.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-600 mb-2">No tasks found</h3>
                        <p className="text-slate-500">Try adjusting your filters or add a new task</p>
                      </div>
                    ) : (
                      filteredTodos.map((todo) => (
                        <Card
                          key={todo.id}
                          className={cn(
                            "transition-all duration-200 hover:shadow-md border-l-4",
                            todo.completed && "opacity-60",
                            todo.priority === "high" && "border-l-red-500",
                            todo.priority === "medium" && "border-l-yellow-500",
                            todo.priority === "low" && "border-l-green-500",
                            isOverdue(todo) && "bg-red-50 border-l-red-600",
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleTodo(todo.id)}
                                className="flex-shrink-0 mt-1 transition-colors hover:text-slate-700"
                              >
                                {todo.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-400" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <span
                                    className={cn(
                                      "text-slate-900 transition-all font-medium",
                                      todo.completed && "line-through text-slate-500",
                                    )}
                                  >
                                    {todo.text}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteTodo(todo.id)}
                                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <Badge variant="secondary" className="text-xs">
                                    {todo.category}
                                  </Badge>
                                  <Badge className={cn("text-xs", PRIORITY_COLORS[todo.priority])}>
                                    {todo.priority}
                                  </Badge>
                                  {todo.dueDate && (
                                    <Badge variant={isOverdue(todo) ? "destructive" : "outline"} className="text-xs">
                                      <CalendarIcon className="w-3 h-3 mr-1" />
                                      {format(todo.dueDate, "MMM dd")}
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
          </div>
        </main>
      </div>
    </div>
  )
}
