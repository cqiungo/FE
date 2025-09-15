import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { TimePicker } from "antd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, X } from "lucide-react"
import type { Dayjs } from "dayjs"
import { Textarea } from "@/components/ui/textarea"
import { useAuthContext } from "@/context/authContext"
import { Bounce, ToastContainer, toast } from "react-toastify"
import { Dialog } from "@mui/material"
import type { Todo, Priority } from "@/types/todo.type"
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers"
import { update } from "@/api/todo.api"
type Props = {
  setShowEditForm: (show: boolean) => void
  onEdit: (todo: Todo) => void
  EditForm: boolean
  id: string
  currentTodo?: Todo // Added current todo data for pre-population
}

const CATEGORIES = ["Personal", "Work", "Shopping", "Health", "Learning", "Other"] // Updated to match main app categories

export default function EditTask({ setShowEditForm, onEdit, EditForm, id, currentTodo }: Props) {
  const [time, setTime] = useState<Dayjs | undefined>(currentTodo?.end ? dayjs(currentTodo.end) : undefined)
  const [selectedCategory, setSelectedCategory] = useState(currentTodo?.category || "Personal")
  const [selectedPriority, setSelectedPriority] = useState<Priority>(currentTodo?.priority || "medium")
const [dueDate, setDueDate] = useState<Dayjs | null>(
  currentTodo?.end ? dayjs(currentTodo.end) : null
)


  const [inputValue, setInputValue] = useState(currentTodo?.title || "")
  const [description, setDescription] = useState(currentTodo?.description || "")
  const { user } = useAuthContext()

useEffect(() => {
  if (currentTodo) {
    setInputValue(currentTodo.title || "")
    setDescription(currentTodo.description || "")
    setSelectedCategory(currentTodo.category || "Personal")
    setSelectedPriority(currentTodo.priority || "medium")
    setDueDate(currentTodo.end ? dayjs(currentTodo.end) : null)
    setTime(currentTodo.end ? dayjs(currentTodo.end) : undefined)
  }
}, [currentTodo])

const updateTodo = async () => {
  if (!dueDate || !currentTodo) return

  const endDate = dueDate.toDate()
  if (time) {
    endDate.setHours(time.hour(), time.minute(), 0, 0)
  }

  if (inputValue.trim() !== "") {
    const updatedTodo: Todo = {
      ...currentTodo,
      title: inputValue.trim(),
      description,
      end: endDate,
      priority: selectedPriority,
      category: selectedCategory,
    }

    try {
      const response = await update(id,{
          title: inputValue.trim(),
          description,
          end: endDate,
          priority: selectedPriority,
          category: selectedCategory,
          completed:currentTodo.completed,
          user:user?.id
        })
      if (response) {
        toast.success("Task updated successfully!", { autoClose: 2000 })
        onEdit(updatedTodo)
        setShowEditForm(false)
      } else {
        toast.error("Failed to update task!", { autoClose: 2000 })
      }
    } catch (err) {
      console.error("Error updating todo:", err)
      toast.error("Error updating task!", { autoClose: 2000 })
    }
  }
}

  return (
    <>
      <Dialog open={EditForm} onClose={() => setShowEditForm(false)}>
        <Card className="bg-white/90 backdrop-blur border-0 shadow-lg">
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Task
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditForm(false)}
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
              onKeyPress={(e) => e.key === "Enter" && updateTodo()}
              className="bg-white border-slate-200"
            />
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              placeholder="Description"
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

              <Select value={selectedPriority} onValueChange={(value: Priority) => setSelectedPriority(value)}>
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

            <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'TimePicker']}>
                <DatePicker
                label="Due date"
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                defaultValue={dayjs(currentTodo?.end)}
                />
                <TimePicker
                value={time}
                onChange={(newValue) => setTime(newValue)}
                getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                minuteStep={15}
                hourStep={1}
                format="HH:mm"

                />
            </DemoContainer>
            </LocalizationProvider>
            </div>
            <Button onClick={updateTodo} className="w-full mt-3 bg-slate-900 hover:bg-slate-800">
              <Edit className="w-4 h-4 mr-2" />
              Update Task
            </Button>
          </CardContent>
        </Card>
      </Dialog>
    </>
  )
}
