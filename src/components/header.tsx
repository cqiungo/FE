import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/context/authContext"
import { Bell, Search, Plus, User, LogOut, Settings } from "lucide-react"
interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddTask: () => void
}

export function Header({ searchQuery, onSearchChange, onAddTask }: HeaderProps) {
  const {user} =useAuthContext();
  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Title and Search */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl flex font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              <p className="text-cyan-600">Task</p> Master Pro
            </h1>
            <p className="text-sm text-slate-500">Advanced task management</p>
          </div>

          <div className="relative w-96 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Right Section - Actions and Profile */}
        <div className="flex items-center gap-4">
          <Button onClick={onAddTask} className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>

          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
            <Bell className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
