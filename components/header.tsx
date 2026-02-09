import { ThemeToggle } from "@/components/theme-toggle"
import { Building2 } from "lucide-react"

export function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border bg-card px-5 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold leading-tight text-foreground sm:text-base">
            Nigeria Rental Assistant
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Find apartments with real costs and infrastructure insights
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  )
}
