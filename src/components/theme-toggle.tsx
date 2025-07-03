
import { Moon, Sun, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="elegant-button rounded-full bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/25 w-12 h-12"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-white/80 dark:text-white/80 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all text-white/80 dark:text-white/80 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="elegant-glass border-white/20 backdrop-blur-2xl"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-3 hover:bg-white/10 text-white/90 rounded-xl m-1 px-4 py-3"
        >
          <Sun className="h-4 w-4 text-white/70" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-3 hover:bg-white/10 text-white/90 rounded-xl m-1 px-4 py-3"
        >
          <Moon className="h-4 w-4 text-white/70" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-3 hover:bg-white/10 text-white/90 rounded-xl m-1 px-4 py-3"
        >
          <Zap className="h-4 w-4 text-white/70" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
