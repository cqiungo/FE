import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { TimePicker } from 'antd';
import type { TimePickerProps } from 'antd';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import dayjs from 'dayjs';

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
  dueDate?: Date
  priority: "low" | "medium" | "high"
  category: string
}
type Props ={
    setShowAddForm: (show: boolean) => void;
    onAdd: (todo: Todo) => void;
}
const CATEGORIES = ["Work", "Personal", "Shopping", "Others"]
  const onChange: TimePickerProps['onChange'] = (time, timeString) => {
    console.log(time, timeString);
  };

export default function AddTask({setShowAddForm, onAdd}:Props) {
  const [todos, setTodos] = useState<Todo>()
  const [selectedCategory, setSelectedCategory] = useState("Personal")
  const [selectedPriority, setSelectedPriority] = useState<"low" | "medium" | "high">("medium")
  const [dueDate, setDueDate] = useState<Date>()
  const [inputValue, setInputValue] = useState("")

  const addTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date(),
        dueDate,
        priority: selectedPriority,
        category: selectedCategory,
      }
      setInputValue("")
      setDueDate(undefined)
    }
  }
    return (
<Card className="bg-white/90 backdrop-blur border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add New Task
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddForm(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="What needs to be done?"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTodo()}
                      className="bg-white border-slate-200"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedPriority}
                        onValueChange={(value: "low" | "medium" | "high") => setSelectedPriority(value)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>


                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-white">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : "Set due date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                    <Button onClick={addTodo} className="w-full mt-3 bg-slate-900 hover:bg-slate-800">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </CardContent>
                </Card>
    )
}