import { useState } from "react"
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
import { Dayjs } from 'dayjs';
import { Textarea } from "./textarea";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { UploadIcon } from 'lucide-react';
import { useAuthContext } from "@/context/authContext";
import { add, addTodoWithFile } from "@/api/todo.api";
import { Bounce, ToastContainer, toast } from "react-toastify";
type Props ={
    setShowAddForm: (show: boolean) => void;
    onAdd: (todo: any) => void;
}
const CATEGORIES = ["Work", "Personal", "Shopping", "Others"]

export default function AddTask({setShowAddForm, onAdd}:Props) {
  const [time, setTime] = useState<Dayjs>();
  const [selectedCategory, setSelectedCategory] = useState("Personal")
  const [selectedPriority, setSelectedPriority] = useState<"low" | "medium" | "high">("medium")
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date()) 
  const [inputValue, setInputValue] = useState("")
  const [description,setDescription] = useState("")
  const [files, setFiles] = useState<File[] | undefined>();
  const {user} =useAuthContext()
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };
  const onChange: TimePickerProps['onChange'] = (value) => {
    setTime(value || undefined); 
  };

  const addTodo = async () => {
    if (!dueDate) return;

  let endDate = new Date(dueDate);
  if (time) {
    endDate.setHours(time.hour(), time.minute(), 0, 0);
  }

  if (inputValue.trim() !== "") {
    const newTodo = {
      title: inputValue.trim(),
      description,
      completed: false,
      start: new Date(),
      end: endDate,
      priority: selectedPriority,
      category: selectedCategory,
      actualTime: null,
      image: "" // placeholder, BE sẽ set nếu có file
    };

    try {
      let result;
      if (files && files.length > 0) {
        result = await addTodoWithFile(user!.id, newTodo, files[0]);
      } else {
        result = await add(user!.id, newTodo);
      }
      if(result){
          toast.success('🦄 Wow so easy!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          // window.location.reload()
        }else{
          toast.error('🦄 Wow so easy!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
        }
      console.log("Todo saved:", result);
      onAdd(result); // cập nhật FE từ response của BE
      setInputValue("");
      setDescription("");
      setFiles(undefined);
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  }
    }
    return (
                
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
                    <Textarea value={description} onChange={(e)=>{setDescription(e.target.value)}} placeholder="Description"></Textarea>


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


                    <div >
                    <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start bg-white">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "yyyy-MM-dd") : "Set due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate ?? new Date()} // dùng today làm default
                        onSelect={(date: Date) => {setDueDate(date)
                          console.log(date)
                        }}
                        required
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                    </div>
                    <TimePicker onChange={onChange} minuteStep={15} secondStep={10} hourStep={1} format={'HH:mm'} />
                    <Button onClick={addTodo} className="w-full mt-3 bg-slate-900 hover:bg-slate-800">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </CardContent>
                </Card>
    )
}